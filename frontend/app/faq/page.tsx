'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: 'How does the AI analysis work?',
            answer: 'Our AI uses advanced natural language processing to compare your resume against job descriptions. It analyzes skills, keywords, experience, and qualifications to provide a comprehensive match score and personalized recommendations.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes! We take security seriously. All files are encrypted during transmission and storage. We never share your personal information or resumes with third parties. You can delete your data at any time from your profile settings.'
        },
        {
            question: 'What file formats are supported?',
            answer: 'We currently support PDF and DOCX (Microsoft Word)  formats. The maximum file size is 10MB. For best results, use cleanly formatted documents with standard fonts.'
        },
        {
            question: 'How do I improve my match score?',
            answer: 'Focus on the missing skills and keywords identified in the analysis. Incorporate relevant experience and qualifications from the job description into your resume. Use our AI-generated improvements as a starting point, then customize them to match your actual experience.'
        },
        {
            question: 'Can I download my improved resume?',
            answer: 'Yes! After the AI generates improvements, you can edit them in our LaTeX editor and download the final resume as a PDF. You can also save multiple versions for different job applications.'
        },
        {
            question: 'What is the LaTeX editor?',
            answer: 'LaTeX is a professional document formatting system widely used in academia and tech. Our editor lets you create ATS-friendly, beautifully formatted resumes. Don\'t worry if you\'re not familiar with LaTeX - the AI generates the code for you, and you can see a live preview.'
        },
        {
            question: 'How many resumes can I analyze?',
            answer: 'There are no limits! You can analyze as many resumes and job descriptions as you need. We encourage you to iterate and improve your resume for each specific job application.'
        },
        {
            question: 'Can I compare different resume versions?',
            answer: 'Yes! Save different versions of your resume and use the "Compare" feature to see side-by-side differences. This helps you track improvements and choose the best version for each application.'
        },
        {
            question: 'Does Resume Analyzer work for all industries?',
            answer: 'Yes! Our AI is trained on diverse industries and job roles. Whether you\'re in tech, healthcare, finance, marketing, or any other field, the analysis will provide relevant insights tailored to your target position.'
        },
        {
            question: 'What makes a resume ATS-friendly?',
            answer: 'ATS (Applicant Tracking Systems) scan resumes for keywords and structure. ATS-friendly resumes use standard formatting, clear section headings, relevant keywords, and avoid complex graphics. Our LaTeX templates are designed to be ATS-compatible.'
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Find answers to common questions about Resume Analyzer
                    </p>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="card hover:shadow-lg transition-shadow"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center text-left"
                            >
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-8">
                                    {faq.question}
                                </h3>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 card bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Still have questions?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We're here to help! Feel free to reach out through our feedback system.
                    </p>
                    <Link href="/dashboard" className="btn-primary inline-block">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
