'use client';

import { useState } from 'react';
import { X, Command, Save, Code2, Search, Copy, ArrowUp, ArrowDown } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Shortcut {
    keys: string[];
    description: string;
    icon: React.ReactNode;
}

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
    if (!isOpen) return null;

    const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? '⌘' : 'Ctrl';

    const shortcuts: Shortcut[] = [
        { keys: [`${modKey}`, 'S'], description: 'Save content', icon: <Save className="w-4 h-4" /> },
        { keys: [`${modKey}`, 'Shift', 'F'], description: 'Format document', icon: <Code2 className="w-4 h-4" /> },
        { keys: [`${modKey}`, 'F'], description: 'Find', icon: <Search className="w-4 h-4" /> },
        { keys: [`${modKey}`, 'H'], description: 'Find & Replace', icon: <Search className="w-4 h-4" /> },
        { keys: [`${modKey}`, '/'], description: 'Toggle comment', icon: <Code2 className="w-4 h-4" /> },
        { keys: [`${modKey}`, 'D'], description: 'Duplicate line', icon: <Copy className="w-4 h-4" /> },
        { keys: ['Alt', '↑'], description: 'Move line up', icon: <ArrowUp className="w-4 h-4" /> },
        { keys: ['Alt', '↓'], description: 'Move line down', icon: <ArrowDown className="w-4 h-4" /> },
        { keys: [`${modKey}`, 'Z'], description: 'Undo', icon: <Command className="w-4 h-4" /> },
        { keys: [`${modKey}`, 'Shift', 'Z'], description: 'Redo', icon: <Command className="w-4 h-4" /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Command className="w-6 h-6 text-primary-600" />
                        Keyboard Shortcuts
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Shortcuts List */}
                <div className="p-6 max-h-96 overflow-auto">
                    <div className="space-y-3">
                        {shortcuts.map((shortcut, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-600">{shortcut.icon}</div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {shortcut.description}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {shortcut.keys.map((key, idx) => (
                                        <span key={idx} className="flex items-center gap-1">
                                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                                                {key}
                                            </kbd>
                                            {idx < shortcut.keys.length - 1 && (
                                                <span className="text-gray-400">+</span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <p className="text-xs text-gray-600 text-center">
                        Press <kbd className="px-2 py-1 text-xs font-semibold bg-white border border-gray-300 rounded">?</kbd> to toggle this help
                    </p>
                </div>
            </div>
        </div>
    );
}
