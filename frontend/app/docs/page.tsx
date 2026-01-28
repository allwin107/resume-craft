import Link from 'next/link';
import { FileText, ArrowLeft, Book, HelpCircle, Search } from 'lucide-react';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Documentation</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Learn how to use Resume Analyzer to improve your resume
                    </p>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <nav className="sticky top-4 space-y-2">
                            <a href="#getting-started" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                                Getting Started
                            </a>
                            <a href="#uploading" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                                Uploading Resumes
                            </a>
                            <a href="#analysis" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                                Understanding Analysis
                            </a>
                            <a href="#latex-editor" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                                LaTeX Editor
                            </a>
                            <a href="#versions" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                                Resume Versions
                            </a>
                            <a href="#best-practices" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                                Best Practices
                            </a>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-12">
                        {/* Getting Started */}
                        <section id="getting-started" className="card">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Getting Started</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300">
                                    Welcome to Resume Analyzer! Follow these steps to get started:
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>Create an account or log in</li>
                                    <li>Navigate to the "Analyze" page from the dashboard</li>
                                    <li>Upload your resume (PDF or DOCX)</li>
                                    <li>Paste the job description you're applying for</li>
                                    <li>Click "Analyze" to get AI-powered insights</li>
                                </ol>
                            </div>
                        </section>

                        {/* Uploading */}
                        <section id="uploading" className="card">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Uploading Resumes</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Resume Analyzer supports multiple file formats:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    <li><strong>PDF</strong> - Most common format, fully supported</li>
                                    <li><strong>DOCX</strong> - Microsoft Word documents</li>
                                </ul>
                                <p className="text-gray-600 dark:text-gray-300 mt-4">
                                    <strong>File Size Limit:</strong> Maximum 10MB per file
                                </p>
                            </div>
                        </section>

                        {/* Analysis */}
                        <section id="analysis" className="card">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Understanding Analysis Results</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    After analysis, you'll see:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    <li><strong>Match Score (0-100):</strong> Overall compatibility with the job</li>
                                    <li><strong>Matched Skills:</strong> Skills from your resume that match the job</li>
                                    <li><strong>Missing Skills:</strong> Critical skills you should add</li>
                                    <li><strong>Improvements:</strong> AI-generated suggestions to enhance your resume</li>
                                    <li><strong>Improved LaTeX:</strong> An optimized version of your resume</li>
                                </ul>
                            </div>
                        </section>

                        {/* LaTeX Editor */}
                        <section id="latex-editor" className="card">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">LaTeX Editor</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Our built-in LaTeX editor allows you to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>Edit AI-generated resume improvements</li>
                                    <li>See live preview of your formatted resume</li>
                                    <li>Download as PDF with one click</li>
                                    <li>Save multiple versions for different applications</li>
                                </ul>
                                <p className="text-gray-600 dark:text-gray-300 mt-4">
                                    <strong>Tip:</strong> Use the example templates to get started quickly!
                                </p>
                            </div>
                        </section>

                        {/* Versions */}
                        <section id="versions" className="card">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Resume Versions</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Save and manage multiple resume versions:
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>In the editor, click "Save as Version"</li>
                                    <li>Add a description (e.g., "Software Engineer - Google")</li>
                                    <li>Access all versions from the "Compare" page</li>
                                    <li>View side-by-side diffs to track improvements</li>
                                </ol>
                            </div>
                        </section>

                        {/* Best Practices */}
                        <section id="best-practices" className="card">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Best Practices</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">For Better Results:</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>Copy the complete job description including requirements</li>
                                    <li>Use clear, well-formatted resumes for better text extraction</li>
                                    <li>Review and customize AI suggestions before using them</li>
                                    <li>Save versions as you iterate to track your progress</li>
                                    <li>Use keywords from the job description naturally in your resume</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">Common Pitfalls to Avoid:</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>Don't just copy-paste AI improvements without reviewing</li>
                                    <li>Avoid keyword stuffing - keep it natural</li>
                                    <li>Don't use a generic resume for multiple different roles</li>
                                    <li>Remember to proofread after making changes</li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
