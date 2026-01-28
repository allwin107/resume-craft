'use client';

import { useState } from 'react';
import { X, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import latex from 'react-syntax-highlighter/dist/esm/languages/hljs/latex';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';

SyntaxHighlighter.registerLanguage('latex', latex);

interface LaTeXPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    latexContent: string;
}

export default function LaTeXPreviewModal({ isOpen, onClose, latexContent }: LaTeXPreviewModalProps) {
    const [copied, setCopied] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(latexContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`bg-white rounded-lg shadow-2xl flex flex-col ${isFullscreen ? 'w-full h-full' : 'w-11/12 max-w-4xl h-5/6'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">LaTeX Preview</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="btn-secondary flex items-center gap-2 text-sm"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy All
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 hover:bg-gray-100 rounded"
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-5 h-5" />
                            ) : (
                                <Maximize2 className="w-5 h-5" />
                            )}
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 bg-gray-50">
                    <SyntaxHighlighter
                        language="latex"
                        style={docco}
                        showLineNumbers
                        customStyle={{
                            borderRadius: '0.5rem',
                            padding: '1.5rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                        }}
                    >
                        {latexContent}
                    </SyntaxHighlighter>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">
                        💡 Tip: Copy this code and paste it into Overleaf or your LaTeX editor to compile.
                    </p>
                </div>
            </div>
        </div>
    );
}
