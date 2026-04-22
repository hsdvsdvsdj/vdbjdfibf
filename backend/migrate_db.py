# migrate_db.py
"""Script to migrate database with new bio field"""
import asyncio
from sqlalchemy import text
from database.db import DatabaseInteraction, engine

async def migrate():
    async with engine.begin() as conn:
        # Check if bio column exists
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN bio TEXT"))
            print("✓ Added bio column to users table")
        except Exception as e:
            print(f"bio column already exists or error: {e}")
    
    print("Migration completed!")

if __name__ == "__main__":
    asyncio.run(migrate())
