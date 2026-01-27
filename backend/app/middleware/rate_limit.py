"""
Rate limiting middleware using slowapi
"""
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException
from starlette.status import HTTP_429_TOO_MANY_REQUESTS


# Create limiter instance
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],  # Global rate limit
    storage_uri="memory://",  # Use in-memory storage (free tier)
)


async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Custom rate limit exceeded handler"""
    return HTTPException(
        status_code=HTTP_429_TOO_MANY_REQUESTS,
        detail={
            "error": "Rate limit exceeded",
            "message": "Too many requests. Please try again later.",
            "retry_after": str(exc.detail)
        }
    )


# Rate limit configurations for different endpoints
RATE_LIMITS = {
    "auth_login": "5/15minutes",  # 5 login attempts per 15 minutes
    "auth_register": "3/hour",  # 3 registrations per hour
    "analysis": "10/hour",  # 10 analyses per hour
    "download": "50/hour",  # 50 downloads per hour
    "general_api": "100/minute",  # General API limit
}
