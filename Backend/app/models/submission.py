# app/models/submission.py
from typing import TYPE_CHECKING
import uuid
from datetime import datetime

from sqlalchemy import Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from .base import Base

if TYPE_CHECKING:
    from app.models.problem import Problem
    from app.models.pattern import Pattern
    from app.models.solution_analysis import SolutionAnalysis


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True
    )

    problem_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("problems.id", ondelete="CASCADE"),
        index=True
    )

    code: Mapped[str] = mapped_column(Text)
    language: Mapped[str | None]
    status: Mapped[str]

    submitted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    problem: Mapped["Problem"] = relationship(
        back_populates="submissions"
    )

    patterns: Mapped[list["Pattern"]] = relationship(
        secondary="submission_patterns",
        back_populates="submissions"
    )

    analysis: Mapped["SolutionAnalysis | None"] = relationship(
    back_populates="submission",
    uselist=False,
    cascade="all, delete-orphan"
    )