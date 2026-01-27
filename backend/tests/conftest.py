"""
Pytest configuration and fixtures for backend tests
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.database import Base, get_db
from app.auth.auth import create_access_token

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database override"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """Sample user data for testing"""
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "TestPassword123!",
        "full_name": "Test User"
    }


@pytest.fixture
def auth_headers(test_user_data):
    """Generate authentication headers for testing"""
    token = create_access_token(data={"sub": test_user_data["email"]})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_resume_text():
    """Sample resume text for testing"""
    return """
    JOHN DOE
    Software Engineer
    
    EXPERIENCE:
    - Senior Developer at Tech Corp (2020-2023)
    - Python, FastAPI, React, PostgreSQL
    
    SKILLS:
    Python, JavaScript, Docker, AWS, Git
    
    EDUCATION:
    BS Computer Science, University (2016-2020)
    """


@pytest.fixture
def sample_jd_text():
    """Sample job description for testing"""
    return """
    Senior Software Engineer
    
    Requirements:
    - 3+ years Python experience
    - FastAPI or Django
    - React or Vue.js
    - PostgreSQL database
    - Docker and Kubernetes
    - AWS cloud experience
    """
