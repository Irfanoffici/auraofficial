from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
# from app.core.database import get_db # REMOVED
from app.core.supabase import get_supabase
from app.core.auth import get_current_user

router = APIRouter()

class SessionCreate(BaseModel):
    intent: str

class SessionEnd(BaseModel):
    session_id: str
    duration: int
    focus_score: int
    interruptions: int

@router.post("/start")
def start_session(data: SessionCreate, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    
    # Store session in Supabase 'focus_sessions' table
    session_data = {
        "user_id": user['id'],
        "intent": data.intent,
        "start_time": datetime.utcnow().isoformat(), 
        "status": "ongoing"
    }
    
    try:
        response = supabase.table("focus_sessions").insert(session_data).execute()
        # response.data is a list of inserted records
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to create session")
        return response.data[0]
    except Exception as e:
        print(f"Db Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/end")
def end_session(data: SessionEnd, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    
    update_data = {
        "end_time": datetime.utcnow().isoformat(),
        "duration": data.duration,
        "focus_score": data.focus_score,
        "interruptions": data.interruptions,
        "status": "completed"
    }
    
    try:
        # Update using session_id AND user_id (security double check)
        response = supabase.table("focus_sessions").update(update_data)\
            .eq("id", data.session_id)\
            .eq("user_id", user['id'])\
            .execute()
            
        if not response.data:
            raise HTTPException(status_code=404, detail="Session not found or not owned by user")
            
        return response.data[0]
    except Exception as e:
        print(f"Db Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
