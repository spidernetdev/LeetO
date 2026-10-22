from typing import TYPE_CHECKING
import uuid

from sqlalchemy import String, Text, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from .base import Base

if TYPE_CHECKING:
    from app.models.submission import Submission


class Pattern(Base):
    __tablename__ = "patterns"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # ============================================================
    # HIERARCHY
    # ============================================================
    # Example:
    #
    # Hashing
    #   ├── Hash Map / Dictionary
    #   ├── Frequency Counting
    #   └── Existence / Lookup
    #
    # parent_id is NULL for main patterns.
    # parent_id points to the main pattern for subpatterns.
    # ============================================================

    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "patterns.id",
            ondelete="CASCADE"
        ),
        nullable=True,
        index=True
    )

    parent: Mapped["Pattern | None"] = relationship(
        "Pattern",
        remote_side="Pattern.id",
        back_populates="children"
    )

    children: Mapped[list["Pattern"]] = relationship(
        "Pattern",
        back_populates="parent",
        cascade="all, delete-orphan"
    )

    # ============================================================
    # SUBMISSIONS
    # ============================================================

    submissions: Mapped[list["Submission"]] = relationship(
        secondary="submission_patterns",
        back_populates="patterns"
    )


class SubmissionPattern(Base):
    __tablename__ = "submission_patterns"

    submission_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "submissions.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    )

    pattern_id: Mapped[int] = mapped_column(
        ForeignKey(
            "patterns.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    )

    # Confidence returned by the LLM.
    # Example: 0.95
    confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    # Explanation returned by the LLM.
    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )