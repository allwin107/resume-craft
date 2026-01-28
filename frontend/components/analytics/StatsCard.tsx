'use client';

import { TrendingUp, Users, Award, Zap } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatsCard({ title, value, subtitle, icon, trend }: StatCardProps) {
    return (
        <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <TrendingUp className={`w-4 h-4 ${!trend.isPositive && 'rotate-180'}`} />
                            <span>{Math.abs(trend.value)}% {trend.isPositive ? 'increase' : 'decrease'}</span>
                        </div>
                    )}
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );
}
