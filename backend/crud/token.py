from datetime import datetime, timezone
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import RefreshToken


async def save_refresh_token(session: AsyncSession, token: str, user_id: int, expires_at: datetime):
    refresh_token = RefreshToken(
        token=token,
        user_id=user_id,
        expires_at=expires_at
    )
    session.add(refresh_token)
    await session.commit()
    await session.refresh(refresh_token)
    return refresh_token


async def get_refresh_token(session: AsyncSession, token: str):
    result = await session.execute(
        select(RefreshToken).where(RefreshToken.token == token)
    )
    return result.scalar_one_or_none()


async def delete_refresh_token(session: AsyncSession, token: str):
    await session.execute(
        delete(RefreshToken).where(RefreshToken.token == token)
    )
    await session.commit()


async def delete_user_refresh_tokens(session: AsyncSession, user_id: int):
    await session.execute(
        delete(RefreshToken).where(RefreshToken.user_id == user_id)
    )
    await session.commit()


async def delete_expired_refresh_tokens(session: AsyncSession):
    now = datetime.now(timezone.utc)
    await session.execute(
        delete(RefreshToken).where(RefreshToken.expires_at < now)
    )
    await session.commit()