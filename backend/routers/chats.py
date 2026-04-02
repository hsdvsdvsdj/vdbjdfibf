from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_user
from crud.chat import get_chat_by_class_and_users, create_chat
from crud.message import create_message, get_messages_by_chat
from crud.order import get_order_by_id
from database.db import DatabaseInteraction
from app_schemas.chats import ChatResponseSchema, MessageCreateSchema, MessageResponseSchema
from app_schemas.orders import OrderResponseSchema
from database.models import User

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("/order/{order_id}", response_model=ChatResponseSchema)
async def get_order_chat(order_id: int, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(DatabaseInteraction.get_async_session)):
    order = await get_order_by_id(session, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    if current_user.id not in (order.buyer_id, order.seller_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    chat = await get_chat_by_class_and_users(session, order.class_id, order.buyer_id, order.seller_id)
    if not chat:
        chat = await create_chat(session, order.class_id, order.buyer_id, order.seller_id)

    messages = await get_messages_by_chat(session, chat.id_chat)
    chat.messages = messages
    return chat


@router.post("/order/{order_id}/message", response_model=MessageResponseSchema, status_code=status.HTTP_201_CREATED)
async def send_message_to_order_chat(order_id: int, message_data: MessageCreateSchema, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(DatabaseInteraction.get_async_session)):
    order = await get_order_by_id(session, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    if current_user.id not in (order.buyer_id, order.seller_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    chat = await get_chat_by_class_and_users(session, order.class_id, order.buyer_id, order.seller_id)
    if not chat:
        chat = await create_chat(session, order.class_id, order.buyer_id, order.seller_id)

    message = await create_message(session, id_chat=chat.id_chat, user_id=current_user.id, message=message_data.message)
    return message
