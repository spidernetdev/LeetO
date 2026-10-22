import uuid
from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str | None]

    auth_provider: Mapped[str | None]                       # "google"
    provider_id: Mapped[str | None] = mapped_column(        # Google "sub"
        String, unique=True, index=True
    )

    avatar_url: Mapped[str | None] = mapped_column(Text)
    role: Mapped[str] = mapped_column(
        String, default="developer", server_default="developer"
    )

    # Logout bumps this number; every token carries the value it was issued with,
    # so older tokens stop working immediately.
    token_version: Mapped[int] = mapped_column(
        Integer, default=0, server_default="0"
    )

    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )