'use client';
import { useState } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Pagination from '@/components/Pagination';
import { useAuth } from '@/hooks/auth';
import { AlertContext } from '@/contexts/alertContext';
import { useContext } from 'react';

// import { ToastContext } from '@/contexts/toastContext';
// import { AlertContext } from '@/contexts/alertContext';
// import Select from '@/components/Select';
// import { useContext } from 'react';

const CensusContent = ({
    student,
    census,
    setStudent,
    setCensus,
    setMode,
    users,
    page,
    setPage,
    perPage,
    setPerPage,
    total,
    filters,
    setFilters,
}) => {
    const { showAlert, hideAlert } = useContext(AlertContext);
    const { user } = useAuth();
    // const { showAlert, hideAlert } = useContext(AlertContext);
    // const { addToast } = useContext(ToastContext);
    // const [elder, setElder] = useState({});
    // const [isReadonly, setIsReadOnly] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    // const [debouncedTimeout, setDebouncedTimeout] = useState(null);

    const columns = [
        'Nom et prénoms',
        'Filière / Niveau - Bloc / Porte',
        'Actions',
    ];

    const handleSelect = id => {
        const isSelected = selectedUsers.includes(id);
        setSelectedUsers(
            isSelected
                ? selectedUsers.filter(userId => userId !== id)
                : [...selectedUsers, id],
        );
    };

    const handleFillStudentData = id => {
        axios
            .get(`api/student/${id}`)
            .then(res => setStudent(res.data))
            .catch(error => print(error));
    };

    const handleFillCensusData = id => {
        axios
            .get(`api/census/${id}`)
            .then(res => setCensus(res.data))
            .catch(error => print(error));
    };

    const handleInitiateCensusData = id => {
        setCensus({
            user_id: id,
            is_off_campus: false,
            is_stay_weekend: false,
            census_year: new Date().getFullYear(),
        });
    };

    // const handleDeleteSelected = () => {
    //     axios
    //         .post('api/users/delete-selected', {
    //             ids: selectedUsers,
    //         })
    //         .then(res => {
    //             setUsers(
    //                 users.filter(user => !selectedUsers.includes(user.id)),
    //             );
    //             setSelectedUsers([]);
    //             if (res.status === 204 || res.status === 500) {
    //                 hideAlert();
    //             }
    //         })
    //         .catch(error => print(error));
    // };

    const handleSetFilters = event => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
    };

    const handleProcessPwdGeneration = id => {
        axios
            .post('api/create-pwd-account', {
                id: id,
                role: 'universitaire',
            })
            .then(res => {
                if (res.status === 204 || res.status === 500) {
                    hideAlert();
                }
                showAlert(
                    'Here is the new password: ' + res.data.pwd,
                    'success',
                    () => hideAlert(),
                    () => hideAlert(),
                );
            })
            .catch(error => {
                print(error);
                hideAlert();
            });
    };
    return (
        <>
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
                <div className="content-center text-right">
                    <span className="text-xl font-bold">
                        Nombre total de la recherche: {total}
                    </span>
                </div>
            </div>
            <div>
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
                                {users.map(stdt => (
                                    <tr
                                        key={stdt.id}
                                        className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id={`checkbox-table-search-${stdt.id}`}
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    checked={selectedUsers.includes(
                                                        stdt.id,
                                                    )}
                                                    onChange={() =>
                                                        handleSelect(stdt.id)
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td
                                            scope="row"
                                            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">
                                                    {stdt.full_name}
                                                </div>
                                                <div className="font-normal text-gray-500">
                                                    {stdt.email} / {stdt.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {stdt.major_abbr &&
                                                stdt.level_abbr && (
                                                    <div className="flex items-center">
                                                        {stdt.major_abbr} /{' '}
                                                        {stdt.level_abbr}
                                                    </div>
                                                )}
                                            {stdt.block && stdt.door_number && (
                                                <div className="flex items-center">
                                                    Bloc {stdt.block} / Porte{' '}
                                                    {stdt.door_number}
                                                </div>
                                            )}
                                            {!!stdt.is_off_campus && (
                                                <div className="flex items-center">
                                                    Hors campus
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(user?.role_names.includes(
                                                'admin',
                                            ) ||
                                                user?.role_names.includes(
                                                    'universitaire',
                                                )) && (
                                                <div className="flex items-center space-x-2">
                                                    {student.id !== stdt.id && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                setMode(
                                                                    'student',
                                                                );
                                                                setCensus({});
                                                                handleFillStudentData(
                                                                    stdt.id,
                                                                );
                                                            }}>
                                                            Modifier l'info
                                                            perso
                                                        </Button>
                                                    )}
                                                    {stdt.census_id ? (
                                                        census.id !==
                                                            stdt.census_id && (
                                                            <Button
                                                                type="button"
                                                                onClick={() => {
                                                                    setMode(
                                                                        'census',
                                                                    );
                                                                    setStudent(
                                                                        {},
                                                                    );
                                                                    handleFillCensusData(
                                                                        stdt.census_id,
                                                                    );
                                                                }}>
                                                                Modifier la
                                                                récensement
                                                            </Button>
                                                        )
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                setMode(
                                                                    'census',
                                                                );
                                                                setStudent({});
                                                                handleInitiateCensusData(
                                                                    stdt.id,
                                                                );
                                                            }}>
                                                            Récenser
                                                        </Button>
                                                    )}

                                                    {user?.role_names.includes(
                                                        'admin',
                                                    ) && (
                                                        <button
                                                            type="button"
                                                            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-orange-600 dark:hover:orange-red-700 dark:focus:ring-orange-800"
                                                            onClick={() => {
                                                                handleProcessPwdGeneration(
                                                                    stdt.id,
                                                                );
                                                            }}>
                                                            Create PWD
                                                        </button>
                                                    )}
                                                </div>
                                            )}
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

export default CensusContent;
