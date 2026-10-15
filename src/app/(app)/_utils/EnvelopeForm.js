'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Select from '@/components/Select';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { ToastContext } from '@/contexts/toastContext';
import { useContext } from 'react';
import SelectUser from './SelectUser';
import SearchableSelect from './SearchableSelect';

const EnvelopeForm = ({
    status,
    earnings,
    mean_of_delivery,
    commentary,
    responsible_id,
    recipient_id,
    assistant_responsible_id,
    payment_method = 'cash',
    onUpdatedSuccessfully = () => {},
    id,
    isReadOnly = false,
    skipText = "Revenir sur la page d'accueil",
    onSkip = () => {},
    statusOptions,
    meanDeliveryOptions,
    paymentMethodOptions,
}) => {
    const { addToast } = useContext(ToastContext);
    const [form, setForm] = useState({
        status: status,
        earnings: earnings,
        mean_of_delivery: mean_of_delivery,
        commentary: commentary,
        responsible_id: parseInt(responsible_id),
        recipient_id: parseInt(recipient_id),
        assistant_responsible_id: parseInt(assistant_responsible_id),
        payment_method: payment_method || 'cash',
    });
    const [isReadonly, setIsReadOnly] = useState(isReadOnly);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm(form);
    }, [form]);

    const submitForm = async event => {
        event.preventDefault();

        if (id) {
            try {
                await axios.put('/api/jubilee/update-envelope/' + id, form);
                onUpdatedSuccessfully();
                addToast('Les informations ont  été bien modifié', 'success');
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
                <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3">
                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="recipient_id"
                            className="text-[#074c8f] font-bold mb-2">
                            Destinataire
                        </Label>
                        <SelectUser
                            id="recipient_id"
                            name="recipient_id"
                            selectedUserId={form.recipient_id}
                            handleInputChange={handleInputChange}
                            isReadOnly={true}
                        />
                        <InputError
                            messages={errors.recipient_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="responsible_id"
                            className="text-[#074c8f] font-bold mb-2">
                            Responsable 1
                        </Label>
                        <SearchableSelect
                            asyncUrl="/api/users/list-options"
                            optionLabel="label"
                            optionValue="value"
                            onChange={handleInputChange}
                            onClear={() => {}}
                            onSelected={() => {}}
                            value={form.responsible_id || null}
                            name="responsible_id"
                        />
                        <InputError
                            messages={errors.responsible_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="assistant_responsible_id"
                            className="text-[#074c8f] font-bold mb-2">
                            Responsable 2
                        </Label>
                        <SearchableSelect
                            asyncUrl="/api/users/list-options"
                            optionLabel="label"
                            optionValue="value"
                            onChange={handleInputChange}
                            onClear={() => {}}
                            onSelected={() => {}}
                            value={form.assistant_responsible_id || null}
                            name="assistant_responsible_id"
                        />
                        <InputError
                            messages={errors.assistant_responsible_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="status"
                            className="text-[#074c8f] font-bold mb-2">
                            Statut
                        </Label>
                        {isReadonly ? (
                            <p>
                                {
                                    statusOptions.find(
                                        option => option.value === form.status,
                                    )['label']
                                }
                            </p>
                        ) : (
                            <Select
                                id="status"
                                name="status"
                                value={form.status}
                                placeholder="-- Séléctionnez ici --"
                                onChange={handleInputChange}
                                options={statusOptions}
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                            />
                        )}
                        <InputError messages={errors.status} className="mt-2" />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="mean_of_delivery"
                            className="text-[#074c8f] font-bold mb-2">
                            Moyen de livraison
                        </Label>
                        {isReadonly ? (
                            <p>
                                {
                                    meanDeliveryOptions.find(
                                        option =>
                                            option.value ===
                                            form.mean_of_delivery,
                                    )['label']
                                }
                            </p>
                        ) : (
                            <Select
                                id="mean_of_delivery"
                                name="mean_of_delivery"
                                value={form.mean_of_delivery}
                                placeholder="-- Séléctionnez ici --"
                                onChange={handleInputChange}
                                options={meanDeliveryOptions}
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                            />
                        )}
                        <InputError
                            messages={errors.mean_of_delivery}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="earnings"
                            className="text-[#074c8f] font-bold mb-2">
                            Montant obtenu (en Ariary)
                        </Label>
                        {isReadonly ? (
                            <p>{form.earnings} Ar</p>
                        ) : (
                            <Input
                                name="earnings"
                                value={form.earnings}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                type="number"
                                required
                            />
                        )}
                        <InputError
                            messages={errors.earnings}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="status"
                            className="text-[#074c8f] font-bold mb-2">
                            Moyen de payment
                        </Label>
                        {isReadonly ? (
                            <p>
                                {
                                    paymentMethodOptions.find(
                                        option =>
                                            option.value ===
                                            form.payment_method,
                                    )?.label
                                }
                            </p>
                        ) : (
                            <Select
                                id="payment_method"
                                name="payment_method"
                                value={form.payment_method ?? ''}
                                placeholder="-- Séléctionnez ici --"
                                onChange={handleInputChange}
                                options={paymentMethodOptions}
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                            />
                        )}
                        <InputError
                            messages={errors.payment_method}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6 md:col-span-3">
                        <Label
                            htmlFor="commentary"
                            className="text-[#074c8f] font-bold mb-2">
                            Commentaire
                        </Label>
                        {isReadonly ? (
                            <p>{form.commentary}</p>
                        ) : (
                            <Textarea
                                name="commentary"
                                id="commentary"
                                value={form.commentary ?? ''}
                                onChange={handleInputChange}
                                placeholder="Entrez votre réponses..."
                                rows="6"
                            />
                        )}
                        <InputError
                            messages={errors.commentary}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={onSkip}
                        type="outline"
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

export default EnvelopeForm;
