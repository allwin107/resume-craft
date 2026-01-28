'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ExampleResume {
    id: string;
    title: string;
    description: string;
}

export default function ExamplesPage() {
    const router = useRouter();
    const [examples, setExamples] = useState<ExampleResume[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExample, setSelectedExample] = useState<string | null>(null);

    useEffect(() => {
        fetchExamples();
    }, []);

    const fetchExamples = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/examples/resumes`);
            setExamples(response.data);
        } catch (error) {
            console.error('Failed to fetch examples:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTryExample = async (exampleId: string) => {
        setSelectedExample(exampleId);

        // Store the example ID in localStorage for the upload page to use
        localStorage.setItem('selectedExample', exampleId);

        // Navigate to dashboard to start the flow
        router.push('/dashboard?example=true');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-primary-600 text-lg">Loading examples...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-primary-600" />
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Try Example Resumes</h1>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Test our AI-powered resume analysis with pre-loaded examples
                </p>
            </div>

            {/* Examples Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {examples.map((example) => (
                    <div
                        key={example.id}
                        className="card hover:shadow-xl transition-shadow cursor-pointer group"
                        onClick={() => handleTryExample(example.id)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-primary-100 rounded-lg">
                                <FileText className="w-8 h-8 text-primary-600" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{example.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{example.description}</p>
                        <button
                            className="btn-primary w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTryExample(example.id);
                            }}
                        >
                            Try This Example
                        </button>
                    </div>
                ))}
            </div>

            {/* Info Section */}
            <div className="card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-700">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                            1
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Select Example</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Choose from our curated example resumes
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                            2
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Auto-Populate</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Resume and job description automatically loaded
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                            3
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">See Results</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Get instant AI analysis and improvements
                        </p>
                    </div>
                </div>
            </div>

            {/* Back Link */}
            <div className="text-center mt-8">
                <Link href="/dashboard" className="text-primary-600 hover:underline">
                    ← Back to Dashboard
                </Link>
            </div>
        </div >
    );
}
