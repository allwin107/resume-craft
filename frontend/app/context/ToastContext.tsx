'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast from '../../components/Toast';

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
        show: boolean;
    }>({ message: '', type: 'info', show: false });

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setToast({ message, type, show: true });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 5000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.show && <Toast message={toast.message} type={toast.type} />}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
