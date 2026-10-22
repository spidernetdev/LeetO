from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import config
from .db.database import create_tables, get_db
from .routes.auth import router as auth_router
from .routes.problems import router as problems_router
from .routes.stats import router as stats_router
from .routes.submission import router as submission_router

# Import every model so create_all() knows about every table.
import app.models  # noqa: F401
from app.models.solution_analysis import SolutionAnalysis  # noqa: F401


app = FastAPI()

# ============================================================
# CORS  (browser calls from the Next.js frontend)
# ============================================================
# Origins come from FRONTEND_ORIGINS in .env. A wildcard like "https://*.run.app"
# does NOT work in allow_origins; use FRONTEND_ORIGIN_REGEX for that.
# allow_credentials=True requires explicit origins (never "*").
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.FRONTEND_ORIGINS,
    allow_origin_regex=config.FRONTEND_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/healthz")
async def health():
    return {"status": "ok"}


@app.on_event("startup")
async def startup():
    await create_tables()


@app.get("/api/")
async def home(db: AsyncSession = Depends(get_db)):
    return {"message": "Db Connected"}


app.include_router(auth_router)
app.include_router(problems_router)
app.include_router(stats_router)
app.include_router(submission_router)