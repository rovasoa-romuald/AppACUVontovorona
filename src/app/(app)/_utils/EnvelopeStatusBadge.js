const EnvelopeStatusBadge = ({ status, statusOptions }) => {
    const statusColors = {
        to_be_delivered: 'bg-orange-800 text-orange-100',
        contacted: 'bg-yellow-800 text-yellow-100',
        printed: 'bg-purple-800 text-purple-100',
        delivered: 'bg-blue-800 text-blue-100',
        money_ok: 'bg-green-800 text-green-100',
        lost: 'bg-red-800 text-red-100',
        not_reachable: 'bg-gray-800 text-gray-100',
        invalid_phone: 'bg-gray-800 text-gray-100',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {statusOptions.find(option => option.value === status)?.label}
        </span>
    );
};

export default EnvelopeStatusBadge;
