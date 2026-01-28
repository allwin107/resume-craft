from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database.database import get_db
from app.database.models import User, Analysis, ResumeVersion
from app.auth.auth import get_current_active_user


router = APIRouter(prefix="/api/versions", tags=["Resume Versions"])


class VersionCreate(BaseModel):
    """Request model for creating a new version"""
    latex_content: str
    description: Optional[str] = None


class VersionResponse(BaseModel):
    """Response model for resume version"""
    id: int
    version_number: int
    latex_content: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class VersionUpdate(BaseModel):
    """Request model for updating a version"""
    description: Optional[str] = None


@router.post("/{analysis_id}", response_model=VersionResponse, status_code=status.HTTP_201_CREATED)
async def create_version(
    analysis_id: int,
    version_data: VersionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new resume version for an analysis
    
    Args:
        analysis_id: ID of the analysis
        version_data: Version content and description
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Created version with auto-incremented version number
    """
    # Verify analysis exists and belongs to user
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Get next version number
    max_version = db.query(ResumeVersion).filter(
        ResumeVersion.analysis_id == analysis_id
    ).count()
    
    next_version_number = max_version + 1
    
    # Create new version
    new_version = ResumeVersion(
        analysis_id=analysis_id,
        version_number=next_version_number,
        latex_content=version_data.latex_content,
        description=version_data.description
    )
    
    db.add(new_version)
    db.commit()
    db.refresh(new_version)
    
    return new_version


@router.get("/{analysis_id}", response_model=List[VersionResponse])
async def get_versions(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all versions for an analysis
    
    Args:
        analysis_id: ID of the analysis
        current_user: Authenticated user
        db: Database session
    
    Returns:
        List of all versions ordered by version number
    """
    # Verify analysis belongs to user
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Get all versions
    versions = db.query(ResumeVersion).filter(
        ResumeVersion.analysis_id == analysis_id
    ).order_by(ResumeVersion.version_number.asc()).all()
    
    return versions


@router.get("/{analysis_id}/{version_id}", response_model=VersionResponse)
async def get_version(
    analysis_id: int,
    version_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific version
    
    Args:
        analysis_id: ID of the analysis
        version_id: ID of the version
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Specific version details
    """
    # Verify analysis belongs to user
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Get specific version
    version = db.query(ResumeVersion).filter(
        ResumeVersion.id == version_id,
        ResumeVersion.analysis_id == analysis_id
    ).first()
    
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Version not found"
        )
    
    return version


@router.patch("/{analysis_id}/{version_id}", response_model=VersionResponse)
async def update_version(
    analysis_id: int,
    version_id: int,
    version_update: VersionUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update version description
    
    Args:
        analysis_id: ID of the analysis
        version_id: ID of the version
        version_update: Updated description
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Updated version
    """
    # Verify analysis belongs to user
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Get and update version
    version = db.query(ResumeVersion).filter(
        ResumeVersion.id == version_id,
        ResumeVersion.analysis_id == analysis_id
    ).first()
    
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Version not found"
        )
    
    if version_update.description is not None:
        version.description = version_update.description
    
    db.commit()
    db.refresh(version)
    
    return version


@router.delete("/{analysis_id}/{version_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_version(
    analysis_id: int,
    version_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a version
    
    Args:
        analysis_id: ID of the analysis
        version_id: ID of the version
        current_user: Authenticated user
        db: Database session
    """
    # Verify analysis belongs to user
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Get and delete version
    version = db.query(ResumeVersion).filter(
        ResumeVersion.id == version_id,
        ResumeVersion.analysis_id == analysis_id
    ).first()
    
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Version not found"
        )
    
    db.delete(version)
    db.commit()
    
    return None
