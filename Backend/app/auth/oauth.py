"""Talking to Google + safe handling of the post-login redirect."""
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import httpx
from fastapi.concurrency import run_in_threadpool
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

from app.auth import config

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"


class OAuthError(Exception):
    """message is safe to show to the user (it ends up in ?error=...)."""

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


# ============================================================
# REDIRECT ALLOW-LIST  (prevents an "open redirect" token leak)
# ============================================================

def default_frontend_redirect() -> str:
    origin = config.FRONTEND_ORIGINS[0] if config.FRONTEND_ORIGINS else "http://localhost:3000"
    return origin + config.DEFAULT_REDIRECT_PATH


def is_allowed_frontend_url(url: str) -> bool:
    """True only for absolute http(s) URLs whose ORIGIN is on our allow-list."""
    if not url or "\\" in url or any(ord(c) < 32 for c in url):
        return False

    try:
        parts = urlsplit(url)
        _ = parts.port  # raises ValueError on an invalid port
    except ValueError:
        return False

    if parts.scheme not in ("http", "https") or not parts.hostname:
        return False
    if parts.username is not None or parts.password is not None:   # http://good@evil.com
        return False

    origin = f"{parts.scheme}://{parts.netloc}".lower()

    if origin in (o.lower() for o in config.FRONTEND_ORIGINS):
        return True

    if config.FRONTEND_ORIGIN_REGEX:
        return re.fullmatch(config.FRONTEND_ORIGIN_REGEX, origin) is not None

    return False


def resolve_frontend_redirect(redirect_uri: str | None) -> str:
    """No redirect_uri -> default. Not allow-listed -> ValueError."""
    if not redirect_uri:
        return default_frontend_redirect()
    if not is_allowed_frontend_url(redirect_uri):
        raise ValueError("redirect_uri is not an allowed frontend URL")
    return redirect_uri


def add_query_params(url: str, **params: str) -> str:
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.update(params)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


# ============================================================
# GOOGLE
# ============================================================

def ensure_google_configured() -> None:
    if not (config.GOOGLE_CLIENT_ID and config.GOOGLE_CLIENT_SECRET):
        raise OAuthError("Google sign-in is not configured on the server.")


def build_google_auth_url(state: str, nonce: str) -> str:
    query = urlencode(
        {
            "client_id": config.GOOGLE_CLIENT_ID,
            "response_type": "code",
            "scope": "openid email profile",
            "redirect_uri": config.GOOGLE_REDIRECT_URI,
            "state": state,
            "nonce": nonce,
            "prompt": "select_account",
        }
    )
    return f"{GOOGLE_AUTH_URL}?{query}"


async def exchange_code(code: str) -> str:
    """Trade the one-time authorization code for Google's ID token."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "code": code,
                    "client_id": config.GOOGLE_CLIENT_ID,
                    "client_secret": config.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": config.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )
    except httpx.HTTPError:
        raise OAuthError("Could not reach Google. Please try again.")

    if response.status_code != 200:
        raise OAuthError("Google rejected the sign-in code. Please try again.")

    token = response.json().get("id_token")
    if not token:
        raise OAuthError("Google did not return an identity token.")
    return token


def _verify_sync(token: str) -> dict:
    # Checks signature (Google's public keys), expiry, issuer and audience.
    return google_id_token.verify_oauth2_token(
        token,
        google_requests.Request(),
        config.GOOGLE_CLIENT_ID,
        clock_skew_in_seconds=10,
    )


async def verify_google_id_token(token: str, expected_nonce: str) -> dict:
    try:
        claims = await run_in_threadpool(_verify_sync, token)
    except ValueError:
        raise OAuthError("Invalid or expired Google identity token.")

    if claims.get("nonce") != expected_nonce:
        raise OAuthError("Google sign-in could not be verified. Please try again.")
    if not claims.get("email_verified") or not claims.get("email") or not claims.get("sub"):
        raise OAuthError("Your Google email address is not verified.")

    return claims