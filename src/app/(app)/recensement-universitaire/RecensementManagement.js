'use client';

// RecensementManagement.js
// Refactored for clarity and maintainability
import Button from '@/components/Button';
import CensusContent from '@/app/(app)/_utils/CensusContent';
import StudentInfoForm from '../_utils/StudentInfoForm';
import CensusForm from '../_utils/CensusForm';
import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';
import { Plus } from 'lucide-react';

const DEFAULT_STUDENT = {
    civility: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    diocese: '',
    social_network_id: '',
    id: '',
};
const DEFAULT_CENSUS = {
    major_id: '',
    level_id: '',
    user_id: '',
    census_year: 2025,
    block: '',
    door_number: '',
    is_off_campus: false,
    is_stay_weekend: false,
    id: '',
};

const Recensement = () => {
    const { user } = useAuth();
    const [studentOption, setStudentOption] = useState([]);
    const [mode, setMode] = useState('');
    const [studentInitValue, setStudentInitValue] = useState(DEFAULT_STUDENT);
    const [censusInitValue, setCensusInitValue] = useState(DEFAULT_CENSUS);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // Fetch list of users for census management
    const getUserList = useCallback(() => {
        axios
            .get('api/last-census/content', {
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
            .catch(error => console.error(error));
    }, [filters, page, perPage]);

    // Fetch user list when filters or pagination change
    useEffect(() => {
        getUserList();
    }, [getUserList]);

    // Helper components for each mode
    const StudentFormSection = useCallback(
        () => (
            <div>
                <h2 className="mb-4 text-2xl font-semibold">
                    1/2. Informations personnelles
                </h2>
                <StudentInfoForm
                    onSkip={() => setMode('')}
                    skipText="Annuler"
                    onCreatedSuccessfully={data => {
                        const censusInit = {
                            ...DEFAULT_CENSUS,
                            user_id: data.id,
                        };
                        handleInitiateCensusValue(censusInit);
                        setStudentInitValue(data);
                        setStudentOption(prev => [
                            ...prev,
                            { value: data.id, label: data.name },
                        ]);
                        getUserList();
                    }}
                    onUpdatedSuccessfully={getUserList}
                    studentInitValue={studentInitValue}
                />
            </div>
        ),
        [studentInitValue, getUserList],
    );

    const CensusFormSection = useCallback(
        () => (
            <div>
                <h2 className="mb-4 text-2xl font-semibold">
                    2/2. Informations de recensement
                </h2>
                <CensusForm
                    users={studentOption}
                    onCreatedSuccessfully={() => {
                        setCensusInitValue(DEFAULT_CENSUS);
                        getUserList();
                    }}
                    onUpdatedSuccessfully={() => {
                        setCensusInitValue(DEFAULT_CENSUS);
                        getUserList();
                    }}
                    censusInitValue={censusInitValue}
                    onSkip={() => setMode('student')}
                />
            </div>
        ),
        [studentOption, censusInitValue, getUserList],
    );

    // Handler to initiate census step
    const handleInitiateCensusValue = useCallback(data => {
        setCensusInitValue(data);
        setMode('census');
    }, []);

    // Memoize which form to show based on mode
    const formComponent = useMemo(() => {
        if (mode === 'student') return <StudentFormSection />;
        if (mode === 'census' && censusInitValue.user_id)
            return <CensusFormSection />;
        return null;
    }, [mode, StudentFormSection, CensusFormSection, censusInitValue]);

    // Only admins/universitaires can add students/census
    return (
        <div className="mx-auto w-[95%] sm:px-6 lg:px-8">
            {['admin', 'universitaire'].some(role =>
                user?.role_names.includes(role),
            ) && (
                <>
                    {mode === '' && (
                        <Button
                            type="button"
                            className="mb-4 text-white bg-green-500 hover:bg-green-600"
                            onClick={() => setMode('student')}>
                            <Plus className="mr-2" />
                            Ajouter un etudiant
                        </Button>
                    )}
                    {formComponent}
                </>
            )}
            <CensusContent
                setMode={setMode}
                student={studentInitValue}
                census={censusInitValue}
                setStudent={setStudentInitValue}
                setCensus={setCensusInitValue}
                users={users}
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                total={total}
                filters={filters}
                setFilters={setFilters}
            />
        </div>
    );
};

export default Recensement;
