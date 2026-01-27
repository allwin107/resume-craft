from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.database.models import User, Analysis
from app.auth.auth import get_current_active_user
from app.auth.schemas import UserUpdate, UserResponse
from pydantic import BaseModel
from datetime import datetime


router = APIRouter(prefix="/api/profile", tags=["Profile"])


class AnalysisHistoryItem(BaseModel):
    """Analysis history item schema"""
    id: int
    match_score: float
    created_at: datetime
    resume_filename: str
    job_title: str
    
    class Config:
        from_attributes = True


@router.get("", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_active_user)):
    """Get user profile"""
    return current_user


@router.put("", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    
    # Update user fields
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    if user_update.phone is not None:
        current_user.phone = user_update.phone
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.get("/history")
async def get_analysis_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's analysis history"""
    
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).all()
    
    history = []
    for analysis in analyses:
        history.append({
            "id": analysis.id,
            "match_score": analysis.match_score,
            "created_at": analysis.created_at,
            "resume_filename": analysis.resume.filename if analysis.resume else "Unknown",
            "job_title": analysis.job_description.title if analysis.job_description.title else "Untitled Position"
        })
    
    return {"history": history}
