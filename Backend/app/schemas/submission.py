from pydantic import BaseModel
from .problem import Problem

class SubmissionCreate(BaseModel):
    problem: Problem
    code: str
    language: str | None
    status: str