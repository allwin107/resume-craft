'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { ArrowLeft, Save, FileCode, Eye, Download } from 'lucide-react';

// Dynamically import Monaco Editor (client-side only)
const Editor = dynamic(
    () => import('@monaco-editor/react'),
    { ssr: false, loading: () => <div className="flex items-center justify-center h-full">Loading editor...</div> }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LatexEditorPage() {
    const params = useParams();
    const router = useRouter();
    const [latexContent, setLatexContent] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [error, setError] = useState('');
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchLatexContent();
    }, [params.id]);

    const fetchLatexContent = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/api/editor/${params.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLatexContent(response.data.latex_content);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load LaTeX content');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/api/editor/${params.id}/save`,
                { latex_content: latexContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSaveMessage('✓ Saved successfully');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCompile = async () => {
        setIsCompiling(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/editor/${params.id}/compile`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setPdfUrl(response.data.pdf_url);
                setShowPreview(true);
            } else {
                setError(response.data.error || 'Compilation failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to compile PDF');
        } finally {
            setIsCompiling(false);
        }
    };

    const handleDownloadLatex = () => {
        const blob = new Blob([latexContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume_${params.id}.tex`;
        link.click();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push(`/analysis/${params.id}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Analysis
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">LaTeX Editor</h1>
                </div>

                <div className="flex items-center gap-3">
                    {saveMessage && (
                        <span className="text-green-600 text-sm font-medium">{saveMessage}</span>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>

                    <button
                        onClick={handleDownloadLatex}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download .tex
                    </button>

                    <button
                        onClick={handleCompile}
                        disabled={isCompiling}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isCompiling ? 'Compiling...' : 'Compile PDF'}
                    </button>

                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Hide' : 'Show'} Preview
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 px-6 py-3">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* LaTeX Editor */}
                <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-200 bg-white`}>
                    <div className="h-full">
                        <Editor
                            height="100%"
                            defaultLanguage="latex"
                            value={latexContent}
                            onChange={(value) => setLatexContent(value || '')}
                            theme="vs-light"
                            options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on',
                            }}
                        />
                    </div>
                </div>

                {/* PDF Preview */}
                {showPreview && (
                    <div className="w-1/2 bg-gray-100 flex flex-col">
                        <div className="bg-white border-b border-gray-200 px-4 py-3">
                            <h3 className="font-semibold text-gray-900">PDF Preview</h3>
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            {pdfUrl ? (
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-full border border-gray-300 rounded-lg bg-white"
                                    title="PDF Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center text-gray-500">
                                        <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium mb-2">No PDF Preview</p>
                                        <p className="text-sm">Click "Compile PDF" to generate preview</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
