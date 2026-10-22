from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.services.stats_service import get_analytics, get_dashboard_stats

router = APIRouter(prefix="/api", tags=["Stats"])


@router.get("/dashboard/stats")
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await get_dashboard_stats(db=db, user_id=user.id)


@router.get("/analytics")
async def analytics(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await get_analytics(db=db, user_id=user.id)