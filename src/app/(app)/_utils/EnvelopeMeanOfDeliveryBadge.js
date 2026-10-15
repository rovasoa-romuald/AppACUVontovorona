const EnvelopeMeanOfDeliveryBadge = ({
    mean_of_delivery,
    meanDeliveryOptions,
}) => {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                mean_of_delivery === 'email'
                    ? 'bg-blue-800 text-blue-100'
                    : 'bg-yellow-800 text-yellow-100'
            }`}>
            {
                meanDeliveryOptions.find(
                    option => option.value === mean_of_delivery,
                )?.label
            }
        </span>
    );
};

export default EnvelopeMeanOfDeliveryBadge;
