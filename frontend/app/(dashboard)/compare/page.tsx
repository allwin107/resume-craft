'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, GitCompare } from 'lucide-react';
import Link from 'next/link';
import ComparisonView from '@/components/comparison/ComparisonView';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Version {
    id: number;
    version_number: number;
    latex_content: string;
    description: string | null;
    created_at: string;
}

export default function ComparePage() {
    const { token } = useAuth();
    const router = useRouter();
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');
    const [versions, setVersions] = useState<Version[]>([]);
    const [version1, setVersion1] = useState<string>('');
    const [version2, setVersion2] = useState<string>('');
    const [isComparing, setIsComparing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchAnalyses();
        }
    }, [token]);

    useEffect(() => {
        if (selectedAnalysis && token) {
            fetchVersions(selectedAnalysis);
        }
    }, [selectedAnalysis, token]);

    const fetchAnalyses = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/profile/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalyses(response.data.history);
        } catch (error) {
            console.error('Error fetching analyses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchVersions = async (analysisId: string) => {
        try {
            const response = await axios.get(`${API_URL}/api/versions/${analysisId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVersions(response.data);
        } catch (error) {
            console.error('Error fetching versions:', error);
            setVersions([]);
        }
    };

    const handleCompare = () => {
        if (version1 && version2 && version1 !== version2) {
            setIsComparing(true);
        }
    };

    const getVersionById = (id: string): Version | undefined => {
        return versions.find(v => v.id.toString() === id);
    };

    const selectedVersion1 = version1 ? getVersionById(version1) : undefined;
    const selectedVersion2 = version2 ? getVersionById(version2) : undefined;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="btn-secondary">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Compare Versions</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Compare different resume versions side-by-side
                    </p>
                </div>
            </div>

            <div className="card">
                <div className="space-y-6">
                    {/* Select Analysis */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                            Select Analysis
                        </label>
                        <select
                            value={selectedAnalysis}
                            onChange={(e) => {
                                setSelectedAnalysis(e.target.value);
                                setVersion1('');
                                setVersion2('');
                            }}
                            className="input-field"
                        >
                            <option value="">Choose an analysis...</option>
                            {analyses.map((analysis) => (
                                <option key={analysis.id} value={analysis.id}>
                                    Analysis #{analysis.id} - {new Date(analysis.created_at).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedAnalysis && versions.length > 0 && (
                        <>
                            {/* Select Versions */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                                        Version 1 (Original)
                                    </label>
                                    <select
                                        value={version1}
                                        onChange={(e) => setVersion1(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="">Select version...</option>
                                        {versions.map((version) => (
                                            <option key={version.id} value={version.id}>
                                                Version {version.version_number} - {version.description || 'No description'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                                        Version 2 (Updated)
                                    </label>
                                    <select
                                        value={version2}
                                        onChange={(e) => setVersion2(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="">Select version...</option>
                                        {versions.map((version) => (
                                            <option key={version.id} value={version.id}>
                                                Version {version.version_number} - {version.description || 'No description'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Compare Button */}
                            <button
                                onClick={handleCompare}
                                disabled={!version1 || !version2 || version1 === version2}
                                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <GitCompare className="w-5 h-5" />
                                Compare Versions
                            </button>
                        </>
                    )}

                    {selectedAnalysis && versions.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                No versions found for this analysis. Create some versions first!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Comparison Modal */}
            {isComparing && selectedVersion1 && selectedVersion2 && (
                <ComparisonView
                    version1={selectedVersion1}
                    version2={selectedVersion2}
                    onClose={() => setIsComparing(false)}
                />
            )}
        </div>
    );
}
