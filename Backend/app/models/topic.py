# app/models/topic.py
from typing import TYPE_CHECKING
import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from app.models.problem import Problem


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)

    problems: Mapped[list["Problem"]] = relationship(
        secondary="problem_topics",
        back_populates="topics"
    )


class ProblemTopic(Base):
    __tablename__ = "problem_topics"

    problem_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("problems.id", ondelete="CASCADE"),
        primary_key=True
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey("topics.id", ondelete="CASCADE"),
        primary_key=True
    )
