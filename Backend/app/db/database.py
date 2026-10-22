from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os
from ..models.base import Base

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DB_URI")

if not DATABASE_URL:
    raise RuntimeError("DB_URI is not configured")

engine = create_async_engine(DATABASE_URL, echo=True ,pool_pre_ping=True,)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session



async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
