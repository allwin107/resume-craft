'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ScoreDistributionProps {
    distribution: { [key: string]: number };
}

const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6'];

export default function ScoreDistribution({ distribution }: ScoreDistributionProps) {
    // Transform distribution object to array
    const data = Object.entries(distribution).map(([range, count], index) => ({
        range,
        count,
        color: COLORS[index]
    }));

    const totalAnalyses = data.reduce((sum, item) => sum + item.count, 0);

    if (totalAnalyses === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-bold mb-4">Score Distribution</h3>
                <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px'
                        }}
                        formatter={(value: number) => [`${value} analyses`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-5 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="text-center">
                        <div
                            className="w-full h-2 rounded mb-1"
                            style={{ backgroundColor: item.color }}
                        />
                        <p className="text-xs text-gray-600">{item.range}</p>
                        <p className="text-sm font-semibold">{item.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
