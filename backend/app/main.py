from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import init_db
from app.middleware.rate_limit import limiter, rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import sentry_sdk
import os

# Import routers
from app.api import auth_routes, profile_routes, analysis_routes, download_routes, editor_routes, examples_routes, analytics_routes, versions_routes

# Import error handlers
from app.core.exceptions import ResumeAnalyzerException
from app.core.error_handlers import (
    resume_analyzer_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler
)
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Initialize Sentry for error monitoring
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=0.1,
        environment=os.getenv("ENVIRONMENT", "development")
    )

# Create FastAPI app
app = FastAPI(
    title="ResumeCraft API",
    description="Craft the Perfect Resume - AI-powered resume optimization and job matching",
    version="1.0.0"
)

# Add rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Configure CORS
print(f"🔧 CORS Configuration:")
print(f"   Allowed Origins: {settings.CORS_ORIGINS}")
print(f"   Type: {type(settings.CORS_ORIGINS)}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Add GZIP compression for responses
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)  # Compress responses > 1KB

# Debug middleware to log requests
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"📝 Incoming request: {request.method} {request.url.path}")
    print(f"   Origin: {request.headers.get('origin', 'No origin header')}")
    response = await call_next(request)
    print(f"   Response status: {response.status_code}")
    return response


# Include routers
app.include_router(auth_routes.router)
app.include_router(profile_routes.router)
app.include_router(analysis_routes.router)
app.include_router(download_routes.router)
app.include_router(editor_routes.router)
app.include_router(examples_routes.router)
app.include_router(analytics_routes.router)
app.include_router(versions_routes.router)

# Register error handlers
app.add_exception_handler(ResumeAnalyzerException, resume_analyzer_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "ResumeCraft API - Craft the Perfect Resume",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
