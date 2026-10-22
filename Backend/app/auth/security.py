"""Creating and checking our own signed tokens (session + OAuth state)."""
import hashlib
from datetime import datetime, timedelta, timezone

import jwt

from app.auth import config

SESSION_ISSUER = "leettracker-api"
STATE_ISSUER = "leettracker-oauth-state"   # different issuer => the two token kinds
                                           # can never be mistaken for each other


# ============================================================
# SESSION TOKENS
# ============================================================

def create_token(user, scope: str, minutes: int) -> str:
    """scope 'full'   = website session (every endpoint)
       scope 'submit' = Chrome extension (only POST /api/submissions)

       'ver' ties the token to user.token_version, so logout can revoke it."""
    now = datetime.now(timezone.utc)
    payload = {
        "iss": SESSION_ISSUER,
        "sub": str(user.id),
        "scope": scope,
        "ver": user.token_version,
        "iat": now,
        "exp": now + timedelta(minutes=minutes),
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm=config.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Raises jwt.PyJWTError for a bad signature, expiry, wrong issuer, missing claims."""
    return jwt.decode(
        token,
        config.JWT_SECRET,
        algorithms=[config.JWT_ALGORITHM],
        issuer=SESSION_ISSUER,
        options={"require": ["exp", "sub", "scope", "ver"]},
    )


# ============================================================
# OAUTH STATE (CSRF protection for the Google redirect)
# ============================================================

def hash_binding(binding: str) -> str:
    return hashlib.sha256(binding.encode()).hexdigest()


def create_state(redirect_uri: str, binding: str, nonce: str) -> str:
    """The signed 'state' sent to Google and returned to our callback.

    redirect_uri : where to send the browser afterwards (already allow-listed)
    binding      : random value that is ALSO stored in an HttpOnly cookie; only the
                   browser that started the login has the cookie
    nonce        : echoed back inside Google's ID token
    """
    now = datetime.now(timezone.utc)
    payload = {
        "iss": STATE_ISSUER,
        "ru": redirect_uri,
        "cb": hash_binding(binding),
        "n": nonce,
        "iat": now,
        "exp": now + timedelta(minutes=config.OAUTH_STATE_MINUTES),
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm=config.JWT_ALGORITHM)


def decode_state(state: str) -> dict:
    return jwt.decode(
        state,
        config.JWT_SECRET,
        algorithms=[config.JWT_ALGORITHM],
        issuer=STATE_ISSUER,
        options={"require": ["exp", "ru", "cb", "n"]},
    )