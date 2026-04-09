from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Category, CatClass


async def create_category(session: AsyncSession, name: str):
    category = Category(name=name)
    session.add(category)
    await session.commit()
    await session.refresh(category)
    return category


async def get_category_by_id(session: AsyncSession, category_id: int):
    result = await session.execute(select(Category).where(Category.id_category == category_id))
    return result.scalar_one_or_none()


async def get_category_by_name(session: AsyncSession, name: str = None):
    result = await session.execute(select(Category).where(Category.name == name))
    return result.scalar_one_or_none()


async def list_categories(session: AsyncSession, skip: int = 0, limit: int = 100):
    result = await session.execute(select(Category).offset(skip).limit(limit))
    return result.scalars().all()


async def update_category(session: AsyncSession, category_id: int, name: str):
    category = await get_category_by_id(session, category_id)
    if not category:
        return None
    
    category.name = name
    session.add(category)
    await session.commit()
    await session.refresh(category)
    return category


async def delete_category(session: AsyncSession, category_id: int):
    await session.execute(delete(Category).where(Category.id_category == category_id))
    await session.commit()


# CatClass operations
async def add_category_to_classified(session: AsyncSession, class_id: int, category_id: int):
    cat_class = CatClass(class_id=class_id, id_category=category_id)
    session.add(cat_class)
    await session.commit()
    await session.refresh(cat_class)
    return cat_class


async def get_categories_by_classified(session: AsyncSession, class_id: int):
    result = await session.execute(select(CatClass).where(CatClass.class_id == class_id))
    return result.scalars().all()


async def remove_category_from_classified(session: AsyncSession, cat_class_id: int):
    await session.execute(delete(CatClass).where(CatClass.id_cat_class == cat_class_id))
    await session.commit()
