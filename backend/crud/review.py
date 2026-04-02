from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Review


async def create_review(session: AsyncSession, class_id: int, user_id: int, description: str, mark: int):
    review = Review(
        class_id=class_id,
        user_id=user_id,
        description=description,
        mark=mark,
        date=date.today()
    )
    session.add(review)
    await session.commit()
    await session.refresh(review)
    return review


async def get_reviews_by_class(session: AsyncSession, class_id: int):
    result = await session.execute(select(Review).where(Review.class_id == class_id))
    return result.scalars().all()
