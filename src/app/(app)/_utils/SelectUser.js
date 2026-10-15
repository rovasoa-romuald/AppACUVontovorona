const { useEffect, useState } = require('react');
import axios from '@/lib/axios';
import Select from '@/components/Select';

const SelectUser = ({
    id,
    name,
    selectedUserId = '',
    handleInputChange,
    isReadOnly = false,
}) => {
    const [responsibleOptions, setResponsibleOptions] = useState([]);

    useEffect(() => {
        axios.get('/api/users/list-options').then(response => {
            if (response.status !== 200) {
                return;
            }
            setResponsibleOptions(response.data);
        });
    }, []);

    return !isReadOnly ? (
        <Select
            id={id}
            name={name}
            value={isNaN(selectedUserId) ? '' : selectedUserId}
            placeholder="-- Séléctionnez ici --"
            onChange={handleInputChange}
            options={responsibleOptions}
            className="p-3 border border-[#f4ea55] rounded-md text-base focus:border-[#f4ea55] outline-none"
            isReadOnly={isReadOnly}
        />
    ) : (
        <p>
            {
                responsibleOptions?.filter(
                    option => option.value === selectedUserId,
                )[0]?.label
            }
        </p>
    );
};

export default SelectUser;
