'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Upload, FileText, Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AnalyzePage() {
    const router = useRouter();
    const { token } = useAuth();

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jdText, setJdText] = useState('');
    const [jdTitle, setJdTitle] = useState('');
    const [jdCompany, setJdCompany] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }
            if (!file.name.match(/\.(pdf|docx|doc)$/i)) {
                setError('Only PDF and DOCX files are supported');
                return;
            }
            setResumeFile(file);
            setError('');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }
            if (!file.name.match(/\.(pdf|docx|doc)$/i)) {
                setError('Only PDF and DOCX files are supported');
                return;
            }
            setResumeFile(file);
            setError('');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!resumeFile) {
            setError('Please upload a resume');
            return;
        }

        if (!jdText.trim()) {
            setError('Please enter a job description');
            return;
        }

        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append('resume_file', resumeFile);
            formData.append('jd_text', jdText);
            if (jdTitle) formData.append('jd_title', jdTitle);
            if (jdCompany) formData.append('jd_company', jdCompany);

            const response = await axios.post(`${API_URL}/api/analyze`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            router.push(`/analysis/${response.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to analyze resume. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-gradient">Analyze Your Resume</h1>
                <p className="text-gray-600">Upload your resume and job description to get AI-powered insights</p>
            </div>

            {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3 animate-slide-down">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resume Upload */}
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Upload className="w-6 h-6 text-primary-600" />
                        Upload Resume
                    </h2>

                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-500'
                            }`}
                    >
                        {resumeFile ? (
                            <div className="flex items-center justify-center gap-3">
                                <FileText className="w-8 h-8 text-primary-600" />
                                <div className="text-left">
                                    <p className="font-semibold">{resumeFile.name}</p>
                                    <p className="text-sm text-gray-500">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setResumeFile(null)}
                                    className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-700 font-medium mb-2">
                                    Drag & drop your resume here or{' '}
                                    <label className="text-primary-600 cursor-pointer hover:text-primary-700">
                                        browse
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.docx,.doc"
                                            className="hidden"
                                        />
                                    </label>
                                </p>
                                <p className="text-sm text-gray-500">Supports PDF and DOCX • Max 10MB</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Job Description */}
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary-600" />
                        Job Description
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={jdTitle}
                                    onChange={(e) => setJdTitle(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g. Senior Software Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={jdCompany}
                                    onChange={(e) => setJdCompany(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g. Google"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description *
                            </label>
                            <textarea
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                className="input-field min-h-[300px] resize-y"
                                placeholder="Paste the full job description here including requirements, qualifications, and responsibilities..."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Analyze Button */}
                <button
                    type="submit"
                    disabled={isAnalyzing || !resumeFile || !jdText}
                    className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Analyze Resume
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
