from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from app.database.database import get_db
from app.database.models import User, Analysis
from app.auth.auth import get_current_active_user
from app.services.latex_service import LaTeXService
from app.services.supabase_storage import SupabaseStorage


router = APIRouter(prefix="/api/editor", tags=["Editor"])


class LaTeXContentResponse(BaseModel):
    """Response for LaTeX content"""
    analysis_id: int
    latex_content: str
    last_updated: str


class SaveLaTeXRequest(BaseModel):
    """Request to save LaTeX content"""
    latex_content: str


class CompilePDFResponse(BaseModel):
    """Response for PDF compilation"""
    success: bool
    pdf_url: Optional[str] = None
    error: Optional[str] = None


@router.get("/{analysis_id}", response_model=LaTeXContentResponse)
async def get_latex_for_editing(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get LaTeX content for editing in the playground"""
    
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    if not analysis.improved_latex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No improved resume available. Please generate one first."
        )
    
    return LaTeXContentResponse(
        analysis_id=analysis.id,
        latex_content=analysis.improved_latex,
        last_updated=analysis.updated_at.isoformat()
    )


@router.post("/{analysis_id}/save")
async def save_latex(
    analysis_id: int,
    request: SaveLaTeXRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Save edited LaTeX content"""
    
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Update LaTeX content
    analysis.improved_latex = request.latex_content
    
    # Also update in storage
    storage = SupabaseStorage()
    from datetime import datetime
    latex_filename = f"improved_{datetime.now().strftime('%Y%m%d_%H%M%S')}.tex"
    latex_storage_path = await storage.upload_generated_resume(
        file_path=latex_filename,
        file_content=request.latex_content.encode('utf-8'),
        analysis_id=analysis.id
    )
    
    analysis.latex_storage_path = latex_storage_path
    db.commit()
    
    return {"message": "LaTeX saved successfully", "analysis_id": analysis.id}


@router.post("/{analysis_id}/compile", response_model=CompilePDFResponse)
async def compile_latex_to_pdf(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Compile LaTeX to PDF using online service"""
    
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    if not analysis.improved_latex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No LaTeX content to compile"
        )
    
    try:
        # Compile using LaTeX service
        latex_service = LaTeXService()
        from datetime import datetime
        output_name = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        pdf_path = latex_service.compile_latex_online(
            latex_content=analysis.improved_latex,
            output_name=output_name
        )
        
        # Upload PDF to storage
        storage = SupabaseStorage()
        with open(pdf_path, 'rb') as pdf_file:
            pdf_content = pdf_file.read()
        
        pdf_filename = f"{output_name}.pdf"
        pdf_storage_path = await storage.upload_generated_resume(
            file_path=pdf_filename,
            file_content=pdf_content,
            analysis_id=analysis.id
        )
        
        # Get signed URL for preview
        pdf_url = await storage.get_signed_url(
            bucket="generated-resumes",
            path=pdf_storage_path,
            expires_in=3600
        )
        
        # Clean up local file
        import os
        if os.path.exists(pdf_path):
            os.unlink(pdf_path)
        
        return CompilePDFResponse(
            success=True,
            pdf_url=pdf_url
        )
        
    except Exception as e:
        return CompilePDFResponse(
            success=False,
            error=str(e)
        )
