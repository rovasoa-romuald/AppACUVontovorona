'use client';
// src/pages/donors.js
import { useState, useEffect, useContext } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Save,
    Building,
    User,
    Phone,
    Mail,
    MapPin,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MailPlus,
} from 'lucide-react';
import axios from '@/lib/axios';
import { ToastContext } from '@/contexts/toastContext';
import { AlertContext } from '@/contexts/alertContext';
import Label from '@/components/Label';
import Select from '@/components/Select';
import { useAuth } from '@/hooks/auth';
import { BotMessageSquare } from 'lucide-react';

export default function DonorManagement() {
    const { user } = useAuth({ middleware: 'guest' });
    // State management
    const [donors, setDonors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingDonor, setEditingDonor] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formError, setFormError] = useState({});
    const { addToast } = useContext(ToastContext);
    const { showAlert, hideAlert } = useContext(AlertContext);

    // Searching
    const [filters, setFilters] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    // New donor template
    const emptyDonor = {
        id: '',
        name: '',
        first_name: '',
        email: '',
        type: 'individual',
        my_job: '',
        phone: [''],
        address: '',
    };

    // Form state for new/editing donor
    const [formData, setFormData] = useState(emptyDonor);

    // Fetch donors on component mount or when pagination/search changes
    useEffect(() => {
        fetchDonors();
    }, [currentPage, itemsPerPage, filters]);

    // Mock function to fetch donors - replace with actual API call
    const fetchDonors = async () => {
        setIsLoading(true);
        try {
            // Replace with actual API endpoint
            // In a real application, you would pass pagination params
            const response = await axios.get(`/api/donors`, {
                params: {
                    ...filters,
                    page: currentPage,
                    perPage: itemsPerPage,
                },
            });
            const data = response.data.data;
            setDonors(data);
            setTotalItems(response.data.total);
        } catch (error) {
            setFormError(error.response.data.errors);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateFictiveEmail = () => {
        axios.get('/api/generate-fictive-email').then(res => {
            setFormData({ ...formData, email: res.data.email });
        });
    };

    // Calculate pagination
    const totalPages = Math.ceil((totalItems || 0) / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDonors =
        donors && donors.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Handle form input changes
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (formError[name]) {
            setFormError(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle phone number changes
    const handlePhoneChange = (index, value) => {
        const updatedPhones = [...formData.phone];
        updatedPhones[index] = value;
        setFormData(prev => ({ ...prev, phone: updatedPhones }));
    };

    // Add new phone field
    const addPhoneField = () => {
        setFormData(prev => ({
            ...prev,
            phone: prev.phone ? [...prev.phone, ''] : [''],
        }));
    };

    // Remove phone field
    const removePhoneField = index => {
        const updatedPhones = [...formData.phone];
        updatedPhones.splice(index, 1);
        setFormData(prev => ({ ...prev, phone: updatedPhones }));
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = 'Name is required';
        if (formData.type === 'individual' && !formData.first_name?.trim()) {
            errors.first_name = 'First name is required for individuals';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        return errors;
    };

    // Submit form (create/update donor)
    const handleSubmit = async e => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            return;
        }

        try {
            if (isCreating) {
                // Create new donor
                // In a real application, this would be an API call
                const response = await axios.post('/api/donors', formData);
                const newDonor = response.data;

                setDonors(prev => [...prev, newDonor]);
                setTotalItems(prev => prev + 1);
            } else if (editingDonor) {
                // Update existing donor
                // In a real application, this would be an API call
                const response = await axios.put(
                    `/api/donors/${formData.id}`,
                    formData,
                );
                const updatedDonor = response.data;

                // Mock update
                setDonors(prev =>
                    prev.map(donor =>
                        donor.id === updatedDonor.id ? updatedDonor : donor,
                    ),
                );
            }
            fetchDonors();
            // Reset form and editing state
            cancelForm();
        } catch (error) {
            setFormError(error.response.data.errors);
        }
    };

    // Delete donor
    const handleDelete = async id => {
        if (!confirm('Are you sure you want to delete this donor?')) return;

        try {
            // In a real application, this would be an API call
            await axios.delete(`/api/donors/${id}`);

            // Update local state
            setDonors(prev => prev.filter(donor => donor.id !== id));
            setTotalItems(prev => prev - 1);

            // Adjust current page if needed
            if (currentDonors.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        } catch (error) {
            console.error('Error deleting donor:', error);
        }
    };

    // Start editing a donor
    const startEdit = donor => {
        setFormData({ ...donor });
        setEditingDonor(donor.id);
        setIsCreating(false);
        setFormError({});
    };

    // Start creating a new donor
    const startCreate = () => {
        setFormData(emptyDonor);
        setIsCreating(true);
        setEditingDonor(null);
        setFormError({});
    };

    // Cancel form (editing/creating)
    const cancelForm = () => {
        setFormData(emptyDonor);
        setEditingDonor(null);
        setIsCreating(false);
        setFormError({});
    };

    // Pagination controls
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () =>
        setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Handle items per page change
    const handleItemsPerPageChange = e => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handeCreateEnveloppe = id => {
        axios
            .post(`api/jubilee/envelope-create/${id}`)
            .then(res => {
                if (res.status === 201) {
                    // update the list of the user to have has_jubilee_envelope set to true for this id
                    donors.map(donor => {
                        if (donor.id === id) {
                            donor.has_jubilee_envelope = true;
                        }
                    });
                    addToast("L'enveloppe a bien ete créée");
                } else {
                    addToast("Une erreur s'est produite", 'error');
                }
                hideAlert();
            })
            .catch(error => print(error));
    };

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Donor Management</h1>

            {/* Search and Add New Donor */}
            <div className="flex flex-col gap-4 justify-between items-start mb-6 md:flex-row md:items-center">
                <div className="relative w-full md:w-64">
                    <input
                        name="search"
                        type="text"
                        placeholder="Search donors..."
                        className="py-2 pr-4 pl-10 w-full rounded-lg border"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                    <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
                </div>

                {!isCreating && !editingDonor && (
                    <button
                        onClick={startCreate}
                        className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition hover:bg-blue-700">
                        <Plus size={20} />
                        <span>Add Donor</span>
                    </button>
                )}
            </div>

            {/* Form for Creating/Editing */}
            {(isCreating || editingDonor) && (
                <div className="p-6 mb-8 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {isCreating ? 'Add New Donor' : 'Edit Donor'}
                        </h2>
                        <button
                            onClick={cancelForm}
                            className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2">
                            {/* Donor Type */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Donor Type*
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="individual"
                                            checked={
                                                formData.type === 'individual'
                                            }
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span>Individual</span>
                                    </label>
                                    <label className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="organization"
                                            checked={
                                                formData.type === 'organization'
                                            }
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span>Organization</span>
                                    </label>
                                </div>
                            </div>

                            {/* First Name (for individuals) */}
                            {formData.type === 'individual' && (
                                <div>
                                    <Label
                                        htmlFor="civility"
                                        className="text-[#074c8f] font-bold mb-2">
                                        Civilité
                                    </Label>
                                    <Select
                                        id="civility"
                                        name="civility"
                                        value={formData.civility ?? ''}
                                        placeholder="-- Séléctionnez ici --"
                                        onChange={handleInputChange}
                                        options={[
                                            {
                                                value: 'Mademoiselle',
                                                label: 'Mlle.',
                                            },
                                            { value: 'Monsieur', label: 'M.' },
                                            { value: 'Madame', label: 'Mme.' },
                                        ]}
                                    />
                                    {formError.civility && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formError.civility}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Name fields */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Name*
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border rounded ${formError.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder={
                                        formData.type === 'individual'
                                            ? 'Last name'
                                            : 'Organization name'
                                    }
                                />
                                {formError.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {formError.name}
                                    </p>
                                )}
                            </div>

                            {/* First Name (for individuals) */}
                            {formData.type === 'individual' && (
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        First Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name ?? ''}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded ${formError.first_name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formError.first_name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formError.first_name}
                                        </p>
                                    )}
                                </div>
                            )}
                            {formData.type === 'individual' && (
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Titre ou fonction actuelle
                                    </label>
                                    <input
                                        type="text"
                                        name="my_job"
                                        value={formData.my_job ?? ''}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded ${formError.my_job ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formError.my_job && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formError.my_job}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Email*
                                </label>
                                <div className="flex">
                                    {!formData.email && user && (
                                        <button
                                            type="button"
                                            onClick={handleGenerateFictiveEmail}
                                            title="Je n'ai pas d'email, générer un email fictif pour moi"
                                            className="inline-block mr-2 text-gray-500 hover:text-gray-700">
                                            <BotMessageSquare />
                                        </button>
                                    )}
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border rounded ${formError.email ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                {formError.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {formError.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone Numbers */}
                            <div className="md:col-span-2">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Phone Numbers
                                </label>
                                {formData.phone &&
                                    formData.phone.map((phone, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={e =>
                                                    handlePhoneChange(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 p-2 rounded border border-gray-300"
                                                placeholder="Phone number"
                                            />
                                            {formData.phone.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removePhoneField(index)
                                                    }
                                                    className="p-2 text-red-500 hover:text-red-700">
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                <button
                                    type="button"
                                    onClick={addPhoneField}
                                    className="flex gap-1 items-center mt-1 text-sm text-blue-600">
                                    <Plus size={16} />
                                    <span>Add another phone number</span>
                                </button>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    className="p-2 w-full rounded border border-gray-300"
                                    rows="3"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 justify-end mt-6">
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                <Save size={18} />
                                <span>Save Donor</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Donors List */}
            {isLoading ? (
                <div className="py-10 text-center">
                    <div className="inline-block w-8 h-8 rounded-full border-4 border-blue-600 border-solid animate-spin border-r-transparent" />
                    <p className="mt-2">Loading donors...</p>
                </div>
            ) : !donors || (donors && donors.length === 0) ? (
                <div className="py-10 text-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No donors found</p>
                    {filters.search && (
                        <p className="mt-1 text-sm text-gray-400">
                            Try adjusting your search term
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Donor
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Contact
                                    </th>
                                    <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {donors.map(donor => (
                                    <tr
                                        key={donor.id}
                                        className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 text-gray-500 bg-gray-100 rounded-full">
                                                    {donor.type ===
                                                    'individual' ? (
                                                        <User size={20} />
                                                    ) : (
                                                        <Building size={20} />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">
                                                        {donor.type ===
                                                        'individual'
                                                            ? `${donor.civility || ''} ${donor.first_name} ${donor.name} (${donor.my_job})`
                                                            : donor.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {donor.type ===
                                                        'individual'
                                                            ? 'Individual'
                                                            : 'Organization'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Mail
                                                        size={14}
                                                        className="mr-1"
                                                    />{' '}
                                                    {donor.email}
                                                </div>
                                                {donor.phone &&
                                                    donor.phone.length > 0 && (
                                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                                            <Phone
                                                                size={14}
                                                                className="mr-1"
                                                            />{' '}
                                                            {donor.phone[0]}
                                                            {donor.phone
                                                                .length > 1 && (
                                                                <span className="ml-1 text-xs text-blue-500">
                                                                    +
                                                                    {donor.phone
                                                                        .length -
                                                                        1}{' '}
                                                                    more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="hidden px-6 py-4 md:table-cell">
                                            {donor.address ? (
                                                <div className="flex items-start text-sm text-gray-500">
                                                    <MapPin
                                                        size={14}
                                                        className="flex-shrink-0 mt-1 mr-1"
                                                    />
                                                    <span>{donor.address}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    Not provided
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() =>
                                                        startEdit(donor)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(donor.id)
                                                    }
                                                    className="text-red-600 hover:text-red-800">
                                                    <Trash2 size={18} />
                                                </button>
                                                {!donor.has_jubilee_envelope && (
                                                    <button
                                                        onClick={() =>
                                                            showAlert(
                                                                'Vous êtes sur le point de créer un enveloppe pour ce donateur. Voulez-vous continuer?',
                                                                'warning',
                                                                () =>
                                                                    hideAlert(),
                                                                () =>
                                                                    handeCreateEnveloppe(
                                                                        donor.id,
                                                                    ),
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-800">
                                                        <MailPlus size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex flex-col justify-between items-center mt-6 sm:flex-row">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <span className="mr-4 text-sm text-gray-700">
                                Showing {indexOfFirstItem + 1}-
                                {Math.min(indexOfLastItem, totalItems)} of{' '}
                                {totalItems} donors
                            </span>
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="p-1 text-sm rounded border">
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>

                        <div className="flex">
                            <button
                                onClick={goToFirstPage}
                                disabled={currentPage === 1}
                                className="px-2 py-1 text-gray-600 bg-white rounded-l border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronsLeft size={18} />
                            </button>
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="px-2 py-1 text-gray-600 bg-white border-t border-r border-b hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex">
                                {/* Show page numbers with ellipsis for large page counts */}
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNumber = i + 1;
                                    // Always show first page, last page, current page and pages close to current
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 &&
                                            pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() =>
                                                    paginate(pageNumber)
                                                }
                                                className={`px-3 py-1 border-t border-b border-r ${
                                                    currentPage === pageNumber
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                                }`}>
                                                {pageNumber}
                                            </button>
                                        );
                                    }
                                    // Show ellipsis
                                    if (
                                        (pageNumber === 2 && currentPage > 3) ||
                                        (pageNumber === totalPages - 1 &&
                                            currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span
                                                key={pageNumber}
                                                className="px-3 py-1 text-gray-600 bg-white border-t border-r border-b">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 text-gray-600 bg-white border-t border-r border-b hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={goToLastPage}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 text-gray-600 bg-white rounded-r border-t border-r border-b hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronsRight size={18} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
