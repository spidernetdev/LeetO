from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.oauth import OAuthError
from app.models.user import User


async def _find_user(db: AsyncSession, sub: str, email: str) -> User | None:
    user = (
        await db.execute(select(User).where(User.provider_id == sub))
    ).scalar_one_or_none()
    if user is not None:
        return user

    return (
        await db.execute(select(User).where(func.lower(User.email) == email))
    ).scalar_one_or_none()


async def upsert_google_user(db: AsyncSession, claims: dict) -> User:
    """Create the user on first login, update profile details on later logins.

    `claims` must come from a VERIFIED Google ID token (never from the request).
    """
    sub = claims["sub"]
    email = claims["email"].strip().lower()
    name = claims.get("name")
    picture = claims.get("picture")

    user = await _find_user(db, sub, email)

    if user is None:
        user = User(
            email=email,
            name=name or email.split("@")[0],
            auth_provider="google",
            provider_id=sub,
            avatar_url=picture,
            role="developer",
            token_version=0,
        )
        db.add(user)
    else:
        if user.provider_id and user.provider_id != sub:
            raise OAuthError("This email is already linked to a different Google account.")

        user.provider_id = user.provider_id or sub     # link an older email-only account
        user.auth_provider = user.auth_provider or "google"
        if not user.name:
            user.name = name or email.split("@")[0]
        if picture and user.avatar_url != picture:
            user.avatar_url = picture

    user.last_login_at = datetime.now(timezone.utc)

    try:
        await db.commit()
    except IntegrityError:
        # Two first-time logins raced; the other one created the row. Use it.
        await db.rollback()
        user = await _find_user(db, sub, email)
        if user is None:
            raise
        user.last_login_at = datetime.now(timezone.utc)
        await db.commit()

    await db.refresh(user)
    return user