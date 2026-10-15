'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Select from '@/components/Select';
import { useAuth } from '@/hooks/auth';
import { useState } from 'react';

const Page = () => {
    const { registerElder } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [espaField, setEspaField] = useState('');
    const [city, setCity] = useState('');
    const [previousOccupation, setPreviousOccupation] = useState('');
    const [message, setMessage] = useState('');
    const [promotionName, setPromotionName] = useState('');
    const [civility, setCivility] = useState('');
    const [promotionYear, setPromotionYear] = useState(1985);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState([]);
    const options = [
        { value: 'Mademoiselle', label: 'Mlle.' },
        { value: 'Monsieur', label: 'M.' },
        { value: 'Madame', label: 'Mme.' },
    ];
    const submitForm = event => {
        event.preventDefault();
        registerElder({
            first_name: firstName,
            last_name: lastName,
            promotion_name: promotionName,
            promotion_year: promotionYear,
            email,
            phone,
            espa_field: espaField,
            city,
            previous_occupation: previousOccupation,
            message,
            civility,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        });
    };

    return (
        <form onSubmit={submitForm}>
            <div className="grid grid-cols-5 gap-4">
                <div className="flex flex-col mb-6">
                    <Label
                        htmlFor="civility"
                        className="text-[#074c8f] font-bold mb-2">
                        Civilité
                    </Label>
                    <Select
                        options={options}
                        value={civility}
                        placeholder="-- Séléctionnez ici --"
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        onChange={event => setCivility(event.target.value)}
                        id="civility"
                    />
                    <InputError messages={errors.name} className="mt-2" />
                </div>

                <div className="flex flex-col col-span-2 mb-6">
                    <Label
                        htmlFor="last_name"
                        className="text-[#074c8f] font-bold mb-2">
                        Nom
                    </Label>
                    <Input
                        id="last_name"
                        type="text"
                        value={lastName}
                        onChange={event => setLastName(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError messages={errors.name} className="mt-2" />
                </div>

                <div className="flex flex-col col-span-2 mb-6">
                    <Label
                        htmlFor="first_name"
                        className="text-[#074c8f] font-bold mb-2">
                        Prénoms
                    </Label>
                    <Input
                        id="first_name"
                        type="text"
                        value={firstName}
                        onChange={event => setFirstName(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError messages={errors.name} className="mt-2" />
                </div>

                <div className="flex flex-col col-span-2 mb-6">
                    <Label
                        htmlFor="email"
                        className="text-[#074c8f] font-bold mb-2">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError messages={errors.email} className="mt-2" />
                </div>

                <div className="flex flex-col col-span-2 mb-6">
                    <Label
                        htmlFor="phone"
                        className="text-[#074c8f] font-bold mb-2">
                        Téléphone mobile
                    </Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={event => setPhone(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError messages={errors.phone} className="mt-2" />
                </div>
                <div className="flex flex-col mb-6">
                    <Label
                        htmlFor="promotion_year"
                        className="text-[#074c8f] font-bold mb-2">
                        Année de promotion
                    </Label>
                    <Input
                        id="promotion_year"
                        type="number"
                        value={promotionYear}
                        onChange={event => setPromotionYear(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError
                        messages={errors.promotion_year}
                        className="mt-2"
                    />
                </div>

                <div className="flex flex-col col-span-2 mb-6">
                    <Label
                        htmlFor="espa_field"
                        className="text-[#074c8f] font-bold mb-2">
                        Filière au sein de l'ESPA
                    </Label>
                    <Input
                        id="espa_field"
                        type="text"
                        value={espaField}
                        onChange={event => setEspaField(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError messages={errors.espa_field} className="mt-2" />
                </div>

                <div className="flex flex-col col-span-2 mb-6">
                    <Label
                        htmlFor="promotion_name"
                        className="text-[#074c8f] font-bold mb-2">
                        Nom de la promotion
                    </Label>
                    <Input
                        id="promotion_name"
                        type="text"
                        value={promotionName}
                        onChange={event => setPromotionName(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError
                        messages={errors.promotion_year}
                        className="mt-2"
                    />
                </div>

                <div className="flex flex-col mb-6">
                    <Label
                        htmlFor="city"
                        className="text-[#074c8f] font-bold mb-2">
                        Votre ville plus proche
                    </Label>
                    <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={event => setCity(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError messages={errors.city} className="mt-2" />
                </div>

                <div className="flex flex-col col-span-5 mb-6">
                    <Label
                        htmlFor="previous_occupation"
                        className="text-[#074c8f] font-bold mb-2">
                        Ancienne previous_occupation au sein de l'ACU ou
                        association chez ACU
                    </Label>
                    <Input
                        id="previous_occupation"
                        type="text"
                        value={previousOccupation}
                        onChange={event =>
                            setPreviousOccupation(event.target.value)
                        }
                        placeholder="Entrez votre réponses..."
                        className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                        required
                    />
                    <InputError
                        messages={errors.previous_occupation}
                        className="mt-2"
                    />
                </div>

                <div className="flex flex-col col-span-5 mb-6">
                    <Label
                        htmlFor="message"
                        className="text-[#074c8f] font-bold mb-2">
                        Message pour nous :-)
                    </Label>
                    <Textarea
                        id="message"
                        value={message}
                        onChange={event => setMessage(event.target.value)}
                        placeholder="Entrez votre réponses..."
                        rows="6"
                    />
                    <InputError messages={errors.message} className="mt-2" />
                </div>
                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block w-full mt-1"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="new-password"
                    />

                    <InputError messages={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <Label htmlFor="passwordConfirmation">
                        Confirm Password
                    </Label>

                    <Input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        className="block w-full mt-1"
                        onChange={event =>
                            setPasswordConfirmation(event.target.value)
                        }
                        required
                    />

                    <InputError
                        messages={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
            </div>
            <div className="flex items-center justify-end mt-4">
                {/* <Link
                    href="/login"
                    className="text-sm text-gray-600 underline hover:text-gray-900">
                    Vous avez déjà mis à jour vos infos?
                </Link> */}

                <Button className="ml-4">Envoyer</Button>
            </div>
        </form>
    );
};

export default Page;
