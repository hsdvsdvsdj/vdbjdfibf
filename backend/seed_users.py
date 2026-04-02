import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from database.models import User
from database.db import async_session_maker

# Хеширование паролей
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


async def create_test_users():
    """Создать тестовых пользователей для демонстрации"""
    
    async with async_session_maker() as session:
        try:
            # Проверяем существующих пользователей
            result = await session.execute(select(User))
            existing_users = result.scalars().all()
            
            print(f"Существующих пользователей: {len(existing_users)}")
            for user in existing_users:
                print(f"  - {user.login} (id={user.id})")

            # Создаем тестовых пользователей
            test_logins = ["user", "moderator"]
            
            for login in test_logins:
                # Проверяем что пользователь не существует
                result = await session.execute(
                    select(User).where(User.login == login)
                )
                existing = result.scalar_one_or_none()
                
                if not existing:
                    user = User(
                        login=login,
                        hashed_password=pwd_context.hash(login),
                    )
                    session.add(user)
                    print(f"✓ Добавлен пользователь: {login}")
                else:
                    print(f"✓ Пользователь {login} уже существует (id={existing.id})")

            await session.commit()
            print("\n✓ Готово!")
            print("\nДанные для входа:")
            print("  login: user, password: user")
            print("  login: moderator, password: moderator")

        except Exception as e:
            await session.rollback()
            print(f"Ошибка: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(create_test_users())
