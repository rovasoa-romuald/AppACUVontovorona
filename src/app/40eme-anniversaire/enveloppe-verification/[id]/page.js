'use client';
import { useRouter } from 'next/navigation';
import MainHeader from '@/components/MainHeader';
import MainFooter from '@/components/MainFooter';
import Letter from '@/app/40eme-anniversaire/_utils/Letter';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import InputError from '@/components/InputError';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/auth';

const Page = ({ params }) => {
    const { user } = useAuth({ middleware: 'guest' });
    const router = useRouter();
    const [envelopeData, setEnvelopeData] = useState(null);
    const [envelopeId, setEnvelopeId] = useState(null);
    const [validationComponentKey, setValidationComponentKey] = useState('');
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        earnings: 0,
    });

    const handleInputChange = event => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    const submitForm = async event => {
        event.preventDefault();
        axios
            .post('/api/jubilee/update-earning', {
                envelopeId: envelopeId,
                earnings: form.earnings,
            })
            .then(() => {
                setError(null);
                validateEnvelope();
            })
            .catch(res => {
                setError(res?.data?.message || 'Une erreur est survenue');
            });
    };

    const validationSection = {
        valid: (
            <div className="flex flex-col justify-center items-center p-4 max-w-5xl bg-green-100 rounded-lg border border-green-600 border-rounded">
                <h1 className="mb-4 text-2xl font-bold text-green-600">
                    Enveloppe de participation à la célébration du 40eme
                    anniversaire
                </h1>
                <div className="text-lg">
                    <p>
                        Merci{' '}
                        <span className="font-bold">
                            {envelopeData?.recipient?.civility +
                                ' ' +
                                envelopeData?.recipient?.first_name +
                                ' ' +
                                envelopeData?.recipient?.last_name +
                                ' '}
                        </span>
                        d'avoir participé à la célébration du 40eme
                        anniversaire! (Enveloppe id: {envelopeId})
                    </p>
                    <p>
                        Voici le responsable de cette enveloppe venant de
                        commission du 40eme anniversaire:
                    </p>
                    <span className="font-bold">
                        {envelopeData?.responsible?.civility +
                            ' ' +
                            envelopeData?.responsible?.first_name +
                            ' ' +
                            envelopeData?.responsible?.last_name}
                    </span>
                    {!!envelopeData?.earnings && (
                        <p>
                            Montant réçu au sein du comité:{' '}
                            <span className="text-3xl font-bold text-green-600">
                                {envelopeData?.earnings} Ar
                            </span>
                        </p>
                    )}
                    {user && (
                        <form onSubmit={submitForm}>
                            <label
                                htmlFor="email"
                                className="text-[#074c8f] font-bold text-2xl my-2 block">
                                Entrez le montant réçu:
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    name="earnings"
                                    value={form.earnings ?? ''}
                                    min={0}
                                    onChange={handleInputChange}
                                    placeholder="Entrez votre réponses..."
                                    className="block p-3 rounded-md border outline-none border-sky focus:border-sky focus:ring focus:ring-sky-200 focus:ring-opacity-50"
                                    required
                                />{' '}
                                <span className="text-xl font-bold">
                                    Ariary
                                </span>
                                {error && (
                                    <InputError
                                        messages={error}
                                        className="mt-2"
                                    />
                                )}
                                {!!form.earnings && (
                                    <Button className="ml-4">
                                        Enregistrer
                                    </Button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        ),
        invalid: (
            <div className="flex flex-col justify-center items-center p-4 max-w-5xl bg-red-100 rounded-lg border border-red-600 border-rounded">
                <h1 className="mb-4 text-2xl font-bold text-center text-red-600">
                    Enveloppe n'est pas valide. Veuillez contacter le commité de
                    la célébration du 40eme anniversaire pour obtenir un nouvel
                    enveloppe.
                </h1>
            </div>
        ),
    };

    const validateEnvelope = async () => {
        const { id } = await params;
        if (!id || typeof id !== 'string') {
            // If 'id' is not present in the URL or is not a string, navigate to the home page
            router.push('/');
            return;
        }

        setEnvelopeId(id);

        axios
            .post('/api/jubilee/envelope-validate', {
                envelopeId: id,
            })
            .then(res => {
                setValidationComponentKey('valid');
                setForm({ earnings: res.data.earnings });
                setEnvelopeData(res.data);
                setError(null);
            })
            .catch(res => {
                if (res?.status === 419) {
                    validateEnvelope();
                } else {
                    setValidationComponentKey('invalid');
                    setEnvelopeData(null);
                    setError(res?.data?.message || 'Une erreur est survenue');
                }
            });
    };

    useEffect(() => {
        validateEnvelope();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <MainHeader />

            <div className="py-4 min-h-screen bg-gray-50">
                <div className="flex flex-col justify-center items-center space-y-4">
                    {validationSection[validationComponentKey] || (
                        <p>Loading...</p>
                    )}
                    {error && (
                        <div className="p-4 bg-red-100 rounded-lg border border-red-600 border-rounded">
                            <p className="text-lg text-red-600">{error}</p>
                        </div>
                    )}
                    <Letter />
                </div>
            </div>
            <MainFooter />
        </div>
    );
};

export default Page;
