'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrendDataPoint {
    date: string;
    count: number;
    avg_score: number;
}

interface TrendsChartProps {
    data: TrendDataPoint[];
    type?: 'line' | 'bar';
}

export default function TrendsChart({ data, type = 'line' }: TrendsChartProps) {
    if (data.length === 0) {
        return (
            <div className="card">
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium mb-2">No Data Yet</p>
                    <p className="text-sm">Start analyzing resumes to see trends</p>
                </div>
            </div>
        );
    }

    // Format data for display
    const formattedData = data.map(point => ({
        ...point,
        date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">Analysis Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
                {type === 'line' ? (
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Analyses"
                            dot={{ fill: '#3b82f6', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="avg_score"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Avg Score"
                            dot={{ fill: '#10b981', r: 4 }}
                        />
                    </LineChart>
                ) : (
                    <BarChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" name="Analyses" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="avg_score" fill="#10b981" name="Avg Score" radius={[8, 8, 0, 0]} />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
