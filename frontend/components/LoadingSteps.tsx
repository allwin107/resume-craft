'use client';

import { CheckCircle, Loader2 } from 'lucide-react';

interface ProgressStep {
    id: string;
    label: string;
    description: string;
}

interface LoadingStepsProps {
    currentStep: number;
    steps: ProgressStep[];
}

export default function LoadingSteps({ currentStep, steps }: LoadingStepsProps) {
    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div
                            key={step.id}
                            className={`flex items-start gap-4 p-4 rounded-lg transition-all ${isCurrent
                                    ? 'bg-blue-50 border-2 border-blue-500'
                                    : isCompleted
                                        ? 'bg-green-50 border border-green-300'
                                        : 'bg-gray-50 border border-gray-200'
                                }`}
                        >
                            <div className="flex-shrink-0 mt-1">
                                {isCompleted ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : isCurrent ? (
                                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">{index + 1}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3
                                    className={`font-semibold ${isCurrent
                                            ? 'text-blue-900'
                                            : isCompleted
                                                ? 'text-green-900'
                                                : 'text-gray-500'
                                        }`}
                                >
                                    {step.label}
                                </h3>
                                <p
                                    className={`text-sm mt-1 ${isCurrent
                                            ? 'text-blue-700'
                                            : isCompleted
                                                ? 'text-green-700'
                                                : 'text-gray-400'
                                        }`}
                                >
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
