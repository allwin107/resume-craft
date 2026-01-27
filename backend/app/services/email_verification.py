"""
Email verification service using Supabase Auth
"""
from supabase import create_client
from app.config import settings


class EmailVerificationService:
    """Handle email verification using Supabase Auth"""
    
    def __init__(self):
        self.client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
    
    async def send_verification_email(self, email: str):
        """
        Send verification email to user
        Note: Supabase Auth handles this automatically when email auth is enabled
        """
        try:
            # Supabase sends verification emails automatically
            # This method is for manual triggers if needed
            result = self.client.auth.admin.generate_link({
                "type": "signup",
                "email": email
            })
            return result
        except Exception as e:
            print(f"Error sending verification email: {e}")
            return None
    
    async def verify_email_token(self, token: str):
        """Verify email verification token"""
        try:
            result = self.client.auth.verify_otp({
                "token_hash": token,
                "type": "email"
            })
            return result
        except Exception as e:
            print(f"Error verifying token: {e}")
            return None
