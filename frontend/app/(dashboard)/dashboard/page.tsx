'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { FileText, History as HistoryIcon, TrendingUp, ArrowRight, Users, Award, Zap, BarChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import WelcomeTour from '@/components/onboarding/WelcomeTour';
import StatsCard from '@/components/analytics/StatsCard';
import TrendsChart from '@/components/analytics/TrendsChart';
import ScoreDistribution from '@/components/analytics/ScoreDistribution';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [recentAnalyses, setRecentAnalyses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTour, setShowTour] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchRecentAnalyses();
            fetchAnalytics();
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

    useEffect(() => {
        // Check if user has seen the tour
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            // Show tour after a short delay
            setTimeout(() => setShowTour(true), 1000);
        }
    }, []);

    const handleTourFinish = () => {
        setShowTour(false);
        localStorage.setItem('hasSeenTour', 'true');
    };

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/analytics/stats?period=month`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Message */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2" id="dashboard-title">
                    Welcome back, {user?.full_name || 'there'}! 👋
                </h1>
                <p className="text-gray-600">
                    Track your resume analysis progress and improve your job applications
                </p>
            </div>

            {/* Analytics Section */}
            {!analyticsLoading && analytics && (
                <div className="mb-8">
                    {/* Stats Overview */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatsCard
                            title="Total Analyses"
                            value={analytics.stats.total_analyses}
                            subtitle="All time"
                            icon={<BarChart className="w-6 h-6 text-primary-600" />}
                        />
                        <StatsCard
                            title="Average Score"
                            value={`${analytics.stats.avg_match_score}%`}
                            subtitle="Match rate"
                            icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
                        />
                        <StatsCard
                            title="Best Match"
                            value={`${analytics.stats.best_match_score}%`}
                            subtitle="Top score"
                            icon={<Award className="w-6 h-6 text-primary-600" />}
                        />
                        <StatsCard
                            title="Improved"
                            value={analytics.stats.total_improved}
                            subtitle={`${(analytics.stats.improvement_rate * 100).toFixed(0)}% rate`}
                            icon={<Zap className="w-6 h-6 text-primary-600" />}
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <TrendsChart data={analytics.trends} type="line" />
                        <ScoreDistribution distribution={analytics.score_distribution} />
                    </div>
                </div>
            )}

            {/* Onboarding Tour */}
            <WelcomeTour run={showTour} onFinish={handleTourFinish} />

            {/* Try Examples Card */}
            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200" data-tour="examples">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">✨ Try Example Resumes</h2>
                        <p className="text-gray-700 mb-4">
                            New here? Test our AI with pre-loaded example resumes to see the magic in action!
                        </p>
                        <Link href="/examples" className="btn-primary inline-block">
                            Browse Examples
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/analyze" className="card group hover:border-primary-500 cursor-pointer" data-tour="upload-resume">
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
