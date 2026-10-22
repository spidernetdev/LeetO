import hmac
import logging
import secrets

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import config
from app.auth.dependencies import bearer, get_current_user, resolve_user
from app.auth.oauth import (
    OAuthError,
    add_query_params,
    build_google_auth_url,
    default_frontend_redirect,
    ensure_google_configured,
    exchange_code,
    is_allowed_frontend_url,
    resolve_frontend_redirect,
    verify_google_id_token,
)
from app.auth.security import (
    create_state,
    create_token,
    decode_state,
    hash_binding,
)
from app.db.database import get_db
from app.models.user import User
from app.services.auth_service import upsert_google_user

logger = logging.getLogger("leettracker.auth")

router = APIRouter(prefix="/api/auth", tags=["Auth"])

COOKIE_SAMESITE = "lax"


# ============================================================
# helpers
# ============================================================

def user_json(user: User) -> dict:
    return {
        "id": str(user.id),
        "username": user.name or user.email,
        "email": user.email,
        "avatarUrl": user.avatar_url,
        "googleId": user.provider_id,
        "role": user.role,
    }


def _no_cache(response):
    # The redirect URL contains a token: keep it out of caches and Referer headers.
    response.headers["Cache-Control"] = "no-store"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response


def _clear_binding_cookie(response) -> None:
    response.delete_cookie(
        config.OAUTH_COOKIE, path="/api/auth/google",
        secure=config.COOKIE_SECURE, httponly=True, samesite=COOKIE_SAMESITE,
    )


def _fail_redirect(target: str, message: str) -> RedirectResponse:
    """Send the browser back to the frontend with ?error=... (the frontend shows it)."""
    response = RedirectResponse(add_query_params(target, error=message), status_code=302)
    _clear_binding_cookie(response)
    return _no_cache(response)


# ============================================================
# 5.2  GET /api/auth/google   -> redirect to Google
# ============================================================

@router.get("/google")
async def google_login(redirect_uri: str | None = None):
    try:
        ensure_google_configured()
    except OAuthError as e:
        raise HTTPException(status_code=503, detail=e.message)

    try:
        target = resolve_frontend_redirect(redirect_uri)
    except ValueError:
        raise HTTPException(status_code=400, detail="redirect_uri is not an allowed frontend URL")

    binding = secrets.token_urlsafe(32)   # proves the callback is from the same browser
    nonce = secrets.token_urlsafe(32)     # must come back inside Google's ID token
    state = create_state(target, binding, nonce)

    response = RedirectResponse(build_google_auth_url(state, nonce), status_code=302)
    response.set_cookie(
        config.OAUTH_COOKIE, binding,
        max_age=config.OAUTH_STATE_MINUTES * 60,
        path="/api/auth/google",
        httponly=True, secure=config.COOKIE_SECURE, samesite=COOKIE_SAMESITE,
    )
    return _no_cache(response)


# ============================================================
# 5.3  GET /api/auth/google/callback   -> session + redirect to frontend
# ============================================================

@router.get("/google/callback")
async def google_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    fallback = default_frontend_redirect()

    # 1. State must be one WE signed, and recent.
    try:
        state_data = decode_state(state or "")
    except jwt.PyJWTError:
        return _fail_redirect(fallback, "Sign-in session expired. Please try again.")

    target = state_data.get("ru")
    if not target or not is_allowed_frontend_url(target):
        target = fallback

    # 2. CSRF check: the cookie set when the login started must match the state.
    binding = request.cookies.get(config.OAUTH_COOKIE)
    if not binding or not hmac.compare_digest(hash_binding(binding), state_data["cb"]):
        return _fail_redirect(target, "Sign-in could not be verified. Please try again.")

    # 3. Google reported a problem (user pressed Cancel, etc.)
    if error:
        message = (
            "Google sign-in was cancelled."
            if error == "access_denied"
            else "Google sign-in failed. Please try again."
        )
        return _fail_redirect(target, message)

    if not code:
        return _fail_redirect(target, "Google did not return a sign-in code.")

    # 4. code -> Google ID token -> verified identity
    try:
        id_token_value = await exchange_code(code)
        claims = await verify_google_id_token(id_token_value, expected_nonce=state_data["n"])
        user = await upsert_google_user(db, claims)
    except OAuthError as e:
        await db.rollback()
        return _fail_redirect(target, e.message)
    except Exception:
        await db.rollback()
        logger.exception("Google sign-in failed")
        return _fail_redirect(target, "Could not complete sign-in. Please try again.")

    # 5. Our own session: JWT in the redirect (frontend keeps it) + HTTP-only cookie.
    token = create_token(user, "full", config.SESSION_MINUTES)

    response = RedirectResponse(add_query_params(target, token=token), status_code=302)
    response.set_cookie(
        config.SESSION_COOKIE, token,
        max_age=config.SESSION_MINUTES * 60,
        path="/",
        httponly=True, secure=config.COOKIE_SECURE, samesite=COOKIE_SAMESITE,
    )
    _clear_binding_cookie(response)
    return _no_cache(response)


# ============================================================
# 5.4  GET /api/auth/me
# ============================================================

@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return user_json(user)


# ============================================================
# 5.5  POST /api/auth/logout
# ============================================================

@router.post("/logout")
async def logout(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
):
    # Always succeeds (logging out twice is fine). If the caller is really signed in,
    # bump token_version: this token, other tabs and the extension token all stop working.
    user = await resolve_user(request, creds, db, {"full", "submit"})
    if user is not None:
        user.token_version += 1
        await db.commit()

    response = JSONResponse({"success": True, "message": "Session terminated successfully"})
    response.delete_cookie(
        config.SESSION_COOKIE, path="/",
        secure=config.COOKIE_SECURE, httponly=True, samesite=COOKIE_SAMESITE,
    )
    return response


# ============================================================
# Extra: limited token for the Chrome extension
# ============================================================

@router.post("/extension-token")
async def extension_token(user: User = Depends(get_current_user)):
    """The extension only needs to POST submissions, so it gets a token that can do
    nothing else. If it leaks, the damage is limited to adding submissions."""
    return {
        "success": True,
        "extension_token": create_token(user, "submit", config.EXTENSION_MINUTES),
        "expires_in_minutes": config.EXTENSION_MINUTES,
    }