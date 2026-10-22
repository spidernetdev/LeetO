"""All auth-related settings, read once from the environment (.env)."""
import os

from dotenv import load_dotenv

load_dotenv()


def _csv(name: str, default: str = "") -> list[str]:
    raw = os.getenv(name, default)
    return [item.strip().rstrip("/") for item in raw.split(",") if item.strip()]


def _bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes"}


# ---------------- Google OAuth (checked when a login starts) ----------------
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# Must be registered in Google Cloud Console -> Authorized redirect URIs
GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback"
)

# ---------------- Frontend(s) allowed to receive the login token ----------------
FRONTEND_ORIGINS = _csv("FRONTEND_ORIGINS", "http://localhost:3000")
# Optional, e.g. https://[a-z0-9-]+\.run\.app  (matched against the whole origin)
FRONTEND_ORIGIN_REGEX = os.getenv("FRONTEND_ORIGIN_REGEX") or None
DEFAULT_REDIRECT_PATH = os.getenv("DEFAULT_REDIRECT_PATH", "/overview")

# ---------------- Our own session tokens ----------------
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET or len(JWT_SECRET) < 32:
    raise RuntimeError(
        "JWT_SECRET must be set in .env and be at least 32 characters. "
        'Generate one with: python -c "import secrets; print(secrets.token_urlsafe(48))"'
    )

JWT_ALGORITHM = "HS256"
SESSION_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", str(60 * 24)))
EXTENSION_MINUTES = int(os.getenv("EXTENSION_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7)))
OAUTH_STATE_MINUTES = 10

# ---------------- Cookies ----------------
SESSION_COOKIE = "leeto_session"
OAUTH_COOKIE = "leeto_oauth_binding"
COOKIE_SECURE = _bool("COOKIE_SECURE", False)  # set true in production (HTTPS)