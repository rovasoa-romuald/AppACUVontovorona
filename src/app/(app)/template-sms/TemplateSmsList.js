'use client';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

export default function TemplateSmsList({
    selectedTemplate,
    handleSelectTemplate,
}) {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch templates on component mount
    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/sms-templates');
            if (response.status !== 200)
                throw new Error('Failed to fetch templates');
            const data = response.data;
            setTemplates(data);
            setError(null);
        } catch (err) {
            setError('Failed to load templates. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h3 className="mb-4 text-lg font-semibold">SMS Templates</h3>
            {isLoading ? (
                <div className="py-10 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-solid rounded-full animate-spin border-r-transparent" />
                    <p className="mt-2">Loading SMS templates...</p>
                </div>
            ) : error ? (
                <div className="flex items-center gap-2 p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            ) : (
                <div className="flex flex-col overflow-y-auto">
                    {templates.map(template => (
                        <div
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className={`px-3 py-2 rounded-md cursor-pointer ${selectedTemplate && selectedTemplate.id === template.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                            <h3 className="text-sm font-medium truncate">
                                {template.subject}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                                {template.content}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {template.tags &&
                                    template.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
