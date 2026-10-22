import logging

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.services.submission_service import process_submission

logger = logging.getLogger("leettracker.submissions")


async def receive_submission(data, db: AsyncSession, user: User):
    try:
        result = await process_submission(data=data, db=db, user_id=user.id)
    except Exception:
        await db.rollback()
        logger.exception("Failed to process submission")
        raise HTTPException(status_code=500, detail="Failed to process submission")

    return {
        "success": True,
        "message": "Submission received successfully",
        "submission_id": str(result["submission"].id),
        "analysis": result["analysis"],
    }