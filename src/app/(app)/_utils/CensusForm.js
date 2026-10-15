'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { ToastContext } from '@/contexts/toastContext';
import { useContext } from 'react';
import SearchableSelect from './SearchableSelect';
// import { useAuth } from '@/hooks/auth';

const CensusForm = ({
    onCreatedSuccessfully = () => {},
    onUpdatedSuccessfully = () => {},
    isReadOnly = false,
    skipText = '<< Revenir sur info perso',
    onSkip = () => {},
    censusInitValue = {
        major_id: '',
        level_id: '',
        user_id: '',
        census_year: 2025,
        block: '',
        door_number: '',
        is_off_campus: false,
        is_stay_weekend: false,
        id: '',
    },
}) => {
    // const { user } = useAuth({ middleware: 'guest' });
    const { addToast } = useContext(ToastContext);
    const [form, setForm] = useState({
        ...censusInitValue,
    });
    const [isReadonly, setIsReadOnly] = useState(isReadOnly);
    const [errors, setErrors] = useState({});
    const [studentOption, setStudentOption] = useState([]);

    const handleRefreshOptions = () => {
        axios
            .get('/api/student-options')
            .then(res => {
                setStudentOption(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        handleRefreshOptions();
        setForm({ ...censusInitValue });
    }, [censusInitValue]);

    const submitForm = async event => {
        event.preventDefault();

        if (!censusInitValue.id) {
            try {
                await axios.post('/api/student/make-census', form);
                setErrors({});
                onCreatedSuccessfully();
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
                await axios.put(
                    '/api/student/update-census/' + censusInitValue.id,
                    form,
                );
                setErrors({});
                onUpdatedSuccessfully();
                addToast('Les informations ont été bien modifiées', 'success');
            } catch (error) {
                if (error.response?.status !== 422) throw error;
                setErrors(error.response.data.errors);
            }
        }
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
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="user_id"
                            className="text-[#074c8f] font-bold mb-2">
                            Universitaire
                        </Label>
                        <p>
                            {
                                studentOption.find(
                                    user => user.value === form.user_id,
                                )?.label
                            }
                        </p>
                    </div>
                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="major_id"
                            className="text-[#074c8f] font-bold mb-2">
                            Filière
                        </Label>
                        <SearchableSelect
                            asyncUrl="/api/majors"
                            optionLabel="label"
                            optionValue="value"
                            onChange={handleInputChange}
                            onClear={() => {}}
                            onSelected={() => {}}
                            value={form.major_id || null}
                            name="major_id"
                        />

                        <InputError
                            messages={errors.major_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="level_id"
                            className="text-[#074c8f] font-bold mb-2">
                            Niveau
                        </Label>
                        <SearchableSelect
                            asyncUrl="/api/levels"
                            optionLabel="label"
                            optionValue="value"
                            onChange={handleInputChange}
                            onClear={() => {}}
                            onSelected={() => {}}
                            value={form.level_id || null}
                            name="level_id"
                        />

                        <InputError
                            messages={errors.level_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="block"
                            className="text-[#074c8f] font-bold mb-2">
                            Bloc
                        </Label>
                        {isReadonly ? (
                            <p>{form.block}</p>
                        ) : (
                            <Input
                                id="block"
                                name="block"
                                type="number"
                                min="1"
                                value={form.block ?? ''}
                                placeholder="Entrez le bloc..."
                                onChange={handleInputChange}
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required={!form.is_off_campus}
                            />
                        )}
                        <InputError messages={errors.block} className="mt-2" />
                    </div>
                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="census_year"
                            className="text-[#074c8f] font-bold mb-2">
                            Année du recensement
                        </Label>
                        {!isReadonly ? (
                            <p>{form.census_year}</p>
                        ) : (
                            <Input
                                id="census_year"
                                name="census_year"
                                value={form.census_year ?? ''}
                                type="number"
                                placeholder="Entrez l'année..."
                                onChange={handleInputChange}
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required
                            />
                        )}
                        <InputError
                            messages={errors.census_year}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="door_number"
                            className="text-[#074c8f] font-bold mb-2">
                            Numéro de porte
                        </Label>
                        {isReadonly ? (
                            <p>{form.door_number}</p>
                        ) : (
                            <Input
                                id="door_number"
                                name="door_number"
                                type="number"
                                min="1"
                                value={form.door_number ?? ''}
                                placeholder="Entrez le numéro de porte..."
                                onChange={handleInputChange}
                                className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                                required={!form.is_off_campus}
                            />
                        )}
                        <InputError
                            messages={errors.door_number}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="is_off_campus"
                            className="text-[#074c8f] font-bold mb-2">
                            Hors campus
                        </Label>
                        {isReadonly ? (
                            <p>{form.is_off_campus ? 'Oui' : 'Non'}</p>
                        ) : (
                            <Input
                                type="checkbox"
                                name="is_off_campus"
                                id="is_off_campus"
                                checked={form.is_off_campus}
                                onChange={handleInputCheckboxChange}
                                className="w-4 h-4"
                            />
                        )}
                        <InputError
                            messages={errors.is_off_campus}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col mb-6">
                        <Label
                            htmlFor="is_stay_weekend"
                            className="text-[#074c8f] font-bold mb-2">
                            Reste le weekend
                        </Label>
                        {isReadonly ? (
                            <p>{form.is_stay_weekend ? 'Oui' : 'Non'}</p>
                        ) : (
                            <Input
                                type="checkbox"
                                name="is_stay_weekend"
                                id="is_stay_weekend"
                                checked={form.is_stay_weekend}
                                onChange={handleInputCheckboxChange}
                                className="w-4 h-4"
                            />
                        )}
                        <InputError
                            messages={errors.is_stay_weekend}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={onSkip}
                        type="outline"
                        className="text-sm text-gray-700 underline">
                        {skipText}
                    </button>
                    {!isReadonly && <Button className="ml-4">Finir</Button>}
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

export default CensusForm;
