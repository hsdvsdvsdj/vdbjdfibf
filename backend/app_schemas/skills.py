from typing import Optional
from pydantic import BaseModel, condecimal


class SkillBaseSchema(BaseModel):
    name: str
    description: Optional[str] = None
    learnings: Optional[str] = None
    cost: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    coef_prom: Optional[condecimal(max_digits=10, decimal_places=2)] = None


class SkillCreateSchema(SkillBaseSchema):
    pass


class SkillUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    learnings: Optional[str] = None
    cost: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    coef_prom: Optional[condecimal(max_digits=10, decimal_places=2)] = None


class SkillResponseSchema(SkillBaseSchema):
    class_id: int
    user_id: int

    class Config:
        orm_mode = True
