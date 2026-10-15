from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base
from app.api.endpoints import router as api_router
from app.db.seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist and initial demo data is seeded
    Base.metadata.create_all(bind=engine)
    try:
        seed_database(days_back=90)
    except Exception as e:
        print(f"[Lifespan Startup] Notice on seeding: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production-grade intelligent urban pollution prediction and environmental "
        "monitoring platform supporting Indian cities (Prayagraj, Lucknow, Delhi, Kanpur, Varanasi)."
    ),
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS if settings.BACKEND_CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1_prefix": settings.API_V1_STR
    }
