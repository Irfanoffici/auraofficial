from fastapi import APIRouter, Depends, HTTPException
# from app.core.database import get_db
from app.core.supabase import get_supabase
from app.core.auth import get_current_user
from app.services.ai_engine import ai_engine
# from google.cloud import firestore

router = APIRouter()

@router.get("/summary")
def get_daily_summary(user: dict = Depends(get_current_user)):
    """
    Aggregates recent data and generates an AI insight.
    """
    supabase = get_supabase()
        
    # Fetch recent checkins (limit 3)
    try:
        response = supabase.table("daily_checkins")\
            .select("mood_score, notes")\
            .eq("user_id", user['id'])\
            .order("timestamp", desc=True)\
            .limit(3)\
            .execute()
        checkins = response.data
    except Exception as e:
        print(f"Db Error: {e}")
        return {"summary": "Could not fetch data for AI analysis."}
    
    checkin_texts = []
    for c in checkins:
        # data = c.to_dict() # Supabase returns dicts directly
        data = c
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
