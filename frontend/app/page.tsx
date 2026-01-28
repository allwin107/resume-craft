'use client';

import Link from 'next/link';
import { FileText, Zap, Target, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
    const features = [
        {
            icon: Zap,
            title: 'AI-Powered Analysis',
            description: 'Advanced AI analyzes your resume and provides intelligent recommendations for improvement.'
        },
        {
            icon: Target,
            title: 'Job Match Scoring',
            description: 'Get instant match scores between your resume and job descriptions to know where you stand.'
        },
        {
            icon: FileText,
            title: 'LaTeX Resume Generation',
            description: 'Create professional, ATS-friendly resumes with our built-in LaTeX editor and templates.'
        },
        {
            icon: TrendingUp,
            title: 'Track Progress',
            description: 'Save multiple resume versions and compare improvements over time with our analytics dashboard.'
        }
    ];

    const steps = [
        { number: '1', title: 'Upload Resume', description: 'Upload your PDF or DOCX resume file' },
        { number: '2', title: 'Add Job Description', description: 'Paste the job description you\'re targeting' },
        { number: '3', title: 'Get AI Insights', description: 'Receive detailed analysis and improvement suggestions' },
        { number: '4', title: 'Generate Improved Version', description: 'Download your optimized, ATS-friendly resume' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gradient">Resume Analyzer</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/docs" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                Docs
                            </Link>
                            <Link href="/faq" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                FAQ
                            </Link>
                            <Link href="/login" className="btn-secondary">
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
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
                        Craft the Perfect Resume with{' '}
                        <span className="text-gradient">AI-Powered Insights</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        Optimize your resume for any job posting. Get instant feedback, match scores,
                        and AI-generated improvements to land more interviews.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/register" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/docs" className="btn-secondary text-lg px-8 py-3">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Powerful Features
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="card hover:shadow-xl transition-shadow text-center"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-400 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Why Choose Resume Analyzer?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-left mt-12">
                        {[
                            'Increase interview callbacks by 40%',
                            'ATS-optimized resume formats',
                            'Save hours of manual editing',
                            'Track improvements over time',
                            'Dark mode for comfortable viewing',
                            'Secure data encryption'
                        ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                <span className="text-lg">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Join thousands of job seekers who have improved their resumes with AI
                    </p>
                    <Link href="/register" className="btn-primary text-xl px-12 py-4 inline-flex items-center gap-2">
                        Get Started for Free
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            © 2026 Resume Analyzer. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/docs" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                Documentation
                            </Link>
                            <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                FAQ
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
