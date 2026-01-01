from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import focus, checkin, insights
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend for AURA: Authenticated via Supabase, Data via Firebase, Intelligence via HuggingFace."
)

# CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(focus.router, prefix="/api/v1/focus", tags=["focus"])
app.include_router(checkin.router, prefix="/api/v1/checkin", tags=["checkin"])
app.include_router(insights.router, prefix="/api/v1/insights", tags=["insights"])

@app.get("/")
def read_root():
    return {
        "system": "AURA Intelligence Core",
        "status": "online",
        "auth": "Supabase JWT",
        "db": "Firebase Firestore"
    }
