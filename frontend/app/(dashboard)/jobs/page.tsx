'use client';

import { useState } from 'react';
import { Search, Briefcase, MapPin, DollarSign, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface JobPosting {
    id: string;
    title: string;
    company: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    contract_type?: string;
    description: string;
    url: string;
    created: string;
}

export default function JobSearchPage() {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string>('');
    const [page, setPage] = useState(1);

    const handleSearch = async (pageNum: number = 1) => {
        if (!searchQuery.trim()) {
            setError('Please enter a job title or keywords');
            return;
        }

        setIsSearching(true);
        setError('');
        setHasSearched(true);

        try {
            const params: any = {
                query: searchQuery.trim(),
                page: pageNum,
                results_per_page: 20
            };

            if (location.trim()) {
                params.location = location.trim();
            }

            const response = await axios.get(`${API_URL}/api/jobs/search`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            setJobs(response.data.jobs);
            setTotalResults(response.data.total_results);
            setPage(pageNum);
        } catch (err: any) {
            console.error('Job search error:', err);
            if (err.response?.status === 503) {
                setError('Job search service is temporarily unavailable. Please try again later.');
            } else if (err.response?.status === 429) {
                setError('API rate limit exceeded. Please try again in a few minutes.');
            } else {
                setError(err.response?.data?.detail || 'Failed to search jobs. Please try again.');
            }
            setJobs([]);
            setTotalResults(0);
        } finally {
            setIsSearching(false);
        }
    };

    const formatSalary = (min?: number, max?: number) => {
        if (!min && !max) return null;
        if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
        if (min) return `From $${(min / 1000).toFixed(0)}k`;
        if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
        return null;
    };

    const truncateDescription = (desc: string, maxLength: number = 200) => {
        if (desc.length <= maxLength) return desc;
        return desc.substring(0, maxLength) + '...';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Search</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Find relevant job opportunities powered by Adzuna
                </p>
            </div>

            {/* Search Form */}
            <div className="card">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                            Job Title or Keywords *
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                                placeholder="e.g., Software Engineer, Product Manager"
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                            Location (Optional)
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                                placeholder="City or State"
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => handleSearch(1)}
                    disabled={isSearching}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSearching ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Searching...
                        </>
                    ) : (
                        <>
                            <Search className="w-5 h-5" />
                            Search Jobs
                        </>
                    )}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Job Results */}
            {hasSearched && !error && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {totalResults.toLocaleString()} Job{totalResults !== 1 ? 's' : ''} Found
                    </h2>

                    {jobs.length === 0 && !isSearching ? (
                        <div className="card text-center py-12">
                            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">
                                No jobs found. Try different keywords or location.
                            </p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="card hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                            {job.title}
                                        </h3>
                                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
                                            {job.company}
                                        </p>

                                        <div className="flex flex-wrap gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{job.location}</span>
                                            </div>
                                            {formatSalary(job.salary_min, job.salary_max) && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="text-sm">{formatSalary(job.salary_min, job.salary_max)}</span>
                                                </div>
                                            )}
                                            {job.contract_type && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <Briefcase className="w-4 h-4" />
                                                    <span className="text-sm capitalize">{job.contract_type}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{new Date(job.created).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {truncateDescription(job.description.replace(/<[^>]*>/g, ''))}
                                        </p>
                                    </div>

                                    <a
                                        href={job.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                                    >
                                        View Job
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Pagination */}
                    {totalResults > 20 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button
                                onClick={() => handleSearch(page - 1)}
                                disabled={page === 1 || isSearching}
                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="flex items-center px-4 text-gray-700 dark:text-gray-300">
                                Page {page} of {Math.ceil(totalResults / 20)}
                            </span>
                            <button
                                onClick={() => handleSearch(page + 1)}
                                disabled={page >= Math.ceil(totalResults / 20) || isSearching}
                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Info Section */}
            {!hasSearched && (
                <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        💡 How to Use Job Search
                    </h3>
                    <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1 list-disc list-inside">
                        <li>Enter job title or keywords (required)</li>
                        <li>Optionally add a location to filter results</li>
                        <li>Click "Search Jobs" or press Enter</li>
                        <li>Results are powered by Adzuna's real-time job database</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
