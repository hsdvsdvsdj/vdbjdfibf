from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from auth.security import decode_token
from crud.user import get_user_by_id
from database.db import DatabaseInteraction

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(DatabaseInteraction.get_async_session)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить токен",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        token_type = payload.get("type")
        user_id = payload.get("sub")

        if token_type != "access":
            raise credentials_exception

        if user_id is None:
            raise credentials_exception

        user = await get_user_by_id(session, int(user_id))
        if user is None:
            raise credentials_exception

        return user

    except (JWTError, ValueError):
        raise credentials_exception