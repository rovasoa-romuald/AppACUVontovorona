'use client';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import EnvelopeStatusBadge from '@/app/(app)/_utils/EnvelopeStatusBadge';
import Loading from '@/app/(app)/Loading';
import SearchableSelect from '@/app/(app)/_utils/SearchableSelect';
import Button from '@/components/Button';
import EnvelopeDetailModal from './EnvelopeDetailModal';
import {
    statusOptions,
    meanDeliveryOptions,
    paymentMethodOptions,
} from './utils-info';

export default function EnvelopePerResponsible() {
    const [allEnvelopes, setAllEnvelopes] = useState([]);
    const [responsible_id, setResponsibleId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [envelope, setEnvelope] = useState({});

    const handleSetFilters = event => {
        setResponsibleId(event.target.value);
    };

    const getEnvelopList = () => {
        axios
            .get('api/jubilee/envelopes-grouped-by-responsible', {
                params: { responsible_id },
            })
            .then(res => setAllEnvelopes(res.data))
            .finally(() => setLoading(false));
    };

    const handleFillEnvelopeData = id => {
        axios
            .get(`api/jubilee/envelope/${id}`)
            .then(res => {
                setEnvelope(res.data);
            })
            .catch(error => print(error));
    };

    useEffect(() => {
        setLoading(true);
        getEnvelopList();
    }, [responsible_id]);

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
                    <SearchableSelect
                        asyncUrl="/api/users/list-options"
                        optionLabel="label"
                        optionValue="value"
                        onChange={handleSetFilters}
                        onClear={() => {}}
                        onSelected={() => {}}
                        value={responsible_id || null}
                        name="responsible_id"
                        placeholder="Filtrer par responsable"
                    />
                </div>
                {loading ? (
                    <Loading />
                ) : allEnvelopes && allEnvelopes.length > 0 ? (
                    allEnvelopes.map((responsableEnvelopesData, i) => (
                        <div
                            key={responsableEnvelopesData.responsible_id || i}
                            className="overflow-hidden mb-8 bg-white rounded-xl border shadow-lg">
                            <div className="flex flex-col gap-2 justify-between px-6 py-4 bg-gradient-to-r from-orange-200 to-white border-b sm:flex-row sm:items-center">
                                <div className="text-lg font-bold text-orange-900">
                                    Responsable:{' '}
                                    {responsableEnvelopesData.responsible ? (
                                        <span>
                                            {
                                                responsableEnvelopesData.responsible
                                            }{' '}
                                            (
                                            {
                                                responsableEnvelopesData.phone_responsible
                                            }
                                            ) [Enveloppes:{' '}
                                            {
                                                responsableEnvelopesData
                                                    .envelopes.length
                                            }
                                            ]
                                        </span>
                                    ) : (
                                        <span>Non spécifié</span>
                                    )}
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
                                                Téléphone
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Statut
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Montant
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-left text-blue-800 whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responsableEnvelopesData.envelopes &&
                                        responsableEnvelopesData.envelopes
                                            .length > 0 ? (
                                            responsableEnvelopesData.envelopes.map(
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
                                                                ''}
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap border-b border-gray-200">
                                                            {env.phone_recipient ||
                                                                ''}
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
                                                    colSpan={3}
                                                    className="px-3 py-4 text-center text-gray-400 border-b border-gray-200">
                                                    Pas d'enveloppes pour ce
                                                    responsable
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
