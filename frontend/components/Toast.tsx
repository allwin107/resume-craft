'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose?: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const colors = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-300',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-300',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-300'
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg min-w-[320px] max-w-md ${colors[type]}`}>
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <p className="flex-1 text-sm font-medium">{message}</p>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
