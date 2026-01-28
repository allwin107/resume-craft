'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/lib/supabase';
import axios from 'axios';
import { TrendingUp, CheckCircle, XCircle, Lightbulb, Download, Sparkles, FileText, Upload, ArrowLeft, Eye } from 'lucide-react';
import LoadingSteps from '@/components/LoadingSteps';
import LaTeXPreviewModal from '@/components/LaTeXPreviewModal';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AnalysisResultPage() {
    const params = useParams();
    const router = useRouter();
    const { token } = useAuth();
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [improving, setImproving] = useState(false);
    const [improvementStep, setImprovementStep] = useState(0);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
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
            setLoading(false);
        }
    };

    const handleImproveResume = async () => {
        setImproving(true);
        setImprovementStep(0);

        // Simulate progress steps
        const steps = [
            { delay: 500, step: 0 },   // Parsing resume
            { delay: 2000, step: 1 },  // Analyzing content
            { delay: 2500, step: 2 },  // Generating improvements
            { delay: 1500, step: 3 },  // Creating LaTeX
        ];

        steps.forEach(({ delay, step }) => {
            setTimeout(() => setImprovementStep(step), delay);
        });

        try {
            await axios.post(
                `${API_URL}/api/analyze/improve`,
                { analysis_id: params.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setImprovementStep(4); // Complete
            await fetchAnalysis();
        } catch (err) {
            alert('Failed to improve resume. Please try again.');
        } finally {
            setImproving(false);
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


    if (loading) {
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
                                onClick={() => setShowPreviewModal(true)}
                                className="btn-secondary"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Preview LaTeX
                            </button>
                            <button
                                onClick={handleDownloadLatex}
                                className="btn-secondary"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download LaTeX
                            </button>
                            <button
                                onClick={() => router.push(`/editor/${params.id}`)}
                                className="btn-primary"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit in Playground
                            </button>
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

            {/* AI Improve Button / Loading Steps */}
            {!analysis.improved_latex && !improving && (
                <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-primary-600" />
                                AI-Powered Resume Enhancement
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Let our AI analyze your resume and generate an improved version in professional LaTeX format,
                                optimized for the job description.
                            </p>
                            <button
                                onClick={handleImproveResume}
                                disabled={improving}
                                className="btn-primary disabled:opacity-50"
                            >
                                {improving ? 'Improving...' : 'Improve Resume'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Steps Modal */}
            {improving && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4">
                        <h2 className="text-2xl font-bold mb-6 text-center">Improving Your Resume</h2>
                        <LoadingSteps
                            currentStep={improvementStep}
                            steps={[
                                {
                                    id: 'parse',
                                    label: 'Parsing Resume',
                                    description: 'Extracting text and analyzing document structure'
                                },
                                {
                                    id: 'analyze',
                                    label: 'Analyzing Content',
                                    description: 'Comparing your resume with job requirements'
                                },
                                {
                                    id: 'generate',
                                    label: 'Generating Improvements',
                                    description: 'Creating optimized content with AI'
                                },
                                {
                                    id: 'latex',
                                    label: 'Creating LaTeX',
                                    description: 'Formatting your improved resume in professional LaTeX'
                                },
                                {
                                    id: 'complete',
                                    label: 'Complete!',
                                    description: 'Your improved resume is ready'
                                }
                            ]}
                        />
                    </div>
                </div>
            )}

            {/* LaTeX Preview Modal */}
            {analysis.improved_latex && (
                <LaTeXPreviewModal
                    isOpen={showPreviewModal}
                    onClose={() => setShowPreviewModal(false)}
                    latexContent={analysis.improved_latex}
                />
            )}
        </div>
    );
}
