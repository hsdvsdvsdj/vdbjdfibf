from datetime import datetime
from pydantic import BaseModel


class OrderCreateSchema(BaseModel):
    class_id: int


class OrderResponseSchema(BaseModel):
    id_order: int
    class_id: int
    buyer_id: int
    seller_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
