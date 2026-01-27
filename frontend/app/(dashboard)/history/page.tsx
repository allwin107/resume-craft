'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import { TrendingUp, Calendar, FileText, Search } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function HistoryPage() {
    const { token } = useAuth();
    const [analyses, setAnalyses] = useState([]);
    const [filteredAnalyses, setFilteredAnalyses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (token) {
            fetchHistory();
        }
    }, [token]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = analyses.filter((analysis: any) =>
                analysis.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                analysis.resume_filename.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAnalyses(filtered);
        } else {
            setFilteredAnalyses(analyses);
        }
    }, [searchTerm, analyses]);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/profile/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalyses(response.data.history);
            setFilteredAnalyses(response.data.history);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gradient">Analysis History</h1>
                <Link href="/analyze" className="btn-primary">
                    New Analysis
                </Link>
            </div>

            {/* Search */}
            <div className="card">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-11"
                        placeholder="Search by job title or resume filename..."
                    />
                </div>
            </div>

            {/* History List */}
            {isLoading ? (
                <div className="card text-center py-12">
                    <div className="animate-pulse-slow text-primary-600">Loading...</div>
                </div>
            ) : filteredAnalyses.length > 0 ? (
                <div className="space-y-4">
                    {filteredAnalyses.map((analysis: any) => (
                        <Link
                            key={analysis.id}
                            href={`/analysis/${analysis.id}`}
                            className="card hover:border-primary-500 hover:shadow-xl transition-all block"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="w-5 h-5 text-primary-600" />
                                        <h3 className="text-xl font-bold">{analysis.job_title}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">{analysis.resume_filename}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp className={`w-6 h-6 ${analysis.match_score >= 70 ? 'text-green-500' :
                                            analysis.match_score >= 50 ? 'text-yellow-500' :
                                                'text-red-500'
                                            }`} />
                                        <span className="text-3xl font-bold">{Math.round(analysis.match_score)}%</span>
                                    </div>
                                    <span className={`text-sm px-3 py-1 rounded-full ${analysis.match_score >= 70 ? 'bg-green-100 text-green-800' :
                                        analysis.match_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {analysis.match_score >= 70 ? 'Excellent' :
                                            analysis.match_score >= 50 ? 'Good' : 'Needs Work'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                        {searchTerm ? 'No results found' : 'No analyses yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm ? 'Try a different search term' : 'Start analyzing your resume to see results here'}
                    </p>
                    {!searchTerm && (
                        <Link href="/analyze" className="btn-primary inline-block">
                            Create Your First Analysis
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
