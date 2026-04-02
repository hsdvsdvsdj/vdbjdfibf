from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.skills import router as skills_router
from routers.orders import router as orders_router
from routers.reviews import router as reviews_router
from routers.chats import router as chats_router

app = FastAPI(title="Back", debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(skills_router)
app.include_router(orders_router)
app.include_router(reviews_router)
app.include_router(chats_router)