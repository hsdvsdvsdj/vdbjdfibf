from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.skills import router as skills_router
from routers.orders import router as orders_router
from routers.reviews import router as reviews_router
from routers.chats import router as chats_router
from routers.categories import router as categories_router

app = FastAPI(title="Back", debug=True)

# CORS middleware должна быть добавлена ПЕРЕД роутерами
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3000/",
        "http://localhost:3001/",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    max_age=3600,
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(skills_router)
app.include_router(orders_router)
app.include_router(reviews_router)
app.include_router(chats_router)
app.include_router(categories_router)