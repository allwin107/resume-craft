'use client';

import { useState } from 'react';
import { X, ArrowLeftRight } from 'lucide-react';

interface Version {
    id: number;
    version_number: number;
    latex_content: string;
    description: string | null;
    created_at: string;
}

interface ComparisonViewProps {
    version1: Version;
    version2: Version;
    onClose: () => void;
}

export default function ComparisonView({ version1, version2, onClose }: ComparisonViewProps) {
    const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

    // Simple diff highlighting - mark changed lines
    const getLineDiff = (content1: string, content2: string) => {
        const lines1 = content1.split('\n');
        const lines2 = content2.split('\n');
        const maxLines = Math.max(lines1.length, lines2.length);

        const diff = [];
        for (let i = 0; i < maxLines; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';

            if (line1 !== line2) {
                diff.push({
                    lineNumber: i + 1,
                    left: line1,
                    right: line2,
                    changed: true
                });
            } else {
                diff.push({
                    lineNumber: i + 1,
                    left: line1,
                    right: line2,
                    changed: false
                });
            }
        }
        return diff;
    };

    const diffLines = getLineDiff(version1.latex_content, version2.latex_content);
    const changedLinesCount = diffLines.filter(d => d.changed).length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Compare Versions
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {changedLinesCount} line{changedLinesCount !== 1 ? 's' : ''} changed
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Version Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                                Version {version1.version_number}
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                                {version1.description || 'No description'}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                                {new Date(version1.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                                Version {version2.version_number}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                                {version2.description || 'No description'}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                                {new Date(version2.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Diff View */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-auto">
                        <div className="grid md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-700">
                            {/* Left Side - Version 1 */}
                            <div className="bg-white dark:bg-gray-800">
                                <div className="sticky top-0 bg-red-100 dark:bg-red-900/30 px-4 py-2 border-b border-red-200 dark:border-red-800">
                                    <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                                        Original (v{version1.version_number})
                                    </p>
                                </div>
                                <div className="font-mono text-sm">
                                    {diffLines.map((line, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${line.changed
                                                    ? 'bg-red-50 dark:bg-red-900/20'
                                                    : 'bg-white dark:bg-gray-800'
                                                }`}
                                        >
                                            <span className="px-4 py-1 text-gray-500 dark:text-gray-500 select-none w-12 flex-shrink-0 text-right">
                                                {line.lineNumber}
                                            </span>
                                            <pre className="px-4 py-1 flex-1 overflow-x-auto text-gray-900 dark:text-gray-100">
                                                {line.left || ' '}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side - Version 2 */}
                            <div className="bg-white dark:bg-gray-800">
                                <div className="sticky top-0 bg-green-100 dark:bg-green-900/30 px-4 py-2 border-b border-green-200 dark:border-green-800">
                                    <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                                        Updated (v{version2.version_number})
                                    </p>
                                </div>
                                <div className="font-mono text-sm">
                                    {diffLines.map((line, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${line.changed
                                                    ? 'bg-green-50 dark:bg-green-900/20'
                                                    : 'bg-white dark:bg-gray-800'
                                                }`}
                                        >
                                            <span className="px-4 py-1 text-gray-500 dark:text-gray-500 select-none w-12 flex-shrink-0 text-right">
                                                {line.lineNumber}
                                            </span>
                                            <pre className="px-4 py-1 flex-1 overflow-x-auto text-gray-900 dark:text-gray-100">
                                                {line.right || ' '}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
