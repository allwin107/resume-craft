'use client';

import { useState } from 'react';
import { Save, X, FileText } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Version {
    id: number;
    version_number: number;
    latex_content: string;
    description: string | null;
    created_at: string;
}

interface VersionManagerProps {
    analysisId: string;
    currentContent: string;
    versions: Version[];
    onVersionCreated: () => void;
    onVersionSelected: (version: Version) => void;
    token: string;
}

export default function VersionManager({
    analysisId,
    currentContent,
    versions,
    onVersionCreated,
    onVersionSelected,
    token
}: VersionManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveAsVersion = async () => {
        if (!description.trim()) {
            alert('Please enter a description for this version');
            return;
        }

        setIsSaving(true);
        try {
            await axios.post(
                `${API_URL}/api/versions/${analysisId}`,
                {
                    latex_content: currentContent,
                    description: description.trim()
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setDescription('');
            setIsCreating(false);
            onVersionCreated();
        } catch (error) {
            console.error('Failed to save version:', error);
            alert('Failed to save version');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Resume Versions</h3>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="btn-secondary text-sm py-2 px-4"
                >
                    {isCreating ? 'Cancel' : '+ New Version'}
                </button>
            </div>

            {/* Create Version Form */}
            {isCreating && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                        Version Description
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="E.g., Added more technical skills"
                        className="input-field mb-3"
                        maxLength={500}
                    />
                    <button
                        onClick={handleSaveAsVersion}
                        disabled={isSaving || !description.trim()}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save as New Version'}
                    </button>
                </div>
            )}

            {/* Versions List */}
            <div className="space-y-2">
                {versions.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                        No saved versions yet. Create your first version!
                    </p>
                ) : (
                    versions.map((version) => (
                        <div
                            key={version.id}
                            onClick={() => onVersionSelected(version)}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 cursor-pointer transition-colors bg-white dark:bg-gray-800"
                        >
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        Version {version.version_number}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                        {version.description || 'No description'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(version.created_at).toLocaleDateString()} at{' '}
                                        {new Date(version.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
