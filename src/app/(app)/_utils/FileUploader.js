'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';

const FileUploader = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    };

    const validateFile = async () => {
        setIsValidating(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            await axios.post('/api/elder/upload-excel', formData);
        } catch (error) {
            setFile(null);
            setIsValidating(false);
        }
        setIsValidating(false);
    };

    return user?.role_names.includes('admin') ? (
        <div>
            <input
                type="file"
                accept=".xlsx, .xls"
                className="mr-4"
                onChange={handleFileChange}
            />
            <button
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={validateFile}
                disabled={isValidating}>
                {isValidating ? 'Validating...' : 'Valider et importer'}
            </button>
        </div>
    ) : (
        <></>
    );
};
export default FileUploader;
