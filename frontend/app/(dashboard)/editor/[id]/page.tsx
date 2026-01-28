'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { ArrowLeft, Save, FileCode, Eye, Download, HelpCircle } from 'lucide-react';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';

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
    const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
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

    const handleEditorDidMount = (editor: any, monaco: any) => {
        // Custom keyboard shortcut: Ctrl+S / Cmd+S to save
        editor.addAction({
            id: 'save-content',
            label: 'Save',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
            run: () => {
                handleSave();
            }
        });

        // Custom keyboard shortcut: Ctrl+Shift+F / Cmd+Shift+F to format (placeholder for now)
        editor.addAction({
            id: 'format-document',
            label: 'Format Document',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
            run: () => {
                // Format functionality will be added in next feature
                alert('Format feature coming soon!');
            }
        });

        // Custom keyboard shortcut: ? to show help
        editor.addAction({
            id: 'show-shortcuts-help',
            label: 'Show Keyboard Shortcuts',
            keybindings: [monaco.KeyCode.Slash | monaco.KeyMod.Shift], // Shift+/  = ?
            run: () => {
                setShowShortcutsHelp(true);
            }
        });

        // Prevent default browser save
        editor.onKeyDown((e: any) => {
            if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyS) {
                e.preventDefault();
            }
        });
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
                        onClick={() => setShowShortcutsHelp(true)}
                        className="btn-secondary flex items-center gap-2"
                        title="Keyboard Shortcuts (Shift+?)"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Shortcuts
                    </button>

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

                    <a
                        href="https://www.overleaf.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.5 10l-4 4-1.5-1.5L10.5 11 13 8.5 14.5 10zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                        Compile on Overleaf
                    </a>

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
                            onMount={handleEditorDidMount}
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
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-gray-500 max-w-md">
                                    <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium mb-3">PDF Compilation</p>
                                    <p className="text-sm mb-4">
                                        For the best results, download the .tex file and compile it on{' '}
                                        <a
                                            href="https://www.overleaf.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Overleaf.com
                                        </a>
                                    </p>
                                    <div className="text-xs text-gray-400 space-y-1">
                                        <p>1. Click "Download .tex" above</p>
                                        <p>2. Upload to Overleaf</p>
                                        <p>3. Compile and download PDF</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Keyboard Shortcuts Help */}
            <KeyboardShortcutsHelp
                isOpen={showShortcutsHelp}
                onClose={() => setShowShortcutsHelp(false)}
            />
        </div>
    );
}
