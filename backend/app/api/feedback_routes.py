from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from app.database.database import get_db
from app.database.models import Feedback, User
from app.auth.auth import get_optional_user

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])


class FeedbackCreate(BaseModel):
    """Feedback creation model"""
    rating: int
    message: str
    category: Optional[str] = "general"
    email: Optional[EmailStr] = None


class FeedbackResponse(BaseModel):
    """Feedback response model"""
    id: int
    user_id: Optional[int]
    rating: int
    message: str
    category: Optional[str]
    email: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """
    Submit user feedback
    Allows both authenticated and anonymous feedback
    """
    # Validate rating
    if feedback_data.rating < 1 or feedback_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    # Create feedback
    feedback = Feedback(
        user_id=current_user.id if current_user else None,
        rating=feedback_data.rating,
        message=feedback_data.message,
        category=feedback_data.category,
        email=feedback_data.email
    )
    
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    
    return feedback
