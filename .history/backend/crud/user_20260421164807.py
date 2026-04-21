from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import User


async def get_user_by_login(session: AsyncSession, login: str):
    norm = login.strip().lower()
    result = await session.execute(
        select(User).where(func.lower(User.login) == norm)
    )
    return result.scalar_one_or_none()


async def get_user_by_email(session: AsyncSession, email: str):
    if email is None:
        return None
    result = await session.execute(
        select(User).where(func.lower(User.email) == email.strip().lower())
    )
    return result.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id: int):
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def get_user_by_login_or_email(session: AsyncSession, login: str, email: str | None):
    norm_login = login.strip().lower()
    conditions = [func.lower(User.login) == norm_login]
    if email:
        conditions.append(func.lower(User.email) == email.strip().lower())

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
    norm_login = login.strip().lower()
    norm_email = email.strip().lower() if email else None

    user = User(
        login=norm_login,
        hashed_password=hashed_password,
        email=norm_email,
        nickname=nickname,
        is_verified=False
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def update_user(session: AsyncSession, user_id: int, data: dict):
    user = await get_user_by_id(session, user_id)
    if not user:
        return None

    for key, value in data.items():
        if hasattr(user, key) and value is not None and key != "id" and key != "login":
            setattr(user, key, value)

    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user