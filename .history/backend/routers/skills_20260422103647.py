from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_user
from crud.classified import create_classified, get_classified_by_id, list_classifieds, update_classified, delete_classified
from database.db import DatabaseInteraction
from app_schemas.skills import SkillCreateSchema, SkillUpdateSchema, SkillResponseSchema
from database.models import User

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.post("", response_model=SkillResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_data: SkillCreateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    skill = await create_classified(
        session=session,
        user_id=current_user.id,
        title=skill_data.title,
        description=skill_data.description,
        category=skill_data.category,
        duration=skill_data.duration,
        learnings=skill_data.learnings,
        cost=skill_data.cost,
        coef_prom=skill_data.coef_prom,
    )
    return skill


@router.get("", response_model=list[SkillResponseSchema])
async def get_skills(
    title: str | None = Query(None),
    category: str | None = Query(None),
    user_id: int | None = Query(None),
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    filters = {}
    if title:
        filters["title"] = title
    if category:
        filters["category"] = category
    if user_id is not None:
        filters["user_id"] = user_id

    skills = await list_classifieds(session=session, filters=filters, skip=skip, limit=limit)
    return skills


@router.get("/{skill_id}", response_model=SkillResponseSchema)
async def get_skill(skill_id: int, session: AsyncSession = Depends(DatabaseInteraction.get_async_session)):
    skill = await get_classified_by_id(session, skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Навык не найден")
    return skill


@router.put("/{skill_id}", response_model=SkillResponseSchema)
async def update_skill(
    skill_id: int,
    skill_data: SkillUpdateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    skill = await get_classified_by_id(session, skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Навык не найден")
    if skill.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет прав для редактирования")

    updated = await update_classified(session, skill_id, skill_data.dict(exclude_unset=True))
    return updated


@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    skill = await get_classified_by_id(session, skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Навык не найден")
    if skill.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет прав для удаления")

    await delete_classified(session, skill_id)
    return {"detail": "Навык удален"}
