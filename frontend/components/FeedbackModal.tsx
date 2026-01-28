'use client';

import { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [category, setCategory] = useState('general');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            showToast('Please select a rating', 'warning');
            return;
        }

        if (!message.trim()) {
            showToast('Please enter your feedback', 'warning');
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.post(
                `${API_URL}/api/feedback/`,
                {
                    rating,
                    message: message.trim(),
                    category,
                    email: email.trim() || null
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );

            showToast('Thank you for your feedback!', 'success');
            onClose();

            // Reset form
            setRating(0);
            setCategory('general');
            setMessage('');
            setEmail('');
        } catch (error: any) {
            console.error('Feedback submission error:', error);
            showToast(error.response?.data?.detail || 'Failed to submit feedback', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="card max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Feedback</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                            How would you rate your experience? *
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field"
                        >
                            <option value="general">General Feedback</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                            Your Feedback *
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you think..."
                            rows={5}
                            className="input-field resize-none"
                            required
                        />
                    </div>

                    {/* Email (optional) */}
                    {!token && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="input-field"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Provide your email if you'd like us to follow up
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>Submitting...</>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Feedback
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
