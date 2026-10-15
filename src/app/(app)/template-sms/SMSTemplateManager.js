'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Copy,
    Save,
    AlertCircle,
} from 'lucide-react';
import axios from '@/lib/axios';

export default function SMSTemplateManager() {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTemplate, setEditedTemplate] = useState({
        subject: '',
        content: '',
        tags: [],
    });
    const [newTagInput, setNewTagInput] = useState('');
    const [notification, setNotification] = useState(null);

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

    const handleCreateTemplate = async () => {
        try {
            const response = await axios.post(
                '/api/sms-template',
                editedTemplate,
            );

            if (response.status !== 201)
                throw new Error('Failed to create template');

            const newTemplate = response.data;
            setTemplates([...templates, newTemplate]);
            setSelectedTemplate(newTemplate);
            setIsEditing(false);
            showNotification('Template created successfully');
        } catch (err) {
            setError('Failed to create template. Please try again.');
            console.error(err);
        }
    };

    const handleUpdateTemplate = async () => {
        try {
            const response = await axios.put(
                `/api/sms-template/${editedTemplate.id}`,
                editedTemplate,
            );

            if (response.status !== 200)
                throw new Error('Failed to update template');

            const updatedTemplate = response.data;
            setTemplates(
                templates.map(t =>
                    t.id === updatedTemplate.id ? updatedTemplate : t,
                ),
            );
            setSelectedTemplate(updatedTemplate);
            setIsEditing(false);
            showNotification('Template updated successfully');
        } catch (err) {
            setError('Failed to update template. Please try again.');
            console.error(err);
        }
    };

    const handleDeleteTemplate = async id => {
        try {
            const response = await axios.delete(`/api/sms-template/${id}`);

            if (response.status !== 200)
                throw new Error('Failed to delete template');

            setTemplates(templates.filter(t => t.id !== id));
            if (selectedTemplate && selectedTemplate.id === id) {
                setSelectedTemplate(null);
                setIsEditing(false);
            }
            showNotification('Template deleted successfully');
        } catch (err) {
            setError('Failed to delete template. Please try again.');
            console.error(err);
        }
    };

    const handleSaveTemplate = () => {
        if (
            editedTemplate.id &&
            templates.some(t => t.id === editedTemplate.id)
        ) {
            handleUpdateTemplate();
        } else {
            handleCreateTemplate();
        }
    };

    const handleSelectTemplate = template => {
        setSelectedTemplate(template);
        setIsEditing(false);
    };

    const handleEditTemplate = () => {
        setEditedTemplate({
            ...selectedTemplate,
            tags: selectedTemplate.tags ? [...selectedTemplate.tags] : [],
        });
        setIsEditing(true);
    };

    const handleCreateNew = () => {
        setSelectedTemplate(null);
        setEditedTemplate({ subject: '', content: '', tags: [] });
        setIsEditing(true);
    };

    const handleAddTag = () => {
        if (
            newTagInput.trim() !== '' &&
            !editedTemplate.tags.includes(newTagInput.trim())
        ) {
            setEditedTemplate({
                ...editedTemplate,
                tags: [...editedTemplate.tags, newTagInput.trim()],
            });
            setNewTagInput('');
        }
    };

    const handleRemoveTag = tagToRemove => {
        setEditedTemplate({
            ...editedTemplate,
            tags: editedTemplate.tags.filter(tag => tag !== tagToRemove),
        });
    };

    const handleCopyToClipboard = async text => {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Template copied to clipboard');
        } catch (err) {
            setError('Failed to copy to clipboard');
            console.error(err);
        }
    };

    const showNotification = message => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredTemplates = templates.filter(
        template =>
            template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (template.tags &&
                template.tags.some(tag =>
                    tag.toLowerCase().includes(searchTerm.toLowerCase()),
                )),
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        SMS Template Manager
                    </h1>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
                        <Plus size={20} /> New Template
                    </button>
                </div>
            </div>

            {notification && (
                <div className="fixed z-50 p-4 text-green-700 bg-green-100 border-l-4 border-green-500 rounded shadow-md top-4 right-4">
                    {notification}
                </div>
            )}

            <div className="flex flex-grow">
                {/* Sidebar */}
                <div className="w-64 overflow-y-auto bg-white border-r shadow-sm">
                    <div className="p-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search
                                className="absolute left-3 top-2.5 text-gray-400"
                                size={20}
                            />
                        </div>
                    </div>

                    <div className="px-4 py-2">
                        <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Templates
                        </h2>
                        {isLoading ? (
                            <div className="py-4 text-center text-gray-500">
                                Loading templates...
                            </div>
                        ) : error ? (
                            <div className="py-4 text-center text-red-500">
                                {error}
                            </div>
                        ) : filteredTemplates.length === 0 ? (
                            <div className="py-4 text-center text-gray-500">
                                No templates found
                            </div>
                        ) : (
                            <div className="mt-2 space-y-1">
                                {filteredTemplates.map(template => (
                                    <div
                                        key={template.id}
                                        onClick={() =>
                                            handleSelectTemplate(template)
                                        }
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
                </div>

                {/* Main Content */}
                <div className="flex-grow p-6 overflow-y-auto">
                    {error && !isLoading && (
                        <div className="flex items-center gap-2 p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {!selectedTemplate && !isEditing ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <p className="mb-4">
                                Select a template or create a new one
                            </p>
                            <button
                                onClick={handleCreateNew}
                                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
                                <Plus size={20} /> Create Template
                            </button>
                        </div>
                    ) : isEditing ? (
                        <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow">
                            <h2 className="mb-6 text-xl font-bold">
                                {editedTemplate.id
                                    ? 'Edit Template'
                                    : 'Create New Template'}
                            </h2>

                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={editedTemplate.subject}
                                    onChange={e =>
                                        setEditedTemplate({
                                            ...editedTemplate,
                                            subject: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter template subject"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Content
                                </label>
                                <textarea
                                    value={editedTemplate.content || ''}
                                    onChange={e =>
                                        setEditedTemplate({
                                            ...editedTemplate,
                                            content: e.target.value,
                                        })
                                    }
                                    className="w-full h-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter SMS template content"
                                />
                            </div>

                            <div className="mb-6 overflow-auto">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {editedTemplate.tags &&
                                        editedTemplate.tags.map(tag => (
                                            <div
                                                key={tag}
                                                className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-200 rounded-md">
                                                {tag}
                                                <button
                                                    onClick={() =>
                                                        handleRemoveTag(tag)
                                                    }
                                                    className="text-gray-500 hover:text-gray-700">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={newTagInput}
                                        onChange={e =>
                                            setNewTagInput(e.target.value)
                                        }
                                        onKeyDown={e =>
                                            e.key === 'Enter' && handleAddTag()
                                        }
                                        className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add tag"
                                    />
                                    <button
                                        onClick={handleAddTag}
                                        className="px-3 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300">
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 overflow-auto">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        if (selectedTemplate)
                                            setSelectedTemplate(
                                                selectedTemplate,
                                            );
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTemplate}
                                    disabled={
                                        !editedTemplate.subject ||
                                        !editedTemplate.content
                                    }
                                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                                        !editedTemplate.subject ||
                                        !editedTemplate.content
                                            ? 'bg-blue-400 text-white cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}>
                                    <Save size={20} /> Save Template
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {selectedTemplate.subject}
                                    </h2>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleEditTemplate}
                                        className="p-2 text-gray-600 rounded-md hover:bg-gray-100"
                                        title="Edit template">
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteTemplate(
                                                selectedTemplate.id,
                                            )
                                        }
                                        className="p-2 text-gray-600 rounded-md hover:bg-gray-100"
                                        title="Delete template">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 mb-6 rounded-md bg-gray-50">
                                <h3 className="mb-2 text-sm font-medium text-gray-700">
                                    Template Content
                                </h3>
                                <p className="whitespace-pre-wrap">
                                    {selectedTemplate.content}
                                </p>
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() =>
                                            handleCopyToClipboard(
                                                selectedTemplate.content,
                                            )
                                        }
                                        className="p-2 text-gray-600 rounded-md hover:bg-gray-200"
                                        title="Copy to clipboard">
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* <div className="mb-6">
                                <h3 className="mb-2 text-sm font-medium text-gray-700">
                                    Variables
                                </h3>
                                <div className="p-3 text-sm rounded-md bg-yellow-50">
                                    {selectedTemplate.content.match(
                                        /{{([^}]+)}}/g,
                                    ) ? (
                                        <ul className="pl-5 space-y-1 list-disc">
                                            {Array.from(
                                                new Set(
                                                    selectedTemplate.content.match(
                                                        /{{([^}]+)}}/g,
                                                    ),
                                                ),
                                            ).map(variable => (
                                                <li key={variable}>
                                                    {variable}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>
                                            No variables found in this template
                                        </p>
                                    )}
                                </div>
                            </div> */}

                            <div className="mb-6">
                                <h3 className="mb-2 text-sm font-medium text-gray-700">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTemplate.tags &&
                                    selectedTemplate.tags.length > 0 ? (
                                        selectedTemplate.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 text-sm bg-gray-200 rounded-md">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No tags added
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
