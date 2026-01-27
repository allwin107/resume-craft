'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { User, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ProfilePage() {
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '',
        phone: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.put(
                `${API_URL}/api/profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            // Reload page to refresh user data
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gradient">Profile</h1>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                    }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>{message.text}</p>
                </div>
            )}

            <div className="card">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-400 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user?.username}</h2>
                        <p className="text-gray-600">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={user?.email || ''}
                                className="input-field pl-11 bg-gray-50"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={user?.username || ''}
                                className="input-field pl-11 bg-gray-50"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="John Doe"
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field pl-11"
                                placeholder="+1234567890"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {isEditing ? (
                            <>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            full_name: user?.full_name || '',
                                            phone: user?.phone || ''
                                        });
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="btn-primary"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
