from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_user
from crud.review import create_review, get_reviews_by_class
from crud.classified import get_classified_by_id
from database.db import DatabaseInteraction
from app_schemas.reviews import ReviewCreateSchema, ReviewResponseSchema
from database.models import User

router = APIRouter(tags=["Reviews"])


@router.post("/reviews", response_model=ReviewResponseSchema, status_code=status.HTTP_201_CREATED)
async def add_review(
    review_data: ReviewCreateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session),
):
    classified = await get_classified_by_id(session, review_data.class_id)
    if not classified:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Навык не найден")

    review = await create_review(
        session,
        class_id=review_data.class_id,
        user_id=current_user.id,
        description=review_data.description,
        mark=review_data.mark,
    )
    return review


@router.get("/skills/{skill_id}/reviews", response_model=list[ReviewResponseSchema])
async def get_skill_reviews(skill_id: int, session: AsyncSession = Depends(DatabaseInteraction.get_async_session)):
    classified = await get_classified_by_id(session, skill_id)
    if not classified:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Навык не найден")

    reviews = await get_reviews_by_class(session, skill_id)
    return reviews
