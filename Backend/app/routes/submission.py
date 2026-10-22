from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_submission_user
from app.controllers.submission import receive_submission
from app.models.user import User
from ..db.database import get_db
from ..schemas.submission import SubmissionCreate

router = APIRouter(prefix="/api/submissions", tags=["Submissions"])


# Accepts the full website token AND the limited Chrome-extension token.
@router.post("")
async def create_submission(
    data: SubmissionCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_submission_user),
):
    return await receive_submission(data, db, user)