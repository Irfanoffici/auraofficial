from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AURA Backend"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "aura_secure_core_key_v1"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30 # 30 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./aura.db"
    
    # AI
    HF_TOKEN: str = ""
    HF_WRITE_TOKEN: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
