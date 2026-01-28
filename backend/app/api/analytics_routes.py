from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database.database import get_db
from app.database.models import User, Analysis
from app.auth.auth import get_current_active_user


router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


class UserStats(BaseModel):
    """User statistics summary"""
    total_analyses: int
    avg_match_score: float
    best_match_score: int
    this_month: int
    improvement_rate: float
    total_improved: int


class TrendDataPoint(BaseModel):
    """Single data point for trends"""
    date: str
    count: int
    avg_score: float


class AnalyticsResponse(BaseModel):
    """Complete analytics data"""
    stats: UserStats
    trends: list[TrendDataPoint]
    score_distribution: dict[str, int]


@router.get("/stats", response_model=AnalyticsResponse)
async def get_user_analytics(
    period: str = Query(default="month", regex="^(week|month|year|all)$"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive analytics for the current user
    
    Args:
        period: Time period for trends (week, month, year, all)
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Full analytics data including stats, trends, and distributions
    """
    # Calculate date range based on period
    now = datetime.utcnow()
    if period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now - timedelta(days=30)
    elif period == "year":
        start_date = now - timedelta(days=365)
    else:  # all
        start_date = datetime(2020, 1, 1)  # Beginning of time
    
    # Get all user analyses
    all_analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).all()
    
    # Calculate overall statistics
    total_analyses = len(all_analyses)
    
    if total_analyses == 0:
        # Return empty analytics for new users
        return AnalyticsResponse(
            stats=UserStats(
                total_analyses=0,
                avg_match_score=0.0,
                best_match_score=0,
                this_month=0,
                improvement_rate=0.0,
                total_improved=0
            ),
            trends=[],
            score_distribution={"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
        )
    
    # Calculate statistics
    match_scores = [a.match_score for a in all_analyses if a.match_score is not None]
    avg_match_score = sum(match_scores) / len(match_scores) if match_scores else 0.0
    best_match_score = max(match_scores) if match_scores else 0
    
    # Count this month's analyses
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    this_month = sum(1 for a in all_analyses if a.created_at >= month_start)
    
    # Calculate improvement rate
    total_improved = sum(1 for a in all_analyses if a.improved_latex is not None)
    improvement_rate = total_improved / total_analyses if total_analyses > 0 else 0.0
    
    # Build trends data
    trends_data = []
    period_analyses = [a for a in all_analyses if a.created_at >= start_date]
    
    # Group by date
    date_groups = {}
    for analysis in period_analyses:
        date_key = analysis.created_at.strftime("%Y-%m-%d")
        if date_key not in date_groups:
            date_groups[date_key] = []
        date_groups[date_key].append(analysis)
    
    # Calculate trends for each date
    for date_key in sorted(date_groups.keys()):
        analyses = date_groups[date_key]
        scores = [a.match_score for a in analyses if a.match_score is not None]
        avg_score = sum(scores) / len(scores) if scores else 0.0
        
        trends_data.append(TrendDataPoint(
            date=date_key,
            count=len(analyses),
            avg_score=round(avg_score, 1)
        ))
    
    # Calculate score distribution
    score_distribution = {
        "0-20": 0,
        "21-40": 0,
        "41-60": 0,
        "61-80": 0,
        "81-100": 0
    }
    
    for score in match_scores:
        if score <= 20:
            score_distribution["0-20"] += 1
        elif score <= 40:
            score_distribution["21-40"] += 1
        elif score <= 60:
            score_distribution["41-60"] += 1
        elif score <= 80:
            score_distribution["61-80"] += 1
        else:
            score_distribution["81-100"] += 1
    
    return AnalyticsResponse(
        stats=UserStats(
            total_analyses=total_analyses,
            avg_match_score=round(avg_match_score, 1),
            best_match_score=best_match_score,
            this_month=this_month,
            improvement_rate=round(improvement_rate, 2),
            total_improved=total_improved
        ),
        trends=trends_data,
        score_distribution=score_distribution
    )


@router.get("/export")
async def export_analysis_history(
    format: str = Query(default="csv", regex="^(csv|json)$"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Export user's analysis history in specified format
    
    Args:
        format: Export format (csv or json)
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Analysis history data
    """
    from fastapi.responses import Response
    
    # Get all user analyses
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).all()
    
    if format == "json":
        # JSON export
        data = [
            {
                "id": a.id,
                "created_at": a.created_at.isoformat(),
                "job_description": a.job_description[:100] + "..." if len(a.job_description) > 100 else a.job_description,
                "match_score": a.match_score,
                "has_improvement": a.improved_latex is not None,
                "summary": a.summary[:200] + "..." if a.summary and len(a.summary) > 200 else a.summary
            }
            for a in analyses
        ]
        
        import json
        return Response(
            content=json.dumps(data, indent=2),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=analysis_history.json"}
        )
    
    else:  # CSV
        import csv
        from io import StringIO
        
        output = StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(["ID", "Date", "Match Score", "Improved", "Summary Preview"])
        
        # Write data
        for a in analyses:
            writer.writerow([
                a.id,
                a.created_at.strftime("%Y-%m-%d %H:%M"),
                a.match_score or "N/A",
                "Yes" if a.improved_latex else "No",
                (a.summary[:100] + "...") if a.summary and len(a.summary) > 100 else (a.summary or "")
            ])
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=analysis_history.csv"}
        )
