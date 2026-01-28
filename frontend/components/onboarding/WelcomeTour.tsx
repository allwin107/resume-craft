'use client';

import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface WelcomeTourProps {
    run: boolean;
    onFinish: () => void;
}

export default function WelcomeTour({ run, onFinish }: WelcomeTourProps) {
    const [steps] = useState<Step[]>([
        {
            target: 'body',
            content: (
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-3">Welcome to ResumeCraft! 🎉</h2>
                    <p className="text-gray-700 mb-2">
                        Let's take a quick tour to help you get started with AI-powered resume analysis and improvement.
                    </p>
                    <p className="text-sm text-gray-600">
                        This will only take a minute!
                    </p>
                </div>
            ),
            placement: 'center',
        },
        {
            target: '[data-tour="upload-resume"]',
            content: (
                <div>
                    <h3 className="font-bold mb-2">Step 1: Upload Your Resume</h3>
                    <p className="text-sm text-gray-700">
                        Upload your resume in PDF or DOCX format. Our AI will extract and analyze the content.
                    </p>
                </div>
            ),
            placement: 'bottom',
        },
        {
            target: '[data-tour="job-description"]',
            content: (
                <div>
                    <h3 className="font-bold mb-2">Step 2: Add Job Description</h3>
                    <p className="text-sm text-gray-700">
                        Paste the job description you're applying for. This helps our AI tailor the analysis and improvements.
                    </p>
                </div>
            ),
            placement: 'bottom',
        },
        {
            target: '[data-tour="analyze-button"]',
            content: (
                <div>
                    <h3 className="font-bold mb-2">Step 3: Analyze</h3>
                    <p className="text-sm text-gray-700">
                        Click here to start the AI analysis. You'll see matching scores, strengths, weaknesses, and suggestions.
                    </p>
                </div>
            ),
            placement: 'top',
        },
        {
            target: '[data-tour="examples"]',
            content: (
                <div>
                    <h3 className="font-bold mb-2">Try Examples First?</h3>
                    <p className="text-sm text-gray-700">
                        Not ready to upload your resume? Try our example resumes to see how the AI works!
                    </p>
                </div>
            ),
            placement: 'bottom',
        },
        {
            target: 'body',
            content: (
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-3">You're All Set! ✨</h2>
                    <p className="text-gray-700 mb-3">
                        After analysis, you can:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 mb-3">
                        <li>• Generate AI-improved resume in LaTeX</li>
                        <li>• Edit in our Monaco editor playground</li>
                        <li>• Download and compile on Overleaf</li>
                    </ul>
                    <p className="text-sm text-gray-600">
                        Ready to create an amazing resume?
                    </p>
                </div>
            ),
            placement: 'center',
        },
    ]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            onFinish();
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#3b82f6',
                    zIndex: 10000,
                },
                buttonNext: {
                    backgroundColor: '#3b82f6',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                },
                buttonBack: {
                    color: '#6b7280',
                },
                buttonSkip: {
                    color: '#6b7280',
                },
            }}
        />
    );
}
