from supabase import create_client, Client
from app.config import settings
from typing import Dict


class RealtimeService:
    """Service for broadcasting real-time updates via Supabase"""
    
    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
    
    async def update_analysis_progress(
        self, 
        analysis_id: int, 
        status: str, 
        percentage: int
    ):
        """Update analysis progress in database to trigger realtime updates"""
        try:
            result = self.client.table('analyses').update({
                'progress_status': status,
                'progress_percentage': percentage
            }).eq('id', analysis_id).execute()
            return result.data
        except Exception as e:
            print(f"Error updating progress: {e}")
            return None
    
    async def broadcast_completion(self, analysis_id: int, data: Dict):
        """Broadcast analysis completion"""
        await self.update_analysis_progress(analysis_id, "completed", 100)
