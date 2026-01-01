from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.core.auth import get_current_user
from app.services.ai_engine import ai_engine

router = APIRouter()

class CheckinInput(BaseModel):
    mood_score: int
    energy_score: int
    productivity_score: int
    notes: Optional[str] = None

@router.post("/submit")
def submit_checkin(data: CheckinInput, user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")

    # AI Analysis
    sentiment = {"label": "neutral", "score": 0.5}
    if data.notes:
        sentiment = ai_engine.analyze_sentiment(data.notes)
        
    checkin_data = {
        "user_id": user['id'],
        "timestamp": datetime.utcnow(),
        "mood_score": data.mood_score,
        "energy_score": data.energy_score,
        "productivity_score": data.productivity_score,
        "notes": data.notes,
        "sentiment": sentiment
    }
    
    # Save to Firestore
    doc_ref = db.collection("users").document(user['id']).collection("daily_checkins").document()
    doc_ref.set(checkin_data)
    
    return {**checkin_data, "id": doc_ref.id}
