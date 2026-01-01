from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    sessions = relationship("FocusSession", back_populates="user")
    checkins = relationship("DailyCheckin", back_populates="user")
    insights = relationship("Insight", back_populates="user")

class FocusSession(Base):
    __tablename__ = "focus_sessions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    duration = Column(Integer, default=0) # Seconds
    focus_score = Column(Integer, default=0)
    interruptions = Column(Integer, default=0)
    intent = Column(String, nullable=True)
    
    user = relationship("User", back_populates="sessions")

class DailyCheckin(Base):
    __tablename__ = "daily_checkins"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    mood = Column(String) # "calm", "anxious", etc.
    energy_score = Column(Integer) # 1-100
    productivity_score = Column(Integer) # 1-100
    notes = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="checkins")

class Insight(Base):
    __tablename__ = "insights"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    summary_text = Column(Text)
    metrics = Column(JSON) # { "focus_stability": 80, ... }
    recommendations = Column(JSON) # ["Take a break", ...]
    
    user = relationship("User", back_populates="insights")
