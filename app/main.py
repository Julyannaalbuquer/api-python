from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.routes import router as login_router
from app.database import Base, engine
from mangum import Mangum

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router)

handler = Mangum(app)