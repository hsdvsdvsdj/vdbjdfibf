from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_user
from crud.user import get_user_by_id, update_user
from database.db import DatabaseInteraction
from app_schemas.users import UserResponseSchema, UserUpdateSchema
from database.models import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponseSchema)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponseSchema)
async def read_user(user_id: int, session: AsyncSession = Depends(DatabaseInteraction.get_async_session)):
    user = await get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    return user


@router.put("/me", response_model=UserResponseSchema)
async def update_current_user(
    user_data: UserUpdateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    updated_user = await update_user(session, current_user.id, user_data.dict(exclude_unset=True))
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    return updated_user
