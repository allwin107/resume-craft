from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from app.database.database import get_db
from app.database.models import User, Analysis
from app.auth.auth import get_current_active_user
from app.services.latex_service import LaTeXService
from app.services.supabase_storage import SupabaseStorage
from app.sample_data.latex_templates import LATEX_TEMPLATES


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
        last_updated=(analysis.created_at or datetime.now()).isoformat()
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
    """Note: PDF compilation is not available due to unreliable online compilers"""
    
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
    
    # Return helpful message instead of attempting unreliable compilation
    return CompilePDFResponse(
        success=False,
        error="PDF compilation is not available. Please download the .tex file and compile locally using Overleaf (overleaf.com) or your own LaTeX installation."
    )


@router.get("/templates", tags=["Templates"])
async def get_latex_templates():
    """Get available LaTeX resume templates"""
    templates_list = [
        {
            "id": template_id,
            "name": template_data["name"],
            "description": template_data["description"]
        }
        for template_id, template_data in LATEX_TEMPLATES.items()
    ]
    return {"templates": templates_list}


@router.get("/templates/{template_id}", tags=["Templates"])
async def get_template_content(template_id: str):
    """Get specific template content"""
    if template_id not in LATEX_TEMPLATES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    template = LATEX_TEMPLATES[template_id]
    return {
        "id": template_id,
        "name": template["name"],
        "description": template["description"],
        "content": template["content"]
    }
