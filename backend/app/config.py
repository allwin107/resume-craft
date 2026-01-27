from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/resume_analyzer"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Groq AI
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: str
    
    # LaTeX
    LATEX_MODE: str = "local"  # local or online
    LATEX_ONLINE_URL: str = "https://latexonline.cc/compile"
    
    # File Upload & Storage
    STORAGE_MODE: str = "supabase"  # local or supabase
    UPLOAD_DIR: str = "./uploads"  # Fallback for local mode
    MAX_FILE_SIZE_MB: int = 10
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/resumes", exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/latex", exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/pdfs", exist_ok=True)
