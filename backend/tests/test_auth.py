"""
Tests for authentication endpoints
"""
import pytest
from app.database.models import User


class TestAuthRegistration:
    """Test user registration"""
    
    def test_register_new_user(self, client, test_user_data):
        """Test successful user registration"""
        response = client.post("/api/auth/register", json=test_user_data)
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == test_user_data["email"]
        assert data["username"] == test_user_data["username"]
        assert "id" in data
    
    def test_register_duplicate_email(self, client, test_user_data):
        """Test registration with duplicate email"""
        # Register once
        client.post("/api/auth/register", json=test_user_data)
        
        # Try to register again
        response = client.post("/api/auth/register", json=test_user_data)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_register_invalid_email(self, client, test_user_data):
        """Test registration with invalid email"""
        test_user_data["email"] = "invalid-email"
        response = client.post("/api/auth/register", json=test_user_data)
        assert response.status_code == 422


class TestAuthLogin:
    """Test user login"""
    
    def test_login_success(self, client, test_user_data):
        """Test successful login"""
        # Register user first
        client.post("/api/auth/register", json=test_user_data)
        
        # Login
        response = client.post("/api/auth/login", data={
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_wrong_password(self, client, test_user_data):
        """Test login with wrong password"""
        # Register user first
        client.post("/api/auth/register", json=test_user_data)
        
        # Login with wrong password
        response = client.post("/api/auth/login", data={
            "username": test_user_data["email"],
            "password": "WrongPassword123!"
        })
        assert response.status_code == 401
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user"""
        response = client.post("/api/auth/login", data={
            "username": "nonexistent@example.com",
            "password": "Password123!"
        })
        assert response.status_code == 401


class TestAuthProfile:
    """Test profile endpoints"""
    
    def test_get_profile_authenticated(self, client, test_user_data, auth_headers):
        """Test getting profile when authenticated"""
        # Register user
        client.post("/api/auth/register", json=test_user_data)
        
        # Get profile
        response = client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user_data["email"]
    
    def test_get_profile_unauthenticated(self, client):
        """Test getting profile without authentication"""
        response = client.get("/api/auth/me")
        assert response.status_code == 401
    
    def test_update_profile(self, client, test_user_data, auth_headers):
        """Test updating user profile"""
        # Register user
        client.post("/api/auth/register", json=test_user_data)
        
        # Update profile
        update_data = {"full_name": "Updated Name", "phone": "1234567890"}
        response = client.put("/api/auth/profile", json=update_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] == update_data["full_name"]
        assert data["phone"] == update_data["phone"]
