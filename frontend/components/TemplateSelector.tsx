'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Check } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Template {
    id: string;
    name: string;
    description: string;
}

interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (templateContent: string) => void;
}

export default function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen]);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/editor/templates`);
            setTemplates(response.data.templates);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        }
    };

    const handleSelectTemplate = async (templateId: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/editor/templates/${templateId}`);
            onSelectTemplate(response.data.content);
            onClose();
        } catch (error) {
            console.error('Failed to load template:', error);
            alert('Failed to load template. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary-600" />
                        Choose a Template
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Templates Grid */}
                <div className="p-6 overflow-auto flex-1">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                onDoubleClick={() => handleSelectTemplate(template.id)}
                                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedTemplate === template.id
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                                    }`}
                            >
                                {selectedTemplate === template.id && (
                                    <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <FileText className="w-10 h-10 text-primary-600 mb-2" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                                <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                        ))}
                    </div>

                    {templates.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No templates available</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {selectedTemplate ? 'Double-click or press "Apply" to use template' : 'Select a template to get started'}
                    </p>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button
                            onClick={() => selectedTemplate && handleSelectTemplate(selectedTemplate)}
                            disabled={!selectedTemplate || loading}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Apply Template'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
