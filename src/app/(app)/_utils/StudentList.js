'use client';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { AlertContext } from '@/contexts/alertContext';
import Button from '@/components/Button';
import ElderInfoModal from './ElderInfoModal';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Pagination from '@/components/Pagination';
import { ToastContext } from '@/contexts/toastContext';

const StudentDetailList = () => {
    const { showAlert, hideAlert } = useContext(AlertContext);
    const { addToast } = useContext(ToastContext);
    const [users, setUsers] = useState([]);
    const [elder, setElder] = useState({});
    const [isReadonly, setIsReadOnly] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    // const [debouncedTimeout, setDebouncedTimeout] = useState(null);

    const promotionYearOptions = [];
    for (let i = 1985; i <= new Date().getFullYear(); i++) {
        promotionYearOptions.push({ value: i, label: i });
    }

    const columns = [
        'User infos',
        'Promotion / Filière',
        'Ville',
        'Spécial',
        'Actions',
    ];

    const isInfoCompletedOptions = [
        { value: true, label: 'Info complète' },
        { value: false, label: 'Info incomplète' },
    ];
    const isSpecialOptions = [
        { value: true, label: 'Ancien spécial ;-)' },
        { value: false, label: 'Ancien cool :-)' },
    ];
    const isHasResponsibleOptions = [
        { value: 'yes', label: 'Avec responsable' },
        { value: 'no', label: 'Sans responsable' },
    ];

    const getUserList = () => {
        axios
            .get('api/users/list', {
                params: {
                    ...filters,
                    page,
                    perPage,
                },
            })
            .then(res => {
                setUsers(res.data.data);
                setTotal(res.data.total);
            })
            .catch(error => print(error));
    };

    useEffect(() => {
        getUserList();
    }, [filters, page, perPage]);

    const handleSelect = id => {
        const isSelected = selectedUsers.includes(id);
        setSelectedUsers(
            isSelected
                ? selectedUsers.filter(userId => userId !== id)
                : [...selectedUsers, id],
        );
    };

    const handleFillUserData = id => {
        axios
            .get(`api/user/${id}`)
            .then(res => setElder(res.data))
            .catch(error => print(error));
    };

    const handeCreateEnveloppe = id => {
        axios
            .post(`api/jubilee/envelope-create/${id}`)
            .then(res => {
                if (res.status === 201) {
                    // update the list of the user to have has_jubilee_envelope set to true for this id
                    users.map(user => {
                        if (user.id === id) {
                            user.has_jubilee_envelope = true;
                        }
                    });
                    addToast("L'enveloppe a bien ete créée");
                } else {
                    addToast("Une erreur s'est produite", 'error');
                }
                hideAlert();
            })
            .catch(error => print(error));
        //     },
        // );
    };

    const handleDeleteSelected = () => {
        axios
            .post('api/users/delete-selected', {
                ids: selectedUsers,
            })
            .then(res => {
                setUsers(
                    users.filter(user => !selectedUsers.includes(user.id)),
                );
                setSelectedUsers([]);
                if (res.status === 204 || res.status === 500) {
                    hideAlert();
                }
            })
            .catch(error => print(error));
    };
    const handleMarkSpecialSelected = () => {
        axios
            .post('api/users/mark-sepecial-elder-selected', {
                ids: selectedUsers,
            })
            .then(res => {
                setUsers(
                    users.filter(user => !selectedUsers.includes(user.id)),
                );
                setSelectedUsers([]);
                if (res.status === 204 || res.status === 500) {
                    hideAlert();
                    getUserList();
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

    // const handleSetFiltersDebounced = event => {
    //     if (debouncedTimeout) {
    //         clearTimeout(debouncedTimeout);
    //     }
    //     setDebouncedTimeout(
    //         setTimeout(() => {
    //             handleSetFilters(event);
    //         }, 500),
    //     );
    // };
    return (
        <>
            <ElderInfoModal
                elder={elder}
                isOpen={!!elder.id}
                onClose={() => {
                    setElder({});
                    getUserList();
                }}
                isReadOnly={isReadonly}
            />
            <div className="flex mb-4 space-x-2 overflow-auto">
                <Input
                    name="firstLastName"
                    id="firstLastName"
                    value={filters.firstLastName}
                    onChange={handleSetFilters}
                    placeholder="Chercher par nom ou prénoms"
                    className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
                    required
                />
                <Select
                    id="promoYear"
                    name="promoYear"
                    value={filters.promoYear}
                    placeholder="-- Filtrer par promotion --"
                    onChange={handleSetFilters}
                    options={promotionYearOptions}
                    className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none w-60"
                />
                <Select
                    id="elderInfoOk"
                    name="elderInfoOk"
                    value={filters.elderInfoOk}
                    placeholder="-- Completion info ancien --"
                    onChange={handleSetFilters}
                    options={isInfoCompletedOptions}
                    className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none w-60"
                />
                <Select
                    id="isSpecial"
                    name="isSpecial"
                    value={filters.isSpecial}
                    placeholder="-- Filter par comportement --"
                    onChange={handleSetFilters}
                    options={isSpecialOptions}
                    className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none w-60"
                />
                <Select
                    id="isHasResponsible"
                    name="isHasResponsible"
                    value={filters.isHasResponsible}
                    placeholder="-- Avec ou sans responsable ? --"
                    onChange={handleSetFilters}
                    options={isHasResponsibleOptions}
                    className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none w-60"
                />
                <div className="content-center text-right">
                    <span className="text-xl font-bold">
                        {' '}
                        Nombre total de la recherche: {total}
                    </span>
                </div>
            </div>
            <div>
                {selectedUsers.length > 0 && (
                    <div className="flex items-center justify-end mb-4">
                        <button
                            type="button"
                            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-orange-600 dark:hover:orange-red-700 dark:focus:ring-orange-800"
                            onClick={() => {
                                showAlert(
                                    'Souhaitez-vous signaler ces anciens pour une approche prudente ?',
                                    'warning',
                                    () => hideAlert(),
                                    () => {
                                        handleMarkSpecialSelected();
                                    },
                                );
                            }}>
                            Marquer comme spécial
                        </button>
                        <button
                            type="button"
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            onClick={() => {
                                showAlert(
                                    'Etes vous sur de vouloir supprimer ces éléments ?',
                                    'warning',
                                    () => hideAlert(),
                                    () => {
                                        handleDeleteSelected();
                                    },
                                );
                            }}>
                            Supprimer les éléments sélectionnés
                        </button>
                    </div>
                )}
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input
                                                id="checkbox-all-search"
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                onChange={e =>
                                                    setSelectedUsers(
                                                        e.target.checked
                                                            ? users.map(
                                                                  user =>
                                                                      user.id,
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
                                {users.map(user => (
                                    <tr
                                        key={user.id}
                                        className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id={`checkbox-table-search-${user.id}`}
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    checked={selectedUsers.includes(
                                                        user.id,
                                                    )}
                                                    onChange={() =>
                                                        handleSelect(user.id)
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td
                                            scope="row"
                                            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">
                                                    {user.civility}{' '}
                                                    {user.first_name}{' '}
                                                    {user.last_name}
                                                </div>
                                                <div className="font-normal text-gray-500">
                                                    {user.email} / {user.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.promotion_name} /{' '}
                                            {user.promotion_year} /{' '}
                                            {user.espa_field}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {user.nearest_city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {user.is_special ? (
                                                    <span className="text-4xl font-extrabold text-red-700">
                                                        x
                                                    </span>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsReadOnly(true);
                                                        handleFillUserData(
                                                            user.id,
                                                        );
                                                    }}>
                                                    Détail
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsReadOnly(false);
                                                        handleFillUserData(
                                                            user.id,
                                                        );
                                                    }}>
                                                    Modifier
                                                </Button>
                                                {!user.has_jubilee_envelope && (
                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsReadOnly(
                                                                false,
                                                            );
                                                            handeCreateEnveloppe(
                                                                user.id,
                                                            );
                                                        }}>
                                                        Créer une enveloppe
                                                    </Button>
                                                )}
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
        </>
    );
};

export default StudentDetailList;
