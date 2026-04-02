import asyncio
from database.db import DatabaseInteraction
from crud.user import create_user
from auth.security import hash_password

async def create_test_user():
    session_maker = DatabaseInteraction.async_session_maker
    
    async with session_maker() as session:
        await create_user(
            session=session,
            login="testuser",
            hashed_password=hash_password("testpassword"),
            email=None,
            nickname="Test User"
        )
        print("Тестовый пользователь создан! Логин: testuser, Пароль: testpassword")

if __name__ == "__main__":
    asyncio.run(create_test_user())
