"""FastAPI dependencies that turn a request into the logged-in User."""
import uuid

import jwt
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import config
from app.auth.security import decode_token
from app.db.database import get_db
from app.models.user import User

bearer = HTTPBearer(auto_error=False)

UNAUTHORIZED_MESSAGE = "Could not validate credentials or session expired"


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=401,
        detail=UNAUTHORIZED_MESSAGE,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def resolve_user(
    request: Request,
    creds: HTTPAuthorizationCredentials | None,
    db: AsyncSession,
    allowed_scopes: set[str],
) -> User | None:
    """Return the user for a valid token, otherwise None. Never raises."""
    if creds is not None:                       # Authorization: Bearer <jwt>  (preferred)
        token, scopes = creds.credentials, allowed_scopes
    else:                                       # HTTP-only session cookie
        token = request.cookies.get(config.SESSION_COOKIE)
        scopes = allowed_scopes & {"full"}      # a cookie never carries the extension scope

    if not token:
        return None

    try:
        payload = decode_token(token)
        user_id = uuid.UUID(payload["sub"])
    except (jwt.PyJWTError, ValueError, KeyError):
        return None

    if payload.get("scope") not in scopes:
        return None

    user = await db.get(User, user_id)
    if user is None or payload.get("ver") != user.token_version:    # revoked by logout
        return None

    return user


# Every normal endpoint (me, problems, stats, analytics, ...)
async def get_current_user(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> User:
    user = await resolve_user(request, creds, db, {"full"})
    if user is None:
        raise _unauthorized()
    return user


# POST /api/submissions only: also accepts the limited Chrome-extension token
async def get_submission_user(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> User:
    user = await resolve_user(request, creds, db, {"full", "submit"})
    if user is None:
        raise _unauthorized()
    return user