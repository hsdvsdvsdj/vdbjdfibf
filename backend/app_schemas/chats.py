from datetime import datetime
from pydantic import BaseModel


class MessageCreateSchema(BaseModel):
    message: str


class MessageResponseSchema(BaseModel):
    id_messages: int
    id_chat: int
    user_id: int
    message: str
    datetime: datetime

    class Config:
        from_attributes = True


class ChatResponseSchema(BaseModel):
    id_chat: int
    class_id: int
    id_user1: int
    id_user2: int
    messages: list[MessageResponseSchema] = []

    class Config:
        from_attributes = True
