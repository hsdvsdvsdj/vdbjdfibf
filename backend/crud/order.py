from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Order


async def create_order(session: AsyncSession, class_id: int, buyer_id: int, seller_id: int):
    order = Order(
        class_id=class_id,
        buyer_id=buyer_id,
        seller_id=seller_id,
        status="pending"
    )
    session.add(order)
    await session.commit()
    await session.refresh(order)
    return order


async def get_order_by_id(session: AsyncSession, order_id: int):
    result = await session.execute(select(Order).where(Order.id_order == order_id))
    return result.scalar_one_or_none()


async def list_orders(session: AsyncSession, buyer_id: int = None, seller_id: int = None, status: str = None, skip: int = 0, limit: int = 100):
    query = select(Order)

    if buyer_id is not None:
        query = query.where(Order.buyer_id == buyer_id)
    if seller_id is not None:
        query = query.where(Order.seller_id == seller_id)
    if status is not None:
        query = query.where(Order.status == status)

    result = await session.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


async def update_order_status(session: AsyncSession, order_id: int, status: str):
    order = await get_order_by_id(session, order_id)
    if not order:
        return None

    order.status = status
    session.add(order)
    await session.commit()
    await session.refresh(order)
    return order


async def delete_order(session: AsyncSession, order_id: int):
    await session.execute(delete(Order).where(Order.id_order == order_id))
    await session.commit()
