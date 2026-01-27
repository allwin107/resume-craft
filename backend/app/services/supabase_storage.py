from supabase import create_client, Client
from app.config import settings
import mimetypes
from datetime import timedelta
class SupabaseStorage:
    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
    
    async def upload_resume(self, file_path: str, file_content: bytes, user_id: int):
        """Upload resume to Supabase Storage"""
        bucket = "resumes"
        path = f"{user_id}/{file_path}"
        
        # Upload file
        result = self.client.storage.from_(bucket).upload(
            path=path,
            file=file_content,
            file_options={"content-type": mimetypes.guess_type(file_path)[0]}
        )
        return path
    
    async def upload_generated_resume(self, file_path: str, file_content: bytes, analysis_id: int):
        """Upload generated resume to Supabase Storage"""
        bucket = "generated-resumes"
        path = f"{analysis_id}/{file_path}"
        
        result = self.client.storage.from_(bucket).upload(
            path=path,
            file=file_content,
            file_options={"content-type": mimetypes.guess_type(file_path)[0]}
        )
        return path
    
    async def get_signed_url(self, bucket: str, path: str, expires_in: int = 3600):
        """Generate signed URL for secure file access"""
        result = self.client.storage.from_(bucket).create_signed_url(
            path=path,
            expires_in=expires_in
        )
        return result['signedURL']
    
    async def delete_file(self, bucket: str, path: str):
        """Delete file from storage"""
        self.client.storage.from_(bucket).remove([path])
