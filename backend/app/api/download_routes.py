from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User, Analysis
from app.auth.auth import get_current_active_user
from app.services.supabase_storage import SupabaseStorage


router = APIRouter(prefix="/api/download", tags=["Downloads"])


@router.get("/latex/{analysis_id}")
async def download_latex(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Download improved resume LaTeX source"""
    
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    if not analysis.latex_storage_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No improved resume available. Please generate one first."
        )
    
    # Generate signed URL from Supabase Storage
    storage = SupabaseStorage()
    signed_url = await storage.get_signed_url(
        bucket="generated-resumes",
        path=analysis.latex_storage_path,
        expires_in=3600  # 1 hour
    )
    
    # Redirect to signed URL
    return RedirectResponse(url=signed_url)


@router.get("/pdf/{analysis_id}")
async def download_pdf(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Download improved resume PDF"""
    
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    if not analysis.pdf_storage_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No improved resume PDF available. Please generate one first."
        )
    
    # Generate signed URL from Supabase Storage
    storage = SupabaseStorage()
    signed_url = await storage.get_signed_url(
        bucket="generated-resumes",
        path=analysis.pdf_storage_path,
        expires_in=3600  # 1 hour
    )
    
    # Redirect to signed URL
    return RedirectResponse(url=signed_url)


@router.get("/original/{analysis_id}")
async def download_original_resume(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Download original uploaded resume"""
    
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    if not analysis.resume.storage_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Original resume file not found"
        )
    
    # Generate signed URL from Supabase Storage
    storage = SupabaseStorage()
    signed_url = await storage.get_signed_url(
        bucket="resumes",
        path=analysis.resume.storage_path,
        expires_in=3600  # 1 hour
    )
    
    # Redirect to signed URL
    return RedirectResponse(url=signed_url)
