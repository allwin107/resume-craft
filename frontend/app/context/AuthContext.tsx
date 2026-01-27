'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface User {
    id: number;
    email: string;
    username: string;
    full_name?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string, full_name?: string, phone?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = async (authToken: string) => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        });

        const { access_token } = response.data;
        setToken(access_token);
        localStorage.setItem('token', access_token);
        await fetchUser(access_token);
    };

    const register = async (email: string, username: string, password: string, full_name?: string, phone?: string) => {
        await axios.post(`${API_URL}/api/auth/register`, {
            email,
            username,
            password,
            full_name,
            phone
        });

        // Auto-login after registration
        await login(email, password);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Axios interceptor to add token to requests
export function setupAxiosInterceptors(token: string | null) {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}
