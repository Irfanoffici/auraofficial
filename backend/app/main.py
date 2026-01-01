from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import focus, insights

# Create Tables (for dev/sqlite simplification)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AURA Backend",
    description="Intelligence Core for AURA Personal Focus Hub",
    version="1.0.0"
)

# CORS - Allow Frontend
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

app.include_router(focus.router, prefix="/api/v1/focus", tags=["focus"])
app.include_router(insights.router, prefix="/api/v1/insights", tags=["insights"])

@app.get("/")
def read_root():
    return {"status": "active", "system": "AURA Intelligence Core"}
