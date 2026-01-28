from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import os
import tempfile
from datetime import datetime

from app.database.database import get_db
from app.database.models import User, Resume, JobDescription, Analysis
from app.auth.auth import get_current_active_user
from app.services.resume_parser import ResumeParser
from app.services.groq_analyzer import GroqAnalyzer
from app.services.resume_editor import ResumeEditor
from app.services.supabase_storage import SupabaseStorage
from app.services.realtime_service import RealtimeService
from app.config import settings
from pydantic import BaseModel


router = APIRouter(prefix="/api/analyze", tags=["Analysis"])


class AnalysisResponse(BaseModel):
    """Analysis response schema"""
    id: int
    match_score: float
    matched_skills: list
    missing_skills: list
    matched_keywords: list
    missing_keywords: list
    improvements: list
    summary: str
    progress_status: str
    progress_percentage: int
    
    class Config:
        from_attributes = True


class ImproveResumeRequest(BaseModel):
    """Request schema for resume improvement"""
    analysis_id: int


@router.post("", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_resume(
    resume_file: UploadFile = File(...),
    jd_text: str = Form(...),
    jd_title: Optional[str] = Form(None),
    jd_company: Optional[str] = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Analyze resume against job description
    Upload resume file and provide JD text for comprehensive analysis
    """
    
    # Validate file type
    file_ext = os.path.splitext(resume_file.filename)[1].lower()
    if file_ext not in ['.pdf', '.docx', '.doc']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported"
        )
    
    # Validate file size
    contents = await resume_file.read()
    file_size_mb = len(contents) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit"
        )
    
    await resume_file.seek(0)  # Reset file pointer
    
    try:
        # Upload to Supabase Storage
        storage = SupabaseStorage()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{resume_file.filename}"
        
        # Upload file
        storage_path = await storage.upload_resume(
            file_path=filename,
            file_content=contents,
            user_id=current_user.id
        )
        
        # Save to temp file for parsing
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            tmp_file.write(contents)
            tmp_path = tmp_file.name
        
        # Parse resume
        parser = ResumeParser()
        parsed_data = parser.parse_resume(tmp_path)
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        # Create resume record
        resume = Resume(
            user_id=current_user.id,
            filename=resume_file.filename,
            file_path=f"supabase://{storage_path}",  # Mark as Supabase path
            storage_path=storage_path,
            storage_bucket="resumes",
            file_type=file_ext,
            extracted_text=parsed_data['raw_text'],
            parsed_data=parsed_data
        )
        db.add(resume)
        db.flush()
        
        # Create job description record
        job_desc = JobDescription(
            title=jd_title or "Untitled Position",
            company=jd_company,
            description=jd_text
        )
        db.add(job_desc)
        db.flush()
        
        # Create analysis record with initial status
        analysis = Analysis(
            user_id=current_user.id,
            resume_id=resume.id,
            job_description_id=job_desc.id,
            progress_status="analyzing",
            progress_percentage=10
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        # Update realtime progress
        realtime = RealtimeService()
        await realtime.update_analysis_progress(analysis.id, "analyzing", 30)
        
        # Analyze with AI
        analyzer = GroqAnalyzer()
        analysis_result = analyzer.analyze_resume_jd_match(
            resume_text=parsed_data['raw_text'],
            jd_text=jd_text
        )
        
        # Update realtime progress
        await realtime.update_analysis_progress(analysis.id, "analyzing", 80)
        
        # Update analysis with results
        analysis.match_score = analysis_result['match_score']
        analysis.matched_skills = analysis_result['matched_skills']
        analysis.missing_skills = analysis_result['missing_skills']
        analysis.matched_keywords = analysis_result['matched_keywords']
        analysis.missing_keywords = analysis_result['missing_keywords']
        analysis.improvements = analysis_result['improvements']
        analysis.summary = analysis_result['summary']
        analysis.progress_status = "completed"
        analysis.progress_percentage = 100
        
        db.commit()
        db.refresh(analysis)
        
        # Broadcast completion
        await realtime.broadcast_completion(analysis.id, {"match_score": analysis.match_score})
        
        return analysis
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing resume: {str(e)}"
        )


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific analysis by ID"""
    
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return analysis


@router.post("/improve")
async def improve_resume(
    request: ImproveResumeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Generate improved resume based on analysis
    Returns LaTeX content and PDF path
    """
    
    # Get analysis
    analysis = db.query(Analysis).filter(
        Analysis.id == request.analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    try:
        # Update progress
        realtime = RealtimeService()
        await realtime.update_analysis_progress(analysis.id, "improving", 0)
        
        # Generate improved resume LaTeX content (skip PDF compilation for now)
        editor = ResumeEditor()
        
        # Get improved content from AI
        improved_data = editor.improve_resume_content(
            resume_text=analysis.resume.extracted_text,
            jd_text=analysis.job_description.description,
            missing_skills=analysis.missing_skills or [],
            missing_keywords=analysis.missing_keywords or []
        )
        
        await realtime.update_analysis_progress(analysis.id, "improving", 50)
        
        # Generate LaTeX from improved data
        from app.services.latex_service import LaTeXService
        latex_service = LaTeXService()
        latex_content = latex_service.generate_latex_from_template(improved_data)
        
        await realtime.update_analysis_progress(analysis.id, "improving", 70)
        
        # Upload LaTeX file to Supabase
        storage = SupabaseStorage()
        latex_filename = f"improved_{datetime.now().strftime('%Y%m%d_%H%M%S')}.tex"
        latex_storage_path = await storage.upload_generated_resume(
            file_path=latex_filename,
            file_content=latex_content.encode('utf-8'),
            analysis_id=analysis.id
        )
        
        # Update analysis with improved resume (LaTeX only, PDF can be generated locally)
        analysis.improved_latex = latex_content
        analysis.latex_storage_path = latex_storage_path
        analysis.progress_status = "completed"
        analysis.progress_percentage = 100
        
        db.commit()
        
        await realtime.broadcast_completion(analysis.id, {"improved": True})
        
        return {
            "message": "Resume improved successfully",
            "analysis_id": analysis.id,
            "latex_available": True,
            "pdf_available": False,
            "note": "LaTeX file generated. You can download and compile it locally to create PDF."
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error improving resume: {str(e)}"
        )
