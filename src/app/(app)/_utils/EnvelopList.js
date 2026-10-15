'use client';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { AlertContext } from '@/contexts/alertContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Pagination from '@/components/Pagination';
import { DropdownButton } from '@/components/DropdownLink';
import Dropdown from '@/components/Dropdown';
import { ToastContext } from '@/contexts/toastContext';
import EnvelopeDetailModal from './EnvelopeDetailModal';
import { useAuth } from '@/hooks/auth';
import EnvelopeStatusBadge from './EnvelopeStatusBadge';
import EnvelopeMeanOfDeliveryBadge from './EnvelopeMeanOfDeliveryBadge';
import SearchableSelect from './SearchableSelect';
import ElderInfoModal from './ElderInfoModal';

const EnvelopList = ({
    onlyForMe = false,
    paymentMethodOptions,
    statusOptions,
    meanDeliveryOptions,
    status = '',
    meanOfDelivery = '',
}) => {
    const { user } = useAuth();
    const { addToast } = useContext(ToastContext);
    const { showAlert, hideAlert } = useContext(AlertContext);
    const [envelopes, setEnvelopes] = useState([]);
    const [selectedEnvelope, setSelectedEnvelope] = useState([]);
    const [filters, setFilters] = useState({
        onlyForMe: onlyForMe,
        recipient_id: null,
        status: status,
        mean_of_delivery: meanOfDelivery,
    });
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [envelope, setEnvelope] = useState({});
    const [elder, setElder] = useState({});
    const [isReadOnly, setIsReadOnly] = useState(false);

    const columns = [
        'Destinataire',
        'Responsables',
        'Montant obtenu',
        'Qrcode',
        'Actions',
    ];

    const getEnvelopList = () => {
        axios
            .get('api/jubilee/list-envelope', {
                params: {
                    ...filters,
                    page,
                    perPage,
                },
            })
            .then(res => {
                setEnvelopes(res.data.data);
                setTotal(res.data.total);
            })
            .catch(error => print(error));
    };

    useEffect(() => {
        getEnvelopList();
    }, [filters, page, perPage]);

    const handleSelect = id => {
        const isSelected = selectedEnvelope.includes(id);
        setSelectedEnvelope(
            isSelected
                ? selectedEnvelope.filter(userId => userId !== id)
                : [...selectedEnvelope, id],
        );
    };

    const handleFillEnvelopeData = id => {
        axios
            .get(`api/jubilee/envelope/${id}`)
            .then(res => {
                setEnvelope(res.data);
            })
            .catch(error => print(error));
    };

    const handleGenerateEnvelopeFile = () => {
        axios
            .post('api/jubilee/envelope/generate-file-bulk', {
                ids: selectedEnvelope,
            })
            .then(res => {
                setSelectedEnvelope([]);
                if (res.status === 201 || res.status === 500) {
                    hideAlert();
                    addToast(
                        "Les fichiers de l'enveloppe sont encours de traitement, Notifiez Faneva pour pouvoir le télécharger svp!",
                        'success',
                    );
                    getEnvelopList();
                }
            })
            .catch(error => print(error));
    };

    const handleDeleteSelected = () => {
        axios
            .post('api/jubilee/envelopes-delete', {
                ids: selectedEnvelope,
            })
            .then(res => {
                setEnvelopes(
                    envelopes.filter(
                        user => !selectedEnvelope.includes(user.id),
                    ),
                );
                setSelectedEnvelope([]);
                if (res.status === 204 || res.status === 500) {
                    hideAlert();
                    addToast(
                        'Les enveloppes séléctionnées sont supprimées avec succès',
                        'success',
                    );
                }
            })
            .catch(error => print(error));
    };

    const handleSetFilters = event => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
    };

    const handleGenerateQrcode = id => {
        axios
            .post(`api/jubilee/envelope-qr-code/${id}`)
            .then(() => {
                // var url = res.data.qrcode_image_path;
                getEnvelopList();
                // const link = document.createElement('a');
                // link.href = url;
                // link.setAttribute(
                //     'download',
                //     `enveloppe-40eme-qrcode-${id}.png`,
                // );
                // link.setAttribute('target', '_blank');
                // link.style.display = 'none';
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);
            })
            .catch(error => print(error));
    };
    const handleFillUserData = id => {
        axios
            .get(`api/user/${id}`)
            .then(res => setElder(res.data))
            .catch(error => print(error));
    };

    const handleEnvelopeWithQrcode = id => {
        axios
            .post(`api/jubilee/envelope-generate-file/${id}`)
            .then(res => {
                getEnvelopList();
                var url = res.data.envelope_path;
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `enveloppe-40eme-qrcode-${id}.pdf`,
                );
                link.setAttribute('target', '_blank');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => print(error));
    };

    const handleDownloadtemplate2 = url => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', url.replace('envelope/', ''));
        link.setAttribute('target', '_blank');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSendEnvelopeByEmail = id => {
        axios
            .post(`api/jubilee-send-envelope-by-email`, {
                id: id,
            })
            .then(res => {
                if (res.status === 201) {
                    addToast(
                        "L'enveloppe est est envoyée par email, verifier votre boite mail(vous êtes en cc) !",
                        'success',
                    );
                } else {
                    addToast(res.data.message, 'error');
                }
                hideAlert();
                getEnvelopList();
            })
            .catch(error => print(error));
    };

    return (
        <>
            {envelope.id && (
                <EnvelopeDetailModal
                    key={'list_only_for_me'}
                    envelope={envelope}
                    isReadOnly={isReadOnly}
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
            <ElderInfoModal
                elder={elder}
                isOpen={!!elder.id}
                onClose={() => {
                    setElder({});
                    getEnvelopList();
                }}
            />
            <div className="overflow-x-auto overflow-y-hidden mb-4 md:gap-2 md:grid md:grid-cols-5">
                <div className="flex flex-col">
                    <label
                        htmlFor="recipientName"
                        className="block mr-4 text-sm font-medium text-gray-700">
                        Destinataire
                    </label>
                    <Input
                        name="recipientName"
                        id="recipientName"
                        value={filters.recipientName}
                        onChange={handleSetFilters}
                        placeholder="Nom ou prénoms"
                        className="block w-full"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="status"
                        className="block mr-4 text-sm font-medium text-gray-700">
                        Statut
                    </label>
                    <Select
                        id="status"
                        name="status"
                        value={filters.status}
                        placeholder="-- Filtrer par statut --"
                        onChange={handleSetFilters}
                        options={statusOptions}
                        className="block w-full"
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="mean_of_delivery"
                        className="block mr-4 text-sm font-medium text-gray-700">
                        Moyen de livraison
                    </label>
                    <Select
                        id="mean_of_delivery"
                        name="mean_of_delivery"
                        value={filters.mean_of_delivery}
                        placeholder="-- Filtrer par moyen de livraison --"
                        onChange={handleSetFilters}
                        options={meanDeliveryOptions}
                        className="block w-full"
                    />
                </div>
                {!onlyForMe && (
                    <div className="flex flex-col">
                        <label
                            htmlFor="responsible_id"
                            className="block mr-4 text-sm font-medium text-gray-700">
                            Responsable
                        </label>
                        <SearchableSelect
                            asyncUrl="/api/users/list-options"
                            optionLabel="label"
                            optionValue="value"
                            onChange={handleSetFilters}
                            onClear={() => {}}
                            onSelected={() => {}}
                            value={filters.responsible_id || null}
                            name="responsible_id"
                            placeholder="Filtrer par responsable"
                        />
                    </div>
                )}
                <div className="content-center text-right">
                    <span className="text-xl font-bold">
                        {' '}
                        Total de la recherche: {total}
                    </span>
                </div>
                <div className="block md:col-span-5">
                    {selectedEnvelope.length > 0 && (
                        <div className="flex justify-end">
                            <div className="flex justify-end items-center mb-4">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 mr-2 text-sm font-medium text-center text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                                    onClick={() => {
                                        showAlert(
                                            "Voulez vous generer les fichiers de l'enveloppe ?",
                                            'warning',
                                            () => hideAlert(),
                                            () => {
                                                handleGenerateEnvelopeFile();
                                            },
                                        );
                                    }}>
                                    Generer enveloppes via template pour un à un
                                </button>
                            </div>
                            <div className="flex justify-end items-center mb-4">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 mr-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                    onClick={() => {
                                        showAlert(
                                            'Vous êtes sur le point de supprimer les enveloppes séléctionnées ?',
                                            'warning',
                                            () => hideAlert(),
                                            () => {
                                                handleDeleteSelected();
                                            },
                                        );
                                    }}>
                                    Supprimer les enveloppes
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-all-search"
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded-sm border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    onChange={e =>
                                                        setSelectedEnvelope(
                                                            e.target.checked
                                                                ? envelopes.map(
                                                                      envelope =>
                                                                          envelope.id,
                                                                  )
                                                                : [],
                                                        )
                                                    }
                                                />
                                                <label
                                                    htmlFor="checkbox-all-search"
                                                    className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </th>
                                        {columns.map(column => (
                                            <th
                                                key={column}
                                                scope="col"
                                                className="px-6 py-3">
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {envelopes &&
                                        envelopes.map(envelope => (
                                            <tr
                                                key={envelope.id}
                                                className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="p-4 w-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            id={`checkbox-table-search-${envelope.id}`}
                                                            type="checkbox"
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 rounded-sm border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            checked={selectedEnvelope.includes(
                                                                envelope.id,
                                                            )}
                                                            onChange={() =>
                                                                handleSelect(
                                                                    envelope.id,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                                <td
                                                    scope="row"
                                                    className="flex py-4 max-w-md text-gray-900 items-centerpx-6 dark:text-white">
                                                    <div className="items-center ps-3">
                                                        <div className="text-base font-semibold">
                                                            {(envelope.recipient
                                                                .civility ??
                                                                '') +
                                                                ' ' +
                                                                ((envelope
                                                                    .recipient
                                                                    .first_name ??
                                                                    '') +
                                                                    ' ') +
                                                                (envelope
                                                                    .recipient
                                                                    .last_name ??
                                                                    '')}
                                                        </div>
                                                        <div className="font-normal text-gray-500">
                                                            {envelope.recipient
                                                                .email &&
                                                            envelope.recipient.email.includes(
                                                                'fictif',
                                                            ) ? (
                                                                <span className="font-bold text-red-600">
                                                                    Pas d'email
                                                                    (A demander
                                                                    lors de
                                                                    l'appel)
                                                                </span>
                                                            ) : (
                                                                envelope
                                                                    .recipient
                                                                    .email
                                                            )}{' '}
                                                            /{' '}
                                                            <span className="font-bold">
                                                                {
                                                                    envelope
                                                                        .recipient
                                                                        .phone
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex p-2 space-y-1 items-left">
                                                            <EnvelopeStatusBadge
                                                                status={
                                                                    envelope.status
                                                                }
                                                                statusOptions={
                                                                    statusOptions
                                                                }
                                                            />
                                                            <EnvelopeMeanOfDeliveryBadge
                                                                mean_of_delivery={
                                                                    envelope.mean_of_delivery
                                                                }
                                                                meanDeliveryOptions={
                                                                    meanDeliveryOptions
                                                                }
                                                            />
                                                        </div>
                                                        {envelope.commentary && (
                                                            <div className="p-2 w-full rounded-lg border-2 border-green-300">
                                                                <h5>
                                                                    Commentaires:
                                                                </h5>
                                                                <div className="whitespace-pre-wrap">
                                                                    {
                                                                        envelope.commentary
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                                                        <span> 1.</span>{' '}
                                                        {(envelope.responsible
                                                            .civility ?? '') +
                                                            ' ' +
                                                            (envelope
                                                                .responsible
                                                                .first_name ??
                                                                '') +
                                                            ' '}
                                                    </div>
                                                    <div className="font-normal text-gray-500">
                                                        {
                                                            envelope.responsible
                                                                .email
                                                        }{' '}
                                                        {envelope.responsible
                                                            .phone &&
                                                            ' / ' +
                                                                envelope
                                                                    .responsible
                                                                    .phone}
                                                    </div>
                                                    <div className="items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                                                        <span> 2.</span>{' '}
                                                        {(envelope
                                                            .assistant_responsible
                                                            .civility ?? '') +
                                                            ' ' +
                                                            (envelope
                                                                .assistant_responsible
                                                                .first_name ??
                                                                '') +
                                                            ' '}
                                                    </div>
                                                    <div className="font-normal text-gray-500">
                                                        {
                                                            envelope
                                                                .assistant_responsible
                                                                .email
                                                        }{' '}
                                                        {envelope
                                                            .assistant_responsible
                                                            .phone &&
                                                            ' / ' +
                                                                envelope
                                                                    .assistant_responsible
                                                                    .phone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {envelope.earnings} Ar
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {envelope.qr_code_id && (
                                                            <img
                                                                src={
                                                                    envelope.qrcode_image_path ??
                                                                    ''
                                                                }
                                                                width={50}
                                                                height={50}
                                                                alt="qrcode"
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2 items-center">
                                                        {!envelope.recipient
                                                            .recipientHasRoleDonor && (
                                                            <Button
                                                                type="button"
                                                                className="bg-sky-600 hover:bg-sky-700"
                                                                onClick={() => {
                                                                    setIsReadOnly(
                                                                        false,
                                                                    );
                                                                    handleFillUserData(
                                                                        envelope
                                                                            .recipient
                                                                            .id,
                                                                    );
                                                                }}>
                                                                Modifier info
                                                                perso dest.
                                                            </Button>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() => {
                                                                setIsReadOnly(
                                                                    false,
                                                                );
                                                                handleFillEnvelopeData(
                                                                    envelope.id,
                                                                );
                                                            }}>
                                                            Modifier enveloppe
                                                            info
                                                        </Button>

                                                        <Dropdown
                                                            align="right"
                                                            width="48"
                                                            trigger={
                                                                <button className="flex items-center text-sm font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-50 focus:outline-none">
                                                                    <div>
                                                                        Actions
                                                                    </div>
                                                                    <div className="ml-1">
                                                                        <svg
                                                                            className="w-4 h-4 fill-current"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 20 20">
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </button>
                                                            }>
                                                            {user?.role_names.includes(
                                                                'admin',
                                                            ) && (
                                                                <DropdownButton
                                                                    onClick={() => {
                                                                        handleGenerateQrcode(
                                                                            envelope.id,
                                                                        );
                                                                    }}>
                                                                    Generer QR
                                                                    Code
                                                                </DropdownButton>
                                                            )}
                                                            {envelope.qr_code_id && (
                                                                <DropdownButton
                                                                    onClick={() => {
                                                                        handleEnvelopeWithQrcode(
                                                                            envelope.id,
                                                                        );
                                                                    }}>
                                                                    Generer
                                                                    envelope
                                                                    (Email)
                                                                </DropdownButton>
                                                            )}
                                                            {envelope.envelope_path && (
                                                                <>
                                                                    <DropdownButton
                                                                        onClick={() => {
                                                                            handleDownloadtemplate2(
                                                                                envelope.envelope_path,
                                                                            );
                                                                        }}>
                                                                        Télécharger
                                                                        l'envelope
                                                                        généré (
                                                                        {
                                                                            envelope.template
                                                                        }
                                                                        )
                                                                    </DropdownButton>
                                                                    {envelope.mean_of_delivery ===
                                                                        'email' &&
                                                                        envelope
                                                                            .recipient
                                                                            .email &&
                                                                        !envelope.recipient.email.includes(
                                                                            'fictif',
                                                                        ) && (
                                                                            <DropdownButton
                                                                                onClick={() => {
                                                                                    handleSendEnvelopeByEmail(
                                                                                        envelope.id,
                                                                                    );
                                                                                }}>
                                                                                Envoyer
                                                                                par
                                                                                email
                                                                            </DropdownButton>
                                                                        )}
                                                                </>
                                                            )}
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        total={total}
                    />
                </div>
            </div>
        </>
    );
};

export default EnvelopList;
