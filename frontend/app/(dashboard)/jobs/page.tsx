'use client';

import { useState } from 'react';
import { Search, Briefcase, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';

interface JobPosting {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    type: string;
    posted: string;
    description: string;
    url: string;
}

export default function JobSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            alert('Please enter a job title or keywords');
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        // Simulate API call - In production, integrate with real job APIs like:
        // - Indeed API
        // - LinkedIn Jobs API
        // - Adzuna API
        // - The Muse API
        setTimeout(() => {
            // Mock job data
            const mockJobs: JobPosting[] = [
                {
                    id: '1',
                    title: 'Senior Software Engineer',
                    company: 'Tech Corp',
                    location: 'San Francisco, CA',
                    salary: '$120k - $180k',
                    type: 'Full-time',
                    posted: '2 days ago',
                    description: 'We are looking for an experienced software engineer to join our team...',
                    url: 'https://example.com/job/1'
                },
                {
                    id: '2',
                    title: 'Full Stack Developer',
                    company: 'Startup Inc',
                    location: 'Remote',
                    salary: '$90k - $140k',
                    type: 'Full-time',
                    posted: '1 week ago',
                    description: 'Join our fast-growing startup as a full stack developer...',
                    url: 'https://example.com/job/2'
                },
                {
                    id: '3',
                    title: 'Frontend Engineer',
                    company: 'Digital Agency',
                    location: 'New York, NY',
                    salary: '$100k - $150k',
                    type: 'Full-time',
                    posted: '3 days ago',
                    description: 'Looking for a talented frontend engineer with React experience...',
                    url: 'https://example.com/job/3'
                }
            ].filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setJobs(mockJobs);
            setIsSearching(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Search</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Find relevant job opportunities based on your resume
                </p>
            </div>

            {/* Search Form */}
            <div className="card">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                            Job Title or Keywords
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="e.g., Software Engineer, Product Manager"
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="City, State or Remote"
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Search className="w-5 h-5" />
                    {isSearching ? 'Searching...' : 'Search Jobs'}
                </button>
            </div>

            {/* Job Results */}
            {hasSearched && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {jobs.length} Job{jobs.length !== 1 ? 's' : ''} Found
                    </h2>

                    {jobs.length === 0 ? (
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
                                            {job.salary && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="text-sm">{job.salary}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Briefcase className="w-4 h-4" />
                                                <span className="text-sm">{job.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{job.posted}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                            {job.description}
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
                </div>
            )}

            {/* Info Section */}
            {!hasSearched && (
                <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        💡 Pro Tip
                    </h3>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                        Use keywords from your resume to find the most relevant job opportunities.
                        Our AI-powered analysis helps you match your skills with job requirements.
                    </p>
                </div>
            )}
        </div>
    );
}
