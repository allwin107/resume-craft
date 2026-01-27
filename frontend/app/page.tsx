'use client';

import Link from 'next/link';
import { FileText, Sparkles, ArrowRight, CheckCircle, Target, TrendingUp } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gradient">Resume Analyzer</span>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className="btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-6 animate-slide-down">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">AI-Powered Resume Analysis</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Match Your Resume to <br />
                        <span className="text-gradient">Your Dream Job</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
                        Get instant AI-powered analysis comparing your resume against job descriptions.
                        Discover match scores, missing skills, and personalized improvements.
                    </p>

                    <div className="flex gap-4 justify-center animate-slide-up">
                        <Link href="/register" className="btn-primary flex items-center gap-2 text-lg">
                            Start Analyzing
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/login" className="btn-secondary text-lg">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card group hover:border-primary-500">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                                <Target className="w-6 h-6 text-primary-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Match Score Analysis</h3>
                            <p className="text-gray-600">
                                Get a precise 0-100 match score showing how well your resume aligns with the job requirements.
                            </p>
                        </div>

                        <div className="card group hover:border-primary-500">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                                <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Skills Gap Detection</h3>
                            <p className="text-gray-600">
                                Identify matched skills and discover which critical skills you're missing for the position.
                            </p>
                        </div>

                        <div className="card group hover:border-primary-500">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                                <TrendingUp className="w-6 h-6 text-purple-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Improvements</h3>
                            <p className="text-gray-600">
                                Get actionable suggestions and AI-generated resume improvements in professional LaTeX format.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'Upload Resume', desc: 'Upload your resume in PDF or DOCX format' },
                            { step: '2', title: 'Add Job Description', desc: 'Paste the job description you\'re targeting' },
                            { step: '3', title: 'AI Analysis', desc: 'Our AI analyzes and compares both documents' },
                            { step: '4', title: 'Get Insights', desc: 'View detailed insights and improvements' },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                                    {item.step}
                                </div>
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-primary-500">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Ready to Improve Your Resume?</h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Join thousands of job seekers landing their dream jobs
                    </p>
                    <Link href="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <p>&copy; 2026 Resume Analyzer. Powered by AI.</p>
                </div>
            </footer>
        </div>
    );
}
