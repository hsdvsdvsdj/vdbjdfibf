from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError
from datetime import datetime, timezone

from auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_refresh_expire_datetime,
)
from core.config import settings
from crud.user import (
    get_user_by_login,
    get_user_by_login_or_email,
    create_user,
    get_user_by_id,
)
from crud.token import (
    save_refresh_token,
    get_refresh_token,
    delete_refresh_token,
    delete_user_refresh_tokens,
    delete_expired_refresh_tokens,
)
from database.db import DatabaseInteraction
from app_schemas.auth import RegisterSchema, LoginSchema, TokenResponseSchema, UserResponseSchema
from auth.dependencies import get_current_user
from database.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])


def set_refresh_cookie(response: Response, refresh_token: str):
    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )


def clear_refresh_cookie(response: Response):
    response.delete_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        path="/"
    )


@router.post("/register", response_model=TokenResponseSchema)
async def register_user(
    user_data: RegisterSchema,
    response: Response,
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session)
):
    existing_user = await get_user_by_login_or_email(
        session=session,
        login=user_data.login,
        email=user_data.email
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким login или email уже существует"
        )

    user = await create_user(
        session=session,
        login=user_data.login,
        hashed_password=hash_password(user_data.password),
        email=user_data.email,
        nickname=user_data.nickname,
    )

    access_token = create_access_token({
        "sub": str(user.id),
        "login": user.login
    })

    refresh_token = create_refresh_token({
        "sub": str(user.id),
        "login": user.login
    })

    await save_refresh_token(
        session=session,
        token=refresh_token,
        user_id=user.id,
        expires_at=get_refresh_expire_datetime()
    )

    set_refresh_cookie(response, refresh_token)

    return TokenResponseSchema(access_token=access_token)


@router.post("/login", response_model=TokenResponseSchema)
async def login_user(
    user_data: LoginSchema,
    response: Response,
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session)
):
    user = await get_user_by_login(session, user_data.login)

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль"
        )

    await delete_expired_refresh_tokens(session)
    await delete_user_refresh_tokens(session, user.id)

    access_token = create_access_token({
        "sub": str(user.id),
        "login": user.login
    })

    refresh_token = create_refresh_token({
        "sub": str(user.id),
        "login": user.login
    })

    await save_refresh_token(
        session=session,
        token=refresh_token,
        user_id=user.id,
        expires_at=get_refresh_expire_datetime()
    )

    set_refresh_cookie(response, refresh_token)

    return TokenResponseSchema(access_token=access_token)


@router.post("/refresh", response_model=TokenResponseSchema)
async def refresh_access_token(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session)
):
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token отсутствует"
        )

    db_token = await get_refresh_token(session, refresh_token)
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token не найден"
        )

    if db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        await delete_refresh_token(session, refresh_token)
        clear_refresh_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token истек"
        )

    try:
        payload = decode_token(refresh_token)
        token_type = payload.get("type")
        user_id = payload.get("sub")

        if token_type != "refresh" or not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный refresh token"
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный refresh token"
        )

    user = await get_user_by_id(session, int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден"
        )

    new_access_token = create_access_token({
        "sub": str(user.id),
        "login": user.login
    })

    return TokenResponseSchema(access_token=new_access_token)


@router.post("/logout")
async def logout_user(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session)
):
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)

    if refresh_token:
        await delete_refresh_token(session, refresh_token)

    clear_refresh_cookie(response)

    return {"message": "Вы успешно вышли из системы"}


@router.get("/me", response_model=UserResponseSchema)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user