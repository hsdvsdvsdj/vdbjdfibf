from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Message


async def create_message(session: AsyncSession, id_chat: int, user_id: int, message: str):
    msg = Message(
        id_chat=id_chat,
        user_id=user_id,
        message=message,
        datetime=datetime.utcnow()
    )
    session.add(msg)
    await session.commit()
    await session.refresh(msg)
    return msg


async def get_messages_by_chat(session: AsyncSession, id_chat: int):
    result = await session.execute(select(Message).where(Message.id_chat == id_chat).order_by(Message.datetime.asc()))
    return result.scalars().all()
