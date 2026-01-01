import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AURA Intelligence Core"
    VERSION: str = "1.0.0"
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str # Anon key
    
    # Hugging Face
    HF_TOKEN: str
    HF_WRITE_TOKEN: str
    
    # Firebase
    FIREBASE_CREDENTIALS: str = "serviceAccountKey.json"

    class Config:
        env_file = ".env"

settings = Settings()
