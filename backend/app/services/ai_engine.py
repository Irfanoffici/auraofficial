import logging
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIEngine:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIEngine, cls).__new__(cls)
            # Lazy init - do NOT load models here
            cls._instance.sentiment_analyzer = None
            cls._instance.summarizer = None
        return cls._instance
    
    def _ensure_only_sentiment(self):
        if not self.sentiment_analyzer:
            logger.info("⏳ Loading Sentiment Model (Lazy)...")
            try:
                from transformers import pipeline
                self.sentiment_analyzer = pipeline(
                    "sentiment-analysis", 
                    model="distilbert-base-uncased-finetuned-sst-2-english",
                    token=settings.HF_TOKEN
                )
            except Exception as e:
                logger.warning(f"Feature Fallback: Sentiment model failed to load {e}")

    def _ensure_only_summarizer(self):
        if not self.summarizer:
            logger.info("⏳ Loading Summarization Model (Lazy)...")
            try:
                from transformers import pipeline
                self.summarizer = pipeline(
                    "summarization", 
                    model="sshleifer/distilbart-cnn-12-6", 
                    token=settings.HF_TOKEN
                )
            except Exception as e:
                logger.warning(f"Feature Fallback: Summarizer failed to load {e}")

    def analyze_sentiment(self, text: str):
        self._ensure_only_sentiment()
        
        if not self.sentiment_analyzer:
            # Fallback Rule-Based
            logger.info("Using Rule-Based Sentiment Fallback")
            lower_text = text.lower()
            if any(w in lower_text for w in ["happy", "good", "great", "excellent", "calm"]):
                return {"label": "POSITIVE", "score": 0.8}
            elif any(w in lower_text for w in ["sad", "bad", "terrible", "anxious", "tired"]):
                return {"label": "NEGATIVE", "score": 0.8}
            else:
                return {"label": "NEUTRAL", "score": 0.5}
            
        try:
            return self.sentiment_analyzer(text[:512])[0]
        except Exception as e:
            logger.error(f"Sentiment Analysis Error: {e}")
            return {"label": "ERROR", "score": 0.0}

    def generate_insight(self, context_data: str):
        self._ensure_only_summarizer()
        
        if not self.summarizer:
            return f"Note: AI Engine offline. Summary of data: {context_data[:100]}..."
            
        try:
            if len(context_data.split()) < 30:
                return f"Summary: {context_data}"
                
            summary = self.summarizer(context_data, max_length=60, min_length=10, do_sample=False)[0]
            return summary['summary_text']
        except Exception as e:
            logger.error(f"Insight Generation Error: {e}")
            return "Could not generate insight."

ai_engine = AIEngine()
