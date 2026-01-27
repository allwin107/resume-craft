'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { FileText, LogOut, User, History, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse-slow text-primary-600">Loading...</div>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gradient">Resume Analyzer</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                                <LayoutDashboard className="w-5 h-5" />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                            <Link href="/analyze" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                                <FileText className="w-5 h-5" />
                                <span className="font-medium">Analyze</span>
                            </Link>
                            <Link href="/history" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                                <History className="w-5 h-5" />
                                <span className="font-medium">History</span>
                            </Link>
                            <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                                <User className="w-5 h-5" />
                                <span className="font-medium">Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
