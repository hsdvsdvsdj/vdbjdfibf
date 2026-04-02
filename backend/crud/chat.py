from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Chat


async def get_chat_by_class_and_users(session: AsyncSession, class_id: int, user1_id: int, user2_id: int):
    result = await session.execute(
        select(Chat).where(
            (Chat.class_id == class_id)
            & (
                (Chat.id_user1 == user1_id) & (Chat.id_user2 == user2_id)
                | (Chat.id_user1 == user2_id) & (Chat.id_user2 == user1_id)
            )
        )
    )
    return result.scalar_one_or_none()


async def get_chats_by_user(session: AsyncSession, user_id: int):
    result = await session.execute(select(Chat).where(or_(Chat.id_user1 == user_id, Chat.id_user2 == user_id)))
    return result.scalars().all()


async def create_chat(session: AsyncSession, class_id: int, user1_id: int, user2_id: int):
    existing = await session.execute(
        select(Chat).where(
            (Chat.class_id == class_id) &
            (((Chat.id_user1 == user1_id) & (Chat.id_user2 == user2_id)) | ((Chat.id_user1 == user2_id) & (Chat.id_user2 == user1_id)))
        )
    )
    existing_chat = existing.scalar_one_or_none()
    if existing_chat:
        return existing_chat

    chat = Chat(
        class_id=class_id,
        id_user1=user1_id,
        id_user2=user2_id
    )
    session.add(chat)
    await session.commit()
    await session.refresh(chat)
    return chat
