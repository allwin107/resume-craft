from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import init_db
from app.middleware.rate_limit import limiter, rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import sentry_sdk
import os

# Import routers
from app.api.auth_routes import router as auth_router
from app.api.profile_routes import router as profile_router
from app.api.analysis_routes import router as analysis_router
from app.api.download_routes import router as download_router
from app.api.editor_routes import router as editor_router

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

# Debug middleware to log requests
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"📝 Incoming request: {request.method} {request.url.path}")
    print(f"   Origin: {request.headers.get('origin', 'No origin header')}")
    response = await call_next(request)
    print(f"   Response status: {response.status_code}")
    return response


# Include routers
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(analysis_router)
app.include_router(download_router)
app.include_router(editor_router)


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
