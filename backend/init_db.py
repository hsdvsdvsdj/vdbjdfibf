# init_db.py
from database.db import DatabaseInteraction

import asyncio

async def main():
    await DatabaseInteraction.create_tables()

if __name__ == "__main__":
    asyncio.run(main())