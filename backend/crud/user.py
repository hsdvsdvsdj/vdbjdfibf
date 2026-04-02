from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import User


async def get_user_by_login(session: AsyncSession, login: str):
    result = await session.execute(
        select(User).where(User.login == login)
    )
    return result.scalar_one_or_none()


async def get_user_by_email(session: AsyncSession, email: str):
    result = await session.execute(
        select(User).where(User.email == email)
    )
    return result.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id: int):
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def get_user_by_login_or_email(session: AsyncSession, login: str, email: str | None):
    conditions = [User.login == login]
    if email:
        conditions.append(User.email == email)

    result = await session.execute(
        select(User).where(or_(*conditions))
    )
    return result.scalar_one_or_none()


async def create_user(
    session: AsyncSession,
    login: str,
    hashed_password: str,
    email: str | None = None,
    nickname: str | None = None,
):
    user = User(
        login=login,
        hashed_password=hashed_password,
        email=email,
        nickname=nickname,
        is_verified=False
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user