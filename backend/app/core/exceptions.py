"""
Custom exceptions for the Resume Analyzer application
"""

class ResumeAnalyzerException(Exception):
    """Base exception for all Resume Analyzer errors"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class FileUploadError(ResumeAnalyzerException):
    """Raised when file upload fails"""
    def __init__(self, message: str = "File upload failed"):
        super().__init__(message, status_code=400)


class FileProcessingError(ResumeAnalyzerException):
    """Raised when file processing fails"""
    def __init__(self, message: str = "Failed to process file"):
        super().__init__(message, status_code=422)


class AIServiceError(ResumeAnalyzerException):
    """Raised when AI service (Groq) fails"""
    def __init__(self, message: str = "AI service temporarily unavailable"):
        super().__init__(message, status_code=503)


class DatabaseError(ResumeAnalyzerException):
    """Raised when database operations fail"""
    def __init__(self, message: str = "Database operation failed"):
        super().__init__(message, status_code=500)


class AuthenticationError(ResumeAnalyzerException):
    """Raised when authentication fails"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status_code=401)


class AuthorizationError(ResumeAnalyzerException):
    """Raised when user is not authorized"""
    def __init__(self, message: str = "Not authorized to access this resource"):
        super().__init__(message, status_code=403)


class ResourceNotFoundError(ResumeAnalyzerException):
    """Raised when requested resource is not found"""
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)


class ValidationError(ResumeAnalyzerException):
    """Raised when validation fails"""
    def __init__(self, message: str = "Validation error"):
        super().__init__(message, status_code=422)


class StorageError(ResumeAnalyzerException):
    """Raised when storage operations fail"""
    def __init__(self, message: str = "Storage operation failed"):
        super().__init__(message, status_code=500)


class LatexCompilationError(ResumeAnalyzerException):
    """Raised when LaTeX compilation fails"""
    def __init__(self, message: str = "LaTeX compilation failed"):
        super().__init__(message, status_code=422)
