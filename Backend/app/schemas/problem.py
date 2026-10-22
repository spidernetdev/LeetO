from pydantic import BaseModel

class Problem(BaseModel):
    slug: str
    url: str
    title: str | None
    difficulty: str | None
    topics: list[str]
    description: str | None