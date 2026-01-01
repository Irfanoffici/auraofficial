from fastapi import APIRouter, Depends, HTTPException
from app.core.database import get_db
from app.core.auth import get_current_user
from app.services.ai_engine import ai_engine
from google.cloud import firestore

router = APIRouter()

@router.get("/summary")
def get_daily_summary(user: dict = Depends(get_current_user)):
    """
    Aggregates recent data and generates an AI insight.
    """
    db = get_db()
    if not db:
        # Fallback if DB is down, just return AI chat based on zero context
        return {"summary": "Database unavailable, but I am ready to help."}
        
    # Fetch recent checkins (limit 3)
    checkins_ref = db.collection("users").document(user['id']).collection("daily_checkins")
    checkins = checkins_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(3).stream()
    
    checkin_texts = []
    for c in checkins:
        data = c.to_dict()
        checkin_texts.append(f"Mood: {data.get('mood_score')}/10, Note: {data.get('notes')}")
        
    # Construct Context
    if not checkin_texts:
        context = "User has no recent activity recorded."
    else:
        context = "Recent User Activity: " + " | ".join(checkin_texts)
        
    # Generate Insight
    insight = ai_engine.generate_insight(context)
    
    return {
        "context_used": context,
        "ai_summary": insight
    }
