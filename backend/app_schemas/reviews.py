from datetime import date
from typing import Optional
from pydantic import BaseModel


class ReviewCreateSchema(BaseModel):
    class_id: int
    description: Optional[str] = None
    mark: int


class ReviewResponseSchema(BaseModel):
    id_review: int
    class_id: int
    user_id: int
    description: Optional[str] = None
    date: date
    mark: int

    class Config:
        orm_mode = True
