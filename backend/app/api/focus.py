from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import FocusSession
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class SessionCreate(BaseModel):
    user_id: str
    intent: str

class SessionEnd(BaseModel):
    id: str
    duration: int
    focus_score: int
    interruptions: int

@router.post("/start")
def start_session(session_in: SessionCreate, db: Session = Depends(get_db)):
    db_session = FocusSession(
        user_id=session_in.user_id,
        intent=session_in.intent
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.post("/end")
def end_session(session_in: SessionEnd, db: Session = Depends(get_db)):
    db_session = db.query(FocusSession).filter(FocusSession.id == session_in.id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db_session.end_time = datetime.now()
    db_session.duration = session_in.duration
    db_session.focus_score = session_in.focus_score
    db_session.interruptions = session_in.interruptions
    
    db.commit()
    return db_session
