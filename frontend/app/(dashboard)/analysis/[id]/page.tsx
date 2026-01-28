'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/lib/supabase';
import axios from 'axios';
import { TrendingUp, CheckCircle, XCircle, Lightbulb, Download, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AnalysisResultPage() {
    const params = useParams();
    const router = useRouter();
    const { token } = useAuth();
    const [analysis, setAnalysis] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImproving, setIsImproving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (params.id && token) {
            fetchAnalysis();

            // Subscribe to realtime updates
            const channel = supabase
                .channel(`analysis_${params.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'analyses',
                        filter: `id=eq.${params.id}`
                    },
                    (payload: any) => {
                        // Update analysis state with new data
                        setAnalysis((prev: any) => ({
                            ...prev,
                            ...payload.new
                        }));
                    }
                )
                .subscribe();

            // Cleanup subscription on unmount
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [params.id, token]);

    const fetchAnalysis = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/analyze/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalysis(response.data);
        } catch (err: any) {
            setError('Failed to load analysis');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImproveResume = async () => {
        setIsImproving(true);
        try {
            await axios.post(
                `${API_URL}/api/analyze/improve`,
                { analysis_id: params.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Resume improved successfully! You can now download the improved version.');
            fetchAnalysis();
        } catch (err) {
            alert('Failed to improve resume. Please try again.');
        } finally {
            setIsImproving(false);
        }
    };

    const handleDownloadLatex = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/download/latex/${params.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `improved_resume_${params.id}.tex`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download LaTeX file. Please try again.');
        }
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse-slow text-primary-600 text-lg">Loading analysis...</div>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="card text-center">
                <p className="text-red-600 mb-4">{error || 'Analysis not found'}</p>
                <Link href="/dashboard" className="btn-primary inline-block">Back to Dashboard</Link>
            </div>
        );
    }

    const matchScore = Math.round(analysis.match_score);
    const scoreColor = matchScore >= 70 ? 'text-green-600' : matchScore >= 50 ? 'text-yellow-600' : 'text-red-600';
    const scoreBg = matchScore >= 70 ? 'bg-green-100' : matchScore >= 50 ? 'bg-yellow-100' : 'bg-red-100';

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>
                <div className="flex gap-3">
                    <a
                        href={`${API_URL}/api/download/original/${params.id}`}
                        className="btn-secondary"
                        target="_blank"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Original Resume
                    </a>
                    {analysis.improved_latex && (
                        <>
                            <button
                                onClick={handleDownloadLatex}
                                className="btn-secondary"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download LaTeX
                            </button>
                            <a
                                href={`${API_URL}/api/download/pdf/${params.id}`}
                                className="btn-primary"
                                target="_blank"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Improved Resume PDF
                            </a>
                        </>
                    )}
                </div>
            </div>

            {/* Match Score */}
            <div className="card text-center">
                <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>
                <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full ${scoreBg} mb-4`}>
                    <div className="text-center">
                        <div className={`text-5xl font-bold ${scoreColor}`}>{matchScore}%</div>
                        <div className="text-sm text-gray-600 mt-1">Match Score</div>
                    </div>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                    {matchScore >= 70 ? 'Excellent match! Your resume aligns well with the job requirements.' :
                        matchScore >= 50 ? 'Good match with room for improvement.' :
                            'Significant gaps identified. Review the suggestions below.'}
                </p>
            </div>

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Matched Skills
                    </h2>
                    {analysis.matched_skills && analysis.matched_skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {analysis.matched_skills.map((skill: string, idx: number) => (
                                <span key={idx} className="badge badge-success">{skill}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No matched skills identified</p>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <XCircle className="w-6 h-6 text-red-600" />
                        Missing Skills
                    </h2>
                    {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {analysis.missing_skills.map((skill: string, idx: number) => (
                                <span key={idx} className="badge badge-danger">{skill}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No missing skills identified</p>
                    )}
                </div>
            </div>

            {/* Keywords Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Matched Keywords</h2>
                    {analysis.matched_keywords && analysis.matched_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {analysis.matched_keywords.map((keyword: string, idx: number) => (
                                <span key={idx} className="badge badge-info">{keyword}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No matched keywords identified</p>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">Missing Keywords</h2>
                    {analysis.missing_keywords && analysis.missing_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {analysis.missing_keywords.map((keyword: string, idx: number) => (
                                <span key={idx} className="badge badge-warning">{keyword}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No missing keywords identified</p>
                    )}
                </div>
            </div>

            {/* Improvements */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    Improvement Suggestions
                </h2>
                {analysis.improvements && analysis.improvements.length > 0 ? (
                    <div className="space-y-4">
                        {analysis.improvements.map((improvement: any, idx: number) => (
                            <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold">{improvement.category}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${improvement.priority === 'high' ? 'bg-red-100 text-red-700' :
                                        improvement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {improvement.priority}
                                    </span>
                                </div>
                                <p className="text-gray-700">{improvement.suggestion}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No specific improvements suggested</p>
                )}
            </div>

            {/* Summary */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Summary</h2>
                <p className="text-gray-700 whitespace-pre-line">{analysis.summary}</p>
            </div>

            {/* AI Improve Button */}
            {!analysis.improved_latex && (
                <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
                    <div className="text-center">
                        <Sparkles className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Want an AI-Improved Resume?</h3>
                        <p className="text-gray-600 mb-6">
                            Let our AI automatically improve your resume based on the job description and identified gaps.
                        </p>
                        <button
                            onClick={handleImproveResume}
                            disabled={isImproving}
                            className="btn-primary disabled:opacity-50"
                        >
                            {isImproving ? 'Improving...' : 'Generate Improved Resume'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
