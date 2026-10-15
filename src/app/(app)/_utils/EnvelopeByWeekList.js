'use client';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Select from '@/components/Select';
import EnvelopeStatusBadge from '@/app/(app)/_utils/EnvelopeStatusBadge';
import Loading from '@/app/(app)/Loading';
import EnvelopeDetailModal from '@/app/(app)/_utils/EnvelopeDetailModal';
import {
    statusOptions,
    meanDeliveryOptions,
    paymentMethodOptions,
} from './utils-info';
import Button from '@/components/Button';

export default function EnvelopeByWeekList() {
    const [weeks, setWeeks] = useState([]);
    const [status, setStatus] = useState('money_ok');
    const [loading, setLoading] = useState(false);
    const [envelope, setEnvelope] = useState({});

    const getEnvelopList = () => {
        axios
            .get('api/jubilee/envelopes-grouped-by-week', {
                params: { status },
            })
            .then(res => setWeeks(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        getEnvelopList();
    }, [status]);

    const handleFillEnvelopeData = id => {
        axios
            .get(`api/jubilee/envelope/${id}`)
            .then(res => {
                setEnvelope(res.data);
            })
            .catch(error => print(error));
    };

    return (
        <>
            {envelope.id && (
                <EnvelopeDetailModal
                    key={'list_only_for_me'}
                    envelope={envelope}
                    isOpen={!!envelope.id}
                    onClose={() => {
                        setEnvelope({});
                        getEnvelopList();
                    }}
                    statusOptions={statusOptions}
                    meanDeliveryOptions={meanDeliveryOptions}
                    paymentMethodOptions={paymentMethodOptions}
                />
            )}
            <div className="px-2 mx-auto max-w-7xl">
                <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center">
                    <Select
                        label="Filtrer par statut"
                        options={statusOptions}
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    />
                </div>
                {loading ? (
                    <Loading />
                ) : weeks && weeks.length > 0 ? (
                    weeks.map((weekData, i) => (
                        <div
                            key={weekData.week || i}
                            className="overflow-hidden mb-8 bg-white rounded-xl border shadow-lg">
                            <div className="flex flex-col gap-2 justify-between px-6 py-4 bg-gradient-to-r from-green-200 to-white border-b sm:flex-row sm:items-center">
                                <div className="text-lg font-bold text-green-900">
                                    Semaine:{' '}
                                    {weekData.start_date &&
                                    weekData.end_date ? (
                                        <span>
                                            Du {weekData.start_date} au{' '}
                                            {weekData.end_date}
                                        </span>
                                    ) : (
                                        <span>Dates non spécifiées</span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {weekData.week || 'Non spécifiée'}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-blue-100">
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Destinataire
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Responsable
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Statut
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Montant
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Date
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weekData.envelopes &&
                                        weekData.envelopes.length > 0 ? (
                                            weekData.envelopes.map(
                                                (env, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className={
                                                            idx % 2 === 0
                                                                ? 'bg-white'
                                                                : 'bg-gray-50 hover:bg-blue-50'
                                                        }>
                                                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-200">
                                                            {env.destinataire ||
                                                                ''}{' '}
                                                            (
                                                            {
                                                                env.phone_recipient
                                                            }
                                                            )
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-200">
                                                            {env.responsable ||
                                                                ''}{' '}
                                                            (
                                                            {
                                                                env.phone_responsible
                                                            }
                                                            )
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-200">
                                                            <EnvelopeStatusBadge
                                                                status={
                                                                    env.status
                                                                }
                                                                statusOptions={
                                                                    statusOptions
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 font-semibold text-blue-700 whitespace-nowrap border-b border-gray-200">
                                                            {env.montant} Ar
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-200">
                                                            {env.date || ''}
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-200">
                                                            <Button
                                                                onClick={() => {
                                                                    handleFillEnvelopeData(
                                                                        env.id,
                                                                    );
                                                                }}>
                                                                Modifier
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-3 py-4 text-center text-gray-400 border-b border-gray-200">
                                                    Pas d'enveloppes pour cette
                                                    semaine
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-gray-400">
                        Aucune donnée à afficher.
                    </div>
                )}
            </div>
        </>
    );
}
