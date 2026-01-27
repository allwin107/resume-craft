'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { FileText, History as HistoryIcon, TrendingUp, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [recentAnalyses, setRecentAnalyses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchRecentAnalyses();
        }
    }, [token]);

    const fetchRecentAnalyses = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/profile/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecentAnalyses(response.data.history.slice(0, 5));
        } catch (error) {
            console.error('Error fetching analyses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="card-glass">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.full_name || user?.username}! 👋
                </h1>
                <p className="text-gray-600">
                    Ready to analyze your resume and land your dream job?
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/analyze" className="card group hover:border-primary-500 cursor-pointer">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                            <FileText className="w-6 h-6 text-primary-600 group-hover:text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                New Analysis
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </h3>
                            <p className="text-gray-600">
                                Upload your resume and compare it against a job description
                            </p>
                        </div>
                    </div>
                </Link>

                <Link href="/history" className="card group hover:border-green-500 cursor-pointer">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                            <HistoryIcon className="w-6 h-6 text-green-600 group-hover:text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                View History
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </h3>
                            <p className="text-gray-600">
                                Review your past analyses and track your progress
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Analyses */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-6">Recent Analyses</h2>

                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : recentAnalyses.length > 0 ? (
                    <div className="space-y-4">
                        {recentAnalyses.map((analysis: any) => (
                            <Link
                                key={analysis.id}
                                href={`/analysis/${analysis.id}`}
                                className="block p-4 border-2 border-gray-100 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{analysis.job_title}</h3>
                                        <p className="text-sm text-gray-600">{analysis.resume_filename}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className={`w-5 h-5 ${analysis.match_score >= 70 ? 'text-green-500' :
                                                analysis.match_score >= 50 ? 'text-yellow-500' :
                                                    'text-red-500'
                                                }`} />
                                            <span className="text-2xl font-bold">{Math.round(analysis.match_score)}%</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {new Date(analysis.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No analyses yet</p>
                        <Link href="/analyze" className="btn-primary inline-block">
                            Create Your First Analysis
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
