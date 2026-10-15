'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Select from '@/components/Select';
import { useState } from 'react';
import axios from '@/lib/axios';
import { ToastContext } from '@/contexts/toastContext';
import { useContext } from 'react';
import { useAuth } from '@/hooks/auth';
import { BotMessageSquare } from 'lucide-react';

const ElderDetailForm = ({
    civility = '',
    first_name = '',
    last_name = '',
    email = '',
    phone = '',
    espa_field = '',
    nearest_city = '',
    acu_previous_occupation = '',
    my_job = '',
    social_network_id = '',
    is_elder_info_completed = false,
    is_special = false,
    first_message = '',
    promotion_name = '',
    promotion_year = 1985,
    onCreatedSuccessfully = () => {},
    onUpdatedSuccessfully = () => {},
    id,
    isReadOnly = false,
    skipText = "Revenir sur la page d'accueil",
    onSkip = () => {},
}) => {
    const { user } = useAuth({ middleware: 'guest' });
    const { addToast } = useContext(ToastContext);
    const [form, setForm] = useState({
        civility: civility,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        espa_field: espa_field,
        nearest_city: nearest_city,
        acu_previous_occupation: acu_previous_occupation,
        first_message: first_message,
        promotion_name: promotion_name,
        promotion_year: promotion_year,
        my_job: my_job,
        social_network_id: social_network_id,
        is_elder_info_completed: is_elder_info_completed,
        is_special: is_special,
    });
    const [isReadonly, setIsReadOnly] = useState(isReadOnly);
    const [errors, setErrors] = useState({});

    const submitForm = async event => {
        event.preventDefault();

        if (!id) {
            try {
                await axios.post('/api/register-elder', form);
                onCreatedSuccessfully();
                addToast('Les informations ont  été bien nregistré', 'success');
            } catch (error) {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
            }
        } else {
            try {
                await axios.put('/api/users/update/' + id, form);
                onUpdatedSuccessfully();
                addToast('Les informations ont  été bien modifié', 'success');
            } catch (error) {
                if (error.response.status !== 422) throw error;
                setErrors(error.response.data.errors);
            }
        }
    };

    const handleGenerateFictiveEmail = () => {
        axios.get('/api/generate-fictive-email').then(res => {
            setForm({ ...form, email: res.data.email });
        });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    const handleInputCheckboxChange = event => {
        const { name, checked } = event.target;
        setForm({ ...form, [name]: checked });
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
                                value={form.last_name}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required
                            />
                        )}
                        <InputError
                            messages={errors.lastName}
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
                            messages={errors.firstName}
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
                            htmlFor="promotion_year"
                            className="text-[#074c8f] font-bold mb-2">
                            Promotion
                        </Label>
                        {isReadonly ? (
                            <p>{form.promotion_year}</p>
                        ) : (
                            <Input
                                name="promotion_year"
                                value={form.promotion_year ?? ''}
                                onChange={handleInputChange}
                                type="number"
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required
                            />
                        )}
                        <InputError
                            messages={errors.promotion_year}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="espa_field"
                            className="text-[#074c8f] font-bold mb-2">
                            Filière au sein de l'ESPA
                        </Label>
                        {isReadonly ? (
                            <p>{form.espa_field}</p>
                        ) : (
                            <Input
                                name="espa_field"
                                value={form.espa_field ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required={!id}
                            />
                        )}
                        <InputError
                            messages={errors.espa_field}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="promotion_name"
                            className="text-[#074c8f] font-bold mb-2">
                            Nom de la promotion
                        </Label>
                        {isReadonly ? (
                            <p>{form.promotion_name}</p>
                        ) : (
                            <Input
                                name="promotion_name"
                                id="promotion_name"
                                value={form.promotion_name ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required
                            />
                        )}
                        <InputError
                            messages={errors.promotion_year}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="nearest_city"
                            className="text-[#074c8f] font-bold mb-2">
                            Adresse
                        </Label>
                        {isReadonly ? (
                            <p>{form.nearest_city}</p>
                        ) : (
                            <Input
                                name="nearest_city"
                                value={form.nearest_city ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required={!id}
                            />
                        )}
                        <InputError
                            messages={errors.nearest_city}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-1">
                        <Label
                            htmlFor="acu_previous_occupation"
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
                            messages={errors.acu_previous_occupation}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="acu_previous_occupation"
                            className="text-[#074c8f] font-bold mb-2">
                            Ancienne occupation au sein de l'ACU ou association
                            chez ACU
                        </Label>
                        {isReadonly ? (
                            <p>{form.acu_previous_occupation}</p>
                        ) : (
                            <Input
                                name="acu_previous_occupation"
                                id="acu_previous_occupation"
                                value={form.acu_previous_occupation ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                            />
                        )}
                        <InputError
                            messages={errors.acu_previous_occupation}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-2">
                        <Label
                            htmlFor="my_job"
                            className="text-[#074c8f] font-bold mb-2">
                            Métier actuel
                        </Label>
                        {isReadonly ? (
                            <p>{form.my_job}</p>
                        ) : (
                            <Input
                                name="my_job"
                                id="my_job"
                                value={form.my_job ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                            />
                        )}
                        <InputError
                            messages={errors.acu_previous_occupation}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-5">
                        <Label
                            htmlFor="first_message"
                            className="text-[#074c8f] font-bold mb-2">
                            Message pour nous :-)
                        </Label>
                        {isReadonly || user ? (
                            <p>{form.first_message}</p>
                        ) : (
                            <Textarea
                                name="first_message"
                                id="first_message"
                                value={form.first_message ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                rows="6"
                            />
                        )}
                        <InputError
                            messages={errors.first_message}
                            className="mt-2"
                        />
                    </div>
                    {user && (
                        <div className="flex flex-col mb-6 md:col-span-3">
                            <Label
                                htmlFor="is_elder_info_completed"
                                className="text-[#074c8f] font-bold mb-2">
                                Marquer que les Informations nécessare sont
                                complètes
                            </Label>
                            {isReadonly ? (
                                <p>
                                    {form.is_elder_info_completed
                                        ? 'Oui'
                                        : 'Non'}
                                </p>
                            ) : (
                                <Input
                                    type="checkbox"
                                    name="is_elder_info_completed"
                                    id="is_elder_info_completed"
                                    checked={form.is_elder_info_completed}
                                    onChange={handleInputCheckboxChange}
                                    className="w-4 h-4"
                                />
                            )}
                            <InputError
                                messages={errors.is_elder_info_completed}
                                className="mt-2"
                            />
                        </div>
                    )}
                    {user && (
                        <div className="flex flex-col mb-6 md:col-span-2">
                            <Label
                                htmlFor="is_elder_info_completed"
                                className="mb-2 font-bold text-orange-600">
                                Anciens signalé pour une approche prudente
                            </Label>
                            {isReadonly ? (
                                <p>{form.is_special ? 'Oui' : 'Non'}</p>
                            ) : (
                                <Input
                                    type="checkbox"
                                    name="is_special"
                                    id="is_special"
                                    checked={form.is_special}
                                    onChange={handleInputCheckboxChange}
                                    className="w-4 h-4"
                                />
                            )}
                            <InputError
                                messages={errors.is_special}
                                className="mt-2"
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={onSkip}
                        type="outline"
                        className="text-sm text-gray-700 underline">
                        {skipText}
                    </button>
                    {!isReadonly && <Button className="ml-4">Envoyer</Button>}
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

export default ElderDetailForm;
