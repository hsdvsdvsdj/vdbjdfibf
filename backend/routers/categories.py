from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_user
from crud.category import (
    create_category,
    get_category_by_id,
    get_category_by_name,
    list_categories,
    update_category,
    delete_category,
    add_category_to_classified,
    get_categories_by_classified,
    remove_category_from_classified,
)
from database.db import DatabaseInteraction
from app_schemas.categories import (
    CategoryCreateSchema,
    CategoryUpdateSchema,
    CategoryResponseSchema,
    CatClassResponseSchema,
)
from database.models import User

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("", response_model=CategoryResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_new_category(
    category_data: CategoryCreateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    """Create a new category (admin only)"""
    # Check if user is admin (you can add admin role checking here)
    existing = await get_category_by_name(session, category_data.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Категория с таким названием уже существует"
        )
    
    category = await create_category(session, category_data.name)
    return category


@router.get("", response_model=list[CategoryResponseSchema])
async def get_categories(
    skip: int = Query(0),
    limit: int = Query(100),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    """Get all categories"""
    categories = await list_categories(session, skip=skip, limit=limit)
    return categories


@router.get("/{category_id}", response_model=CategoryResponseSchema)
async def get_category(
    category_id: int,
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    """Get category by ID"""
    category = await get_category_by_id(session, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    return category


@router.put("/{category_id}", response_model=CategoryResponseSchema)
async def update_category_endpoint(
    category_id: int,
    category_data: CategoryUpdateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    """Update category (admin only)"""
    category = await get_category_by_id(session, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    
    updated = await update_category(session, category_id, category_data.name)
    return updated


@router.delete("/{category_id}")
async def delete_category_endpoint(
    category_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    """Delete category (admin only)"""
    category = await get_category_by_id(session, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    
    await delete_category(session, category_id)
    return {"detail": "Категория удалена"}


@router.post("/{skill_id}/categories/{category_id}", response_model=CatClassResponseSchema, status_code=status.HTTP_201_CREATED)
async def add_category_to_skill(
    skill_id: int,
    category_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    """Add category to classified skill"""
    from crud.classified import get_classified_by_id
    
    classified = await get_classified_by_id(session, skill_id)
    if not classified:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Навык не найден"
        )
    
    if classified.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет прав для редактирования"
        )
    
    category = await get_category_by_id(session, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    
    cat_class = await add_category_to_classified(session, skill_id, category_id)
    return cat_class


@router.get("/{skill_id}/categories", response_model=list[CatClassResponseSchema])
async def get_skill_categories(
    skill_id: int,
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    """Get all categories for a skill"""
    cat_classes = await get_categories_by_classified(session, skill_id)
    return cat_classes


@router.delete("/{skill_id}/categories/{cat_class_id}")
async def remove_category_from_skill(
    skill_id: int,
    cat_class_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    """Remove category from skill"""
    from crud.classified import get_classified_by_id
    
    classified = await get_classified_by_id(session, skill_id)
    if not classified:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Навык не найден"
        )
    
    if classified.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет прав для редактирования"
        )
    
    await remove_category_from_classified(session, cat_class_id)
    return {"detail": "Категория удалена из навыка"}
