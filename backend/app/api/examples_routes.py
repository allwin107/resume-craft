from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from pydantic import BaseModel

from app.database.database import get_db
from app.database.models import User
from app.auth.auth import get_current_active_user
from app.sample_data.example_resumes import EXAMPLE_RESUMES


router = APIRouter(prefix="/api/examples", tags=["Examples"])


class ExampleResumePreview(BaseModel):
    """Preview of an example resume"""
    id: str
    title: str
    description: str


class ExampleResumeDetail(BaseModel):
    """Full example resume with job description"""
    id: str
    title: str
    description: str
    resume_text: str
    job_description: str


@router.get("/resumes", response_model=List[ExampleResumePreview])
async def list_example_resumes():
    """Get list of available example resumes"""
    return [
        ExampleResumePreview(
            id=key,
            title=value["title"],
            description=value["description"]
        )
        for key, value in EXAMPLE_RESUMES.items()
    ]


@router.get("/resumes/{example_id}", response_model=ExampleResumeDetail)
async def get_example_resume(example_id: str):
    """Get full details for a specific example resume"""
    if example_id not in EXAMPLE_RESUMES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Example resume not found"
        )
    
    example = EXAMPLE_RESUMES[example_id]
    return ExampleResumeDetail(
        id=example_id,
        title=example["title"],
        description=example["description"],
        resume_text=example["resume_text"],
        job_description=example["job_description"]
    )
