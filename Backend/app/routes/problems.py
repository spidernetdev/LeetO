from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.services.problem_service import get_problem_detail, list_problems

router = APIRouter(prefix="/api/problems", tags=["Problems"])


@router.get("")
async def list_problems_endpoint(
    search: str | None = Query(None, max_length=100),
    difficulty: str | None = Query(None, max_length=20),
    pattern: str | None = Query(None, max_length=100),
    topic: str | None = Query(None, max_length=100),
    sort: Literal["newest", "oldest", "difficulty", "alphabetical"] = "newest",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await list_problems(
        db=db,
        user_id=user.id,
        search=(search or "").strip() or None,
        difficulty=(difficulty or "").strip() or None,
        pattern=(pattern or "").strip() or None,
        topic=(topic or "").strip() or None,
        sort=sort,
        page=page,
        page_size=page_size,
    )


@router.get("/{slug}")
async def get_problem_endpoint(
    slug: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    problem = await get_problem_detail(db=db, user_id=user.id, slug=slug)

    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")

    return problem