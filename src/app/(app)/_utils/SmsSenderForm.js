'use client';
import Textarea from '@/components/Textarea';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { ToastContext } from '@/contexts/toastContext';
import { useContext } from 'react';
import InputError from '@/components/InputError';

const SmsSenderForm = ({
    receiver = '',
    toUserId = '',
    content = '',
    templateId = null,
}) => {
    const { addToast } = useContext(ToastContext);
    const [form, setForm] = useState({
        receiver: receiver,
        content: content,
        toUserId: toUserId,
        templateId: templateId,
    });
    const [errors, setErrors] = useState({});
    const [balance, setBalance] = useState();
    const [smsLength, setSmsLength] = useState(0);
    const smsLengthMax = 160;

    const getBalance = async () => {
        try {
            const response = await axios.get('/api/sms-balance');
            setBalance(response.data.balance);
        } catch (e) {
            setBalance(0);
        }
    };

    useEffect(() => {
        getBalance();
    }, []);

    useEffect(() => {
        setForm({ ...form, content: content, templateId: templateId });
        setSmsLength(content.length);
    }, [content, templateId]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
        setSmsLength(form.content.length);
    };

    const submitForm = async event => {
        event.preventDefault();

        try {
            setErrors({});
            await axios.post('/api/send-sms', form);
            addToast('Le SMS a bien été envoyé', 'success');
            getBalance();
        } catch (error) {
            setErrors(error.response.data.errors);
        }
    };

    return (
        <form
            onSubmit={submitForm}
            className="w-full p-6 my-4 bg-yellow-100 rounded-lg shadow-lg">
            <h3 className="mb-4 text-2xl font-bold">
                Envoyer un SMS au destinataire{' '}
                <span className="text-green-500">
                    (Solde disponible: {balance} SMS)
                </span>
            </h3>
            <div className="flex flex-wrap mb-6 -mx-3">
                <div className="w-full px-3 mb-6 ">
                    <label
                        className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                        htmlFor="receiver">
                        Destinataire
                    </label>
                    <input
                        className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                        id="receiver"
                        name="receiver"
                        type="text"
                        value={form.receiver ?? ''}
                        placeholder="342710071"
                        onChange={handleInputChange}
                    />
                    <InputError messages={errors.receiver} className="mt-2" />
                </div>
                <div className="w-full px-3">
                    <label
                        className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                        htmlFor="content">
                        Message ({smsLength}/{smsLengthMax} :{' '}
                        {smsLength != 0
                            ? parseInt(smsLength / smsLengthMax) + 1
                            : 0}{' '}
                        SMS)
                    </label>

                    <Textarea
                        name="content"
                        id="content"
                        value={form.content ?? ''}
                        onChange={handleInputChange}
                        placeholder="Entrez votre message..."
                        rows="4"
                    />

                    <InputError messages={errors.content} className="mt-2" />
                </div>
            </div>
            {smsLength > 0 && (
                <div className="md:flex md:items-center">
                    <div className="md:w-1/3">
                        <button
                            className="px-4 py-2 font-bold text-white bg-teal-400 rounded shadow hover:bg-teal-400 focus:shadow-outline focus:outline-none"
                            type="submit">
                            Envoyer SMS
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
};

export default SmsSenderForm;
