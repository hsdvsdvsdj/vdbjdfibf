from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Classified


async def create_classified(session: AsyncSession, user_id: int, title: str, description: str = None, category: str = None, duration: int = None, name: str = None, learnings: str = None, cost=None, coef_prom=None):
    classified = Classified(
        user_id=user_id,
        title=title,
        description=description,
        category=category,
        duration=duration,
        name=name or title,  # для совместимости
        learnings=learnings,
        cost=cost,
        coef_prom=coef_prom
    )
    session.add(classified)
    await session.commit()
    await session.refresh(classified)
    return classified


async def get_classified_by_id(session: AsyncSession, class_id: int):
    result = await session.execute(select(Classified).where(Classified.class_id == class_id))
    return result.scalar_one_or_none()


async def list_classifieds(session: AsyncSession, filters: dict = None, skip: int = 0, limit: int = 100):
    query = select(Classified)

    if filters:
        if filters.get("user_id") is not None:
            query = query.where(Classified.user_id == filters["user_id"])
        if filters.get("title") is not None:
            query = query.where(Classified.title.ilike(f"%{filters['title']}%"))
        if filters.get("category") is not None:
            query = query.where(Classified.category == filters["category"])
        # совместимость со старой schema
        if filters.get("name") is not None:
            query = query.where(Classified.name.ilike(f"%{filters['name']}%"))

    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()


async def update_classified(session: AsyncSession, class_id: int, data: dict):
    object_ = await get_classified_by_id(session, class_id)
    if not object_:
        return None

    for key, value in data.items():
        if hasattr(object_, key) and value is not None:
            setattr(object_, key, value)

    session.add(object_)
    await session.commit()
    await session.refresh(object_)
    return object_


async def delete_classified(session: AsyncSession, class_id: int):
    await session.execute(delete(Classified).where(Classified.class_id == class_id))
    await session.commit()
