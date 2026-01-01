from transformers import pipeline
import logging
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIEngine:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIEngine, cls).__new__(cls)
            cls._instance._initialize_pipelines()
        return cls._instance
    
    def _initialize_pipelines(self):
        """
        Initialize the HF pipelines. 
        Using 'lazy' loading or loading on startup depending on resource preference.
        Here we load on startup for responsiveness, but strictly strictly using small models.
        """
        logger.info("Initializing AI Engine... (This may take a moment to download models)")
        
        try:
            # 1. Sentiment Analysis (Tiny/Fast)
            # distilbert-base-uncased-finetuned-sst-2-english is ~260MB
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis", 
                model="distilbert-base-uncased-finetuned-sst-2-english",
                token=settings.HF_TOKEN
            )
            
            # 2. Text Generation / Summarization (Optimized)
            # Using a distilled BART model for summarization (~1.2GB, might be heavy for some locals)
            # Alternative: t5-small (~240MB)
            self.summarizer = pipeline(
                "summarization", 
                model="sshleifer/distilbart-cnn-12-6", 
                token=settings.HF_TOKEN
            )
            
            logger.info("AI Pipelines loaded successfully.")
            
        except Exception as e:
            logger.error(f"Failed to load AI pipelines: {e}")
            logger.warning("AI Engine running in FALLBACK mode (Mock responses).")
            self.sentiment_analyzer = None
            self.summarizer = None

    def analyze_sentiment(self, text: str):
        if not self.sentiment_analyzer:
            return {"label": "NEUTRAL", "score": 0.5} # Fallback
            
        try:
            result = self.sentiment_analyzer(text[:512])[0] # Truncate for BERT security
            return result
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {e}")
            return {"label": "ERROR", "score": 0.0}

    def generate_insight(self, context_data: str):
        """
        Generates a summary or insight based on aggregated data passed as string.
        """
        if not self.summarizer:
            return "Unable to generate insights (AI Engine offline)."
            
        try:
            # Ensure input is long enough for summarization, else just return it
            if len(context_data.split()) < 30:
                return f"Analysis: {context_data}"
                
            summary = self.summarizer(context_data, max_length=60, min_length=10, do_sample=False)[0]
            return summary['summary_text']
        except Exception as e:
            logger.error(f"Error in insight generation: {e}")
            return "Could not generate insight."

ai_engine = AIEngine()
