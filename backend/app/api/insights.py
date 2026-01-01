from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.ai_engine import ai_engine
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ReflectionInput(BaseModel):
    mood_score: int
    energy_score: int
    productivity_score: int
    notes: Optional[str] = None

class InsightResponse(BaseModel):
    sentiment: Optional[dict]
    insight_text: str

@router.post("/analyze")
def analyze_reflection(data: ReflectionInput):
    """
    On-demand analysis of a check-in. 
    1. Runs sentiment analysis on notes.
    2. Generates a quick text insight based on scores + notes.
    """
    
    # 1. Sentiment
    sentiment_result = None
    if data.notes:
        sentiment_result = ai_engine.analyze_sentiment(data.notes)
    
    # 2. Construct Context for Summarization/insight
    # We construct a pseudo-sentence for the LLM/Summarizer to "read"
    mood_str = "high" if data.mood_score >= 8 else "low" if data.mood_score <= 4 else "moderate"
    context = (
        f"User reports {mood_str} mood with {data.energy_score}% energy and {data.productivity_score}% productivity. "
        f"Notes: {data.notes if data.notes else 'No notes provided.'} "
        "Behavior indicates a correlation between energy levels and subjective mood."
    )
    
    # 3. Generate Insight (using summarizer to condense the context into a 'takeaway')
    insight_text = ai_engine.generate_insight(context)
    
    return {
        "sentiment": sentiment_result,
        "insight_text": insight_text
    }
