from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
# from app.core.database import get_db # REMOVED
from app.core.supabase import get_supabase
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
    supabase = get_supabase()

    # AI Analysis
    sentiment = {"label": "neutral", "score": 0.5}
    if data.notes:
        sentiment = ai_engine.analyze_sentiment(data.notes)
        
    checkin_data = {
        "user_id": user['id'],
        "timestamp": datetime.utcnow().isoformat(),
        "mood_score": data.mood_score,
        "energy_level": data.energy_score, # Mapping energy_score -> energy_level
        "notes": data.notes,
        # "productivity_score": data.productivity_score, # Not in schema yet
        # "sentiment": sentiment # Not in schema yet
    }
    
    try:
        response = supabase.table("daily_checkins").insert(checkin_data).execute()
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to create checkin")
        return {**response.data[0], "sentiment": sentiment}
    except Exception as e:
        print(f"Db Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
