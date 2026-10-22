# app/models/problem.py
from typing import TYPE_CHECKING
import uuid
from datetime import datetime

from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from .base import Base

if TYPE_CHECKING:
    from app.models.topic import Topic
    from app.models.submission import Submission


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    slug: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True
    )

    url: Mapped[str] = mapped_column(Text)
    title: Mapped[str | None]
    difficulty: Mapped[str | None]
    description: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    topics: Mapped[list["Topic"]] = relationship(
        secondary="problem_topics",
        back_populates="problems"
    )

    submissions: Mapped[list["Submission"]] = relationship(
        back_populates="problem"
    )
