from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base


class User(Base):
    """User model for authentication and profile"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")


class Resume(Base):
    """Resume model for storing uploaded resumes"""
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50))  # pdf, docx
    extracted_text = Column(Text)
    parsed_data = Column(JSON)  # Store structured data
    
    # Supabase Storage fields
    storage_path = Column(String(500))  # Supabase storage path
    storage_bucket = Column(String(50), default="resumes")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume")


class JobDescription(Base):
    """Job Description model"""
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    company = Column(String(255))
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    analyses = relationship("Analysis", back_populates="job_description")


class Analysis(Base):
    """Analysis results model"""
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_description_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False)
    
    # Analysis results
    match_score = Column(Float)
    matched_skills = Column(JSON)  # List of matched skills
    missing_skills = Column(JSON)  # List of missing skills
    matched_keywords = Column(JSON)  # List of matched keywords
    missing_keywords = Column(JSON)  # List of missing keywords
    improvements = Column(JSON)  # List of improvement suggestions
    summary = Column(Text)
    
    # AI-generated improved resume
    improved_latex = Column(Text)
    improved_pdf_path = Column(String(500))
    
    # Supabase Storage fields
    latex_storage_path = Column(String(500))
    pdf_storage_path = Column(String(500))
    
    # Realtime progress tracking
    progress_status = Column(String(20), default="pending")  # pending, analyzing, improving, completed
    progress_percentage = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    job_description = relationship("JobDescription", back_populates="analyses")
    versions = relationship("ResumeVersion", back_populates="analysis", cascade="all, delete-orphan")


class ResumeVersion(Base):
    """Resume Version model for saving multiple iterations"""
    __tablename__ = "resume_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    latex_content = Column(Text, nullable=False)
    description = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    analysis = relationship("Analysis", back_populates="versions")


class Feedback(Base):
    """User Feedback model"""
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    rating = Column(Integer)  # 1-5 stars
    message = Column(Text, nullable=False)
    category = Column(String(50))  # bug, feature, general
    email = Column(String(255))  # For anonymous feedback
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

