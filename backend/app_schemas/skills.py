from typing import Optional
from pydantic import BaseModel, condecimal


class SkillBaseSchema(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    duration: Optional[int] = None  # в минутах
    # для совместимости со старой схемой
    name: Optional[str] = None
    learnings: Optional[str] = None
    cost: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    coef_prom: Optional[condecimal(max_digits=10, decimal_places=2)] = None


class SkillCreateSchema(SkillBaseSchema):
    pass


class SkillUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    duration: Optional[int] = None
    name: Optional[str] = None
    learnings: Optional[str] = None
    cost: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    coef_prom: Optional[condecimal(max_digits=10, decimal_places=2)] = None


class SkillResponseSchema(SkillBaseSchema):
    class_id: int
    user_id: int

    class Config:
        orm_mode = True
