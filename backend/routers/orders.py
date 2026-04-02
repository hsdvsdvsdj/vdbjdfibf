from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_user
from crud.order import create_order, get_order_by_id, list_orders, update_order_status
from crud.classified import get_classified_by_id
from database.db import DatabaseInteraction
from app_schemas.orders import OrderCreateSchema, OrderResponseSchema
from database.models import User

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_new_order(
    order_data: OrderCreateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    classified = await get_classified_by_id(session, order_data.class_id)
    if not classified:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Навык не найден")

    if classified.user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Нельзя заказать свой навык")

    order = await create_order(
        session,
        class_id=order_data.class_id,
        buyer_id=current_user.id,
        seller_id=classified.user_id,
    )
    return order


@router.get("", response_model=list[OrderResponseSchema])
async def get_orders(
    status: str | None = Query(None),
    role: str | None = Query(None),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    buyer_id = None
    seller_id = None
    if role == "buyer":
        buyer_id = current_user.id
    elif role == "seller":
        seller_id = current_user.id

    orders = await list_orders(session, buyer_id=buyer_id, seller_id=seller_id, status=status, skip=skip, limit=limit)
    return orders


@router.get("/{order_id}", response_model=OrderResponseSchema)
async def get_order(order_id: int, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(DatabaseInteraction.get_async_session)):
    order = await get_order_by_id(session, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    if order.buyer_id != current_user.id and order.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")
    return order


@router.put("/{order_id}", response_model=OrderResponseSchema)
async def patch_order_status(order_id: int, status: str, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(DatabaseInteraction.get_async_session)):
    order = await get_order_by_id(session, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    if order.seller_id != current_user.id and order.buyer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    updated = await update_order_status(session, order_id, status)
    return updated
