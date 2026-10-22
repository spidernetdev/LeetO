import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


if TYPE_CHECKING:
    from app.models.submission import Submission


class SolutionAnalysis(Base):
    __tablename__ = "solution_analyses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    submission_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("submissions.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    data_structures: Mapped[list[str]] = mapped_column(
        JSONB,
        default=list
    )

    algorithms: Mapped[list[str]] = mapped_column(
        JSONB,
        default=list
    )

    time_complexity: Mapped[str | None] = mapped_column(
        Text
    )

    space_complexity: Mapped[str | None] = mapped_column(
        Text
    )

    explanation: Mapped[str | None] = mapped_column(
        Text
    )

    submission: Mapped["Submission"] = relationship(
        back_populates="analysis"
    )