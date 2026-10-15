'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Select from '@/components/Select';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { ToastContext } from '@/contexts/toastContext';
import { useContext } from 'react';
import { useAuth } from '@/hooks/auth';
import { BotMessageSquare } from 'lucide-react';

const StudentInfoForm = ({
    studentInitValue = {
        civility: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        diocese: '',
        social_network_id: '',
        id: '',
    },
    onCreatedSuccessfully = () => {},
    onUpdatedSuccessfully = () => {},
    isReadOnly = false,
    skipText = "Revenir sur la page d'accueil",
    onSkip = () => {},
}) => {
    const { addToast } = useContext(ToastContext);
    const [form, setForm] = useState({
        ...studentInitValue,
    });
    const [isReadonly, setIsReadOnly] = useState(isReadOnly);
    const [errors, setErrors] = useState({});
    const { user } = useAuth({ middleware: 'guest' });

    useEffect(() => {
        setForm({ ...studentInitValue });
    }, [studentInitValue]);

    const handleGenerateFictiveEmail = () => {
        axios.get('/api/generate-fictive-email').then(res => {
            setForm({ ...form, email: res.data.email });
        });
    };
    const submitForm = async event => {
        event.preventDefault();

        if (!studentInitValue.id) {
            try {
                const usrData = await axios.post('/api/student/sign-up', form);
                setErrors({});
                onCreatedSuccessfully(usrData.data);
                addToast(
                    'Les informations ont été bien enregistrées',
                    'success',
                );
            } catch (error) {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
            }
        } else {
            try {
                await axios.put('/api/student/update-info-perso', form);
                setErrors({});
                onUpdatedSuccessfully();
                addToast('Les informations ont été bien modifiées', 'success');
            } catch (error) {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
            }
        }
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    return (
        <>
            <form onSubmit={submitForm}>
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="civility"
                            className="text-[#074c8f] font-bold mb-2">
                            Civilité
                        </Label>
                        {isReadonly ? (
                            <p>{form.civility}</p>
                        ) : (
                            <Select
                                id="civility"
                                name="civility"
                                value={form.civility ?? ''}
                                placeholder="-- Séléctionnez ici --"
                                onChange={handleInputChange}
                                options={[
                                    { value: 'Mademoiselle', label: 'Mlle.' },
                                    { value: 'Monsieur', label: 'M.' },
                                    { value: 'Madame', label: 'Mme.' },
                                ]}
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                            />
                        )}
                        <InputError
                            messages={errors.civility}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="last_name"
                            className="text-[#074c8f] font-bold mb-2">
                            Nom
                        </Label>
                        {isReadonly ? (
                            <p>{form.last_name}</p>
                        ) : (
                            <Input
                                name="last_name"
                                id="last_name"
                                value={form.last_name ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required
                            />
                        )}
                        <InputError
                            messages={errors.last_name}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="first_name"
                            className="text-[#074c8f] font-bold mb-2">
                            Prénoms
                        </Label>
                        {isReadonly ? (
                            <p>{form.first_name}</p>
                        ) : (
                            <Input
                                name="first_name"
                                id="first_name"
                                value={form.first_name}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required
                            />
                        )}
                        <InputError
                            messages={errors.first_name}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="email"
                            className="text-[#074c8f] font-bold mb-2">
                            Email
                        </Label>
                        {isReadonly ? (
                            <p>{form.email}</p>
                        ) : (
                            <div className="flex">
                                {!form.email && user && (
                                    <button
                                        type="button"
                                        onClick={handleGenerateFictiveEmail}
                                        title="Je n'ai pas d'email, générer un email fictif pour moi"
                                        className="text-gray-500 hover:text-gray-700 inline-block mr-2">
                                        <BotMessageSquare />
                                    </button>
                                )}
                                <Input
                                    name="email"
                                    value={form.email ?? ''}
                                    onChange={handleInputChange}
                                    placeholder="Entrez votre réponses..."
                                    className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none w-full"
                                    required
                                />
                            </div>
                        )}
                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="phone"
                            className="text-[#074c8f] font-bold mb-2">
                            Téléphone mobile
                        </Label>
                        {isReadonly ? (
                            <p>{form.phone}</p>
                        ) : (
                            <Input
                                name="phone"
                                value={form.phone ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required
                            />
                        )}
                        <InputError messages={errors.phone} className="mt-2" />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="diocese"
                            className="text-[#074c8f] font-bold mb-2">
                            Diocèse
                        </Label>
                        {isReadonly ? (
                            <p>{form.diocese}</p>
                        ) : (
                            <Input
                                name="diocese"
                                value={form.diocese ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                            />
                        )}
                        <InputError
                            messages={errors.diocese}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="social_network_id"
                            className="text-[#074c8f] font-bold mb-2">
                            Id Réseau social
                        </Label>
                        {isReadonly ? (
                            <p>{form.social_network_id}</p>
                        ) : (
                            <Input
                                name="social_network_id"
                                id="social_network_id"
                                value={form.social_network_id ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                            />
                        )}
                        <InputError
                            messages={errors.social_network_id}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={onSkip}
                        type="button"
                        className="text-sm text-gray-700 underline">
                        {skipText}
                    </button>
                    {!isReadonly && (
                        <Button className="ml-4">Enregistrer</Button>
                    )}
                    {isReadonly && (
                        <Button
                            type="button"
                            className="ml-4"
                            onClick={() => setIsReadOnly(false)}>
                            Editer
                        </Button>
                    )}
                </div>
            </form>
        </>
    );
};

export default StudentInfoForm;
