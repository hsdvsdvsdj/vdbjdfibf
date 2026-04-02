from typing import Optional
from pydantic import BaseModel, EmailStr


class RegisterSchema(BaseModel):
    login: str
    password: str


class LoginSchema(BaseModel):
    login: str
    password: str


class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponseSchema(BaseModel):
    id: int
    login: str
    email: Optional[EmailStr] = None
    nickname: Optional[str] = None
    photo: Optional[str] = None
    is_verified: bool

    class Config:
        from_attributes = True