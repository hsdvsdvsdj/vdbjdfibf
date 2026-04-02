from typing import Optional
from pydantic import BaseModel, EmailStr


class UserUpdateSchema(BaseModel):
    nickname: Optional[str] = None
    email: Optional[EmailStr] = None
    photo: Optional[str] = None


class UserResponseSchema(BaseModel):
    id: int
    login: str
    email: Optional[EmailStr] = None
    nickname: Optional[str] = None
    photo: Optional[str] = None
    is_verified: bool

    class Config:
        
        from_attributes = True
