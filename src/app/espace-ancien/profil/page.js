'use client';

import MainElderForm from '../_utils/MainElderForm';
import { ToastProvider } from '@/contexts/toastContext';
import InputError from '@/components/InputError';
import { useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/Button';
import { BotMessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/auth';

const Page = () => {
    const { user } = useAuth({ middleware: 'guest' });
    const [form, setForm] = useState({
        email: '',
    });
    const [errors, setErrors] = useState({});
    const [componentKey, setComponentKey] = useState('');
    const [searchMode, setSearchMode] = useState(true);
    const [responseData, setResponseData] = useState(null);

    const componentsOption = {
        foundElder: (
            <div className="flex flex-col items-center justify-center max-w-5xl p-4 mt-6 bg-green-100 border border-green-600 rounded-lg border-rounded">
                <h1 className="mb-4 text-2xl font-bold text-green-600">
                    Merci d'avoir vérifer vos informations dans notre communauté
                </h1>
                <p className="text-lg">
                    <span className="font-bold">Nom et prenoms: </span>
                    {responseData?.civility +
                        ' ' +
                        responseData?.first_name +
                        ' ' +
                        responseData?.last_name +
                        ' '}
                    <br />
                    <span className="font-bold">Promotion: </span>
                    {responseData?.promotion_year}
                    <br />
                </p>
            </div>
        ),
        elderNotFound: <MainElderForm email={form.email} />,
    };

    const submitForm = async event => {
        event.preventDefault();
        axios
            .post('/api/elder/check-my-info', form)
            .then(res => {
                if (res.data.email) {
                    setComponentKey('foundElder');
                    setResponseData(res.data);
                    setSearchMode(true);
                } else {
                    setComponentKey('elderNotFound');
                    setResponseData(null);
                    setSearchMode(false);
                }
            })
            .catch(error => {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
                setResponseData(null);
                setSearchMode(false);
            });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    const handleGenerateFictiveEmail = () => {
        axios.get('/api/generate-fictive-email').then(res => {
            setForm({ ...form, email: res.data.email });
        });
    };
    return (
        <ToastProvider>
            <div className="flex flex-col items-center w-full">
                {searchMode && (
                    <form onSubmit={submitForm}>
                        <label
                            htmlFor="email"
                            className="text-[#074c8f] font-bold text-2xl my-2 block">
                            {user
                                ? "Entrez l'email de la personne que vous voulez inscrire"
                                : 'Veuillez entrer votre email'}
                        </label>
                        <div className="flex items-center">
                            {!form.email && user && (
                                <button
                                    type="button"
                                    onClick={handleGenerateFictiveEmail}
                                    title="Pas d'email, générer un email fictif"
                                    className="text-gray-500 hover:text-gray-700 inline-block mr-2">
                                    <BotMessageSquare />
                                </button>
                            )}
                            <input
                                type="email"
                                name="email"
                                value={form.email ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="block w-full p-3 text-base border rounded-md outline-none border-sky focus:border-sky focus:ring focus:ring-sky-200 focus:ring-opacity-50"
                                required
                            />
                            <InputError
                                messages={errors.email}
                                className="mt-2"
                            />
                            {form.email && (
                                <Button className="ml-4">Verifier</Button>
                            )}
                        </div>
                    </form>
                )}
                {componentsOption[componentKey]}
            </div>
        </ToastProvider>
    );
};

export default Page;
