'use client';

import EnvelopList from './EnvelopList';
import EnvelopeStatusBadge from './EnvelopeStatusBadge';
import EnvelopeMeanOfDeliveryBadge from './EnvelopeMeanOfDeliveryBadge';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import {
    statusOptions,
    meanDeliveryOptions,
    paymentMethodOptions,
} from './utils-info';

const EnvelopeManagement = () => {
    const [commentData, setCommentData] = useState([]);

    useEffect(() => {
        axios
            .get('api/jubilee/envelope-comments')
            .then(res => {
                setCommentData(res.data);
            })
            .catch(error => print(error));
    }, []);

    return (
        <div>
            <div className="lg:grid lg:grid-cols-5 lg:gap-4">
                <div className="lg:col-span-4 lg:h-screen lg:overflow-auto">
                    <h1 className="text-2xl font-bold text-green-600">
                        Les enveloppes sous ma responsabilité
                    </h1>
                    <EnvelopList
                        key={'list_only_for_all'}
                        onlyForMe={true}
                        paymentMethodOptions={paymentMethodOptions}
                        statusOptions={statusOptions}
                        meanDeliveryOptions={meanDeliveryOptions}
                    />
                    <h3 className="text-2xl font-bold">
                        Liste de toutes les enveloppes du jubilé
                    </h3>
                    <p className="text-gray-500">
                        Filtre par defaut reglé à la liste des enveloppe à
                        livrer à la main
                    </p>
                    <EnvelopList
                        paymentMethodOptions={paymentMethodOptions}
                        statusOptions={statusOptions}
                        meanDeliveryOptions={meanDeliveryOptions}
                        status="contacted"
                        meanOfDelivery="one_to_one"
                    />
                </div>
                <div className="p-4 bg-white rounded-lg border shadow-md lg:col-span-1">
                    <h2 className="text-xl font-bold text-yellow-400">
                        Commentaires
                    </h2>
                    <div className="overflow-auto h-screen">
                        {commentData &&
                            commentData.length > 0 &&
                            commentData.map((comment, index) => (
                                <div
                                    key={'comment-' + index}
                                    className="px-4 pt-4 my-4 bg-white rounded-lg border border-blue-500 shadow-lg">
                                    <h3 className="text-lg font-bold">
                                        {comment.recipient_name}{' '}
                                        <span className="block text-sm text-gray-500">
                                            ({comment.recipient_phone})
                                        </span>
                                    </h3>
                                    <p className="text-green-600">
                                        ({comment.responsible_name} /{' '}
                                        {comment.responsable_phone})
                                    </p>
                                    <div className="flex items-center mt-2 space-x-2">
                                        <EnvelopeStatusBadge
                                            status={comment.status}
                                            statusOptions={statusOptions}
                                        />
                                        <EnvelopeMeanOfDeliveryBadge
                                            mean_of_delivery={
                                                comment.mean_of_delivery
                                            }
                                            meanDeliveryOptions={
                                                meanDeliveryOptions
                                            }
                                        />
                                    </div>

                                    <p className="mt-2 text-gray-600">
                                        {comment.comments}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Dernière modif. le{' '}
                                        {new Intl.DateTimeFormat('fr-FR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }).format(new Date(comment.updated_at))}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnvelopeManagement;
