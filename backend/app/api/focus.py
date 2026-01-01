from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from app.core.database import get_db
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
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
        
    doc_ref = db.collection("users").document(user['id']).collection("focus_sessions").document()
    
    session_data = {
        "id": doc_ref.id,
        "user_id": user['id'],
        "intent": data.intent,
        "start_time": datetime.utcnow(), 
        "status": "ongoing"
    }
    
    doc_ref.set(session_data)
    return session_data

@router.post("/end")
def end_session(data: SessionEnd, user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=503, detail="Database unavailable")
        
    doc_ref = db.collection("users").document(user['id']).collection("focus_sessions").document(data.session_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Session not found")
        
    update_data = {
        "end_time": datetime.utcnow(),
        "duration": data.duration,
        "focus_score": data.focus_score,
        "interruptions": data.interruptions,
        "status": "completed"
    }
    
    doc_ref.update(update_data)
    return {**doc.to_dict(), **update_data}
