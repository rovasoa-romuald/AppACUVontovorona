'use client';
import {
    useState,
    useRef,
    useEffect,
    useMemo,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { Search, ChevronDown, X, Check, Loader2 } from 'lucide-react';
import axios from '@/lib/axios';

/**
 * XSelect - An enhanced searchable select component inspired by Livewire's x-select
 *
 * Features:
 * - Single or multiple selection
 * - Async data loading with custom mapping
 * - Debounced search
 * - Clear functionality
 * - Custom option rendering
 * - Forward ref for imperative control
 */
const SearchableSelect = forwardRef(
    (
        {
            // Data sources
            asyncUrl = null,

            // Selection config
            multiple = false,
            value = null,
            onChange = null,
            onClear = null,
            onSelected = null,

            // Field mapping
            optionLabel = 'label',
            optionValue = 'value',
            queryParam = 'search',
            resultsPath = null, // Path to results in API response (e.g., "data" or "data.items")

            // UI configuration
            placeholder = 'Select an option...',
            noOptionsMessage = 'No options found',
            loadingMessage = 'Loading options...',
            minSearchLength = 2,
            searchPrompt = 'Type at least {n} characters to search',
            className = '',
            name = '',

            // Other features
            disabled = false,
            required = false,
            autoFocus = false,

            // Debug
            debug = false,
        },
        ref,
    ) => {
        // State
        const [isOpen, setIsOpen] = useState(false);
        const [searchValue, setSearchValue] = useState('');
        const [selectedOption, setSelectedOption] = useState(null);
        const [selectedOptions, setSelectedOptions] = useState([]);
        const [availableOptions, setAvailableOptions] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);

        // Refs
        const dropdownRef = useRef(null);
        const searchInputRef = useRef(null);
        const searchTimeout = useRef(null);

        // Normalize options to internal format
        const normalizeOption = opt => {
            if (!opt) return null;

            // If option is already in the right format
            if (typeof opt === 'object' && 'value' in opt && 'label' in opt) {
                return opt;
            }

            // If option is an object with custom optionValue/optionLabel
            if (typeof opt === 'object') {
                return {
                    value: opt[optionValue] ?? null,
                    label:
                        opt[optionLabel] ??
                        String(opt[optionValue]) ??
                        'Unknown',
                    _original: opt, // Keep original data
                };
            }

            // If option is a primitive value
            return {
                value: opt,
                label: String(opt),
                _original: opt,
            };
        };

        // Format options
        const formatOptions = opts => {
            if (!opts) return [];
            return Array.isArray(opts) ? opts.map(normalizeOption) : [];
        };

        // Initialize options
        // useEffect(() => {
        //     setAvailableOptions(formatOptions(options));
        // }, [options]);

        // Initialize selected value(s)
        useEffect(() => {
            if (value === null || value === undefined) {
                multiple ? setSelectedOptions([]) : setSelectedOption(null);
                return;
            }

            if (multiple && Array.isArray(value)) {
                // Handle array of values or objects for multiple selection
                const selectedItems = value.map(v => {
                    // Find in options or create a placeholder item
                    if (typeof v === 'object' && v !== null) {
                        return normalizeOption(v);
                    }

                    const found = availableOptions.find(opt => opt.value === v);
                    return found || { value: v, label: String(v) };
                });

                setSelectedOptions(selectedItems);
            } else {
                // Handle single value or object for single selection
                if (typeof value === 'object' && value !== null) {
                    setSelectedOption(normalizeOption(value));
                } else {
                    const found = availableOptions.find(
                        opt => opt.value === value,
                    );
                    setSelectedOption(
                        found ||
                            (value !== null
                                ? { value, label: String(value) }
                                : null),
                    );
                }
            }
        }, [value, multiple, availableOptions]);

        // Expose methods via ref
        useImperativeHandle(ref, () => ({
            clear: () => {
                const newSelectedOptions = multiple ? [] : null;
                setSelectedOptions(newSelectedOptions);

                // Create synthetic event with target containing name and value properties
                if (onChange) {
                    const syntheticEvent = {
                        target: {
                            name: name || asyncUrl.split('/').pop(), // Use provided name or extract from URL
                            value: newSelectedOptions?.value,
                        },
                    };
                    onChange(syntheticEvent);
                }
                if (onClear) onClear();
            },
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
            getValue: () =>
                multiple
                    ? selectedOptions.map(opt => opt.value)
                    : selectedOption?.value || null,
            getFullValue: () =>
                multiple
                    ? selectedOptions.map(
                          opt => opt._original.value || opt.value,
                      )
                    : selectedOption?._original.value || selectedOption.value,
        }));

        // Handle async data fetching
        useEffect(() => {
            if (!asyncUrl || !isOpen) return;

            // Clear any pending timeout
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }

            const shouldLoad =
                searchValue === '' || searchValue.length >= minSearchLength;

            if (shouldLoad) {
                searchTimeout.current = setTimeout(async () => {
                    await handleSetOptions();
                }, 300); // Debounce API calls
            } else {
                setAvailableOptions([]);
            }

            return () => {
                if (searchTimeout.current) {
                    clearTimeout(searchTimeout.current);
                }
            };
        }, [
            searchValue,
            asyncUrl,
            isOpen,
            queryParam,
            minSearchLength,
            resultsPath,
        ]);

        async function handleSetOptions() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(asyncUrl, {
                    params: {
                        [queryParam]: searchValue,
                    },
                });
                if (!response.status === 200) {
                    throw new Error(`Error: ${response.status}`);
                }

                // Extract results based on resultsPath if provided
                let results = response.data;
                // if (resultsPath) {
                //     resultsPath.split('.').forEach(path => {
                //         results = results?.[path];
                //     });
                // }

                // Ensure results is an array
                if (!Array.isArray(results)) {
                    throw new Error('API response is not an array');
                }

                setAvailableOptions(formatOptions(results));
            } catch (err) {
                console.error('Failed to fetch options:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        // Handle filtering local options
        // useEffect(() => {
        //     if (asyncUrl) return; // Skip local filtering if using async
        //     if (searchValue.trim() === '') {
        //         setAvailableOptions(formatOptions(options));
        //     } else {
        //         const filtered = options.filter(option => {
        //             const opt = normalizeOption(option);
        //             return opt.label
        //                 .toLowerCase()
        //                 .includes(searchValue.toLowerCase());
        //         });
        //         setAvailableOptions(formatOptions(filtered));
        //     }
        // }, [searchValue, options, asyncUrl]);

        // Close dropdown when clicking outside
        useEffect(() => {
            handleSetOptions();
            const handleClickOutside = event => {
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(event.target)
                ) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

        // Focus search input when dropdown opens
        useEffect(() => {
            if (isOpen && searchInputRef.current) {
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 10);
            }
        }, [isOpen]);

        // Focus search input on autofocus
        useEffect(() => {
            if (autoFocus && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, [autoFocus]);

        // Handle toggle dropdown
        const handleToggleDropdown = () => {
            if (disabled) return;

            if (!isOpen && asyncUrl && !availableOptions.length) {
                // Load initial options when opening dropdown with async data
                setSearchValue('');
            }

            setIsOpen(!isOpen);
            if (isOpen) {
                setSearchValue('');
            }
        };

        // Handle selection
        const handleSelectOption = option => {
            if (disabled) return;

            if (multiple) {
                // For multiple selection
                const isSelected = selectedOptions.some(
                    item => item.value === option.value,
                );
                let newSelectedOptions;

                if (isSelected) {
                    // Remove option if already selected
                    newSelectedOptions = selectedOptions.filter(
                        item => item.value !== option.value,
                    );
                } else {
                    // Add option if not already selected
                    newSelectedOptions = [...selectedOptions, option];
                }

                setSelectedOptions(newSelectedOptions);

                // Trigger change and selected events
                if (onChange) {
                    const syntheticEvent = {
                        target: {
                            name: name || asyncUrl.split('/').pop(), // Use provided name or extract from URL
                            value: multiple
                                ? newSelectedOptions.map(opt => opt.value)
                                : newSelectedOptions.length
                                  ? newSelectedOptions[0]?.value
                                  : null,
                        },
                    };
                    onChange(syntheticEvent);
                }
                if (onSelected) onSelected(option._original || option);

                // Clear search and keep focus
                setSearchValue('');
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            } else {
                // For single selection
                setSelectedOption(option);
                setIsOpen(false);

                // Trigger change and selected events
                if (onChange) {
                    const syntheticEvent = {
                        target: {
                            name: name || asyncUrl.split('/').pop(), // Use provided name or extract from URL
                            value: option._original?.value || option?.value,
                        },
                    };
                    onChange(syntheticEvent);
                }
                if (onSelected) onSelected(option._original || option);
            }
        };

        // Handle clear selection
        const handleClearSelection = e => {
            e.stopPropagation();

            if (disabled) return;

            const newSelectedOptions = multiple ? [] : null;
            setSelectedOptions(newSelectedOptions);

            // Create synthetic event with target containing name and value properties
            if (onChange) {
                const syntheticEvent = {
                    target: {
                        name: name || asyncUrl.split('/').pop(), // Use provided name or extract from URL
                        value: newSelectedOptions,
                    },
                };
                onChange(syntheticEvent);
            }
            if (onClear) onClear();
        };

        // Handle remove single option from multiple selection
        const removeSelectedOption = (e, optionValue) => {
            e.stopPropagation();

            if (disabled) return;

            const newSelectedOptions = selectedOptions.filter(
                item => item.value !== optionValue,
            );
            setSelectedOptions(newSelectedOptions);

            // Create synthetic event with target containing name and value properties
            if (onChange) {
                const syntheticEvent = {
                    target: {
                        name: name || asyncUrl.split('/').pop(), // Use provided name or extract from URL
                        value: newSelectedOptions.map(
                            opt => opt._original?.value || opt?.value,
                        ),
                    },
                };
                onChange(syntheticEvent);
            }
        };

        // Prepare search prompt message
        const searchPromptMessage = useMemo(() => {
            return searchPrompt.replace('{n}', minSearchLength);
        }, [searchPrompt, minSearchLength]);

        return (
            <div
                className={`relative w-full ${className}`}
                ref={dropdownRef}
                data-testid="x-select">
                {/* Selected display / search input */}
                <div
                    className={`flex items-center justify-between w-full p-3 border rounded-md bg-white ${
                        disabled
                            ? 'bg-gray-100 cursor-not-allowed'
                            : 'cursor-pointer'
                    } ${error ? 'border-red-500' : 'border-gray-300'}`}
                    onClick={handleToggleDropdown}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-disabled={disabled}
                    aria-required={required}>
                    <div className="flex items-center flex-1 min-w-0 overflow-auto">
                        {multiple ? (
                            selectedOptions.length > 0 ? (
                                <div className="flex flex-wrap w-full gap-1">
                                    {selectedOptions.map(option => (
                                        <div
                                            key={option.value}
                                            className={`flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ${
                                                disabled ? 'opacity-60' : ''
                                            }`}>
                                            <span className="max-w-xs truncate">
                                                {option.label}
                                            </span>
                                            {!disabled && (
                                                <button
                                                    type="button"
                                                    onClick={e =>
                                                        removeSelectedOption(
                                                            e,
                                                            option.value,
                                                        )
                                                    }
                                                    className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                                    aria-label={`Remove ${option.label}`}>
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {selectedOptions.length > 0 &&
                                        !disabled && (
                                            <button
                                                type="button"
                                                onClick={handleClearSelection}
                                                className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                aria-label="Clear all selections">
                                                <X size={16} />
                                            </button>
                                        )}
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500">
                                    {placeholder}
                                </span>
                            )
                        ) : selectedOption ? (
                            <div className="flex items-center justify-between w-full">
                                <span className="text-sm truncate">
                                    {selectedOption.label}
                                </span>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={handleClearSelection}
                                        className="p-1 ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        aria-label="Clear selection">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500">
                                {placeholder}
                            </span>
                        )}
                    </div>
                    <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} ${
                            disabled ? 'opacity-60' : ''
                        }`}
                    />
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-1 text-xs text-red-500">{error}</div>
                )}

                {/* Dropdown menu */}
                {isOpen && (
                    <div
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg "
                        role="listbox">
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                zIndex: 1,
                            }}
                            className="flex items-center w-full px-2 py-2 bg-white border-b border-gray-300">
                            <Search size={16} className="mr-2 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="w-full text-sm bg-transparent border-none outline-none focus:border-none"
                                placeholder={
                                    multiple
                                        ? selectedOptions.length > 0
                                            ? 'Add more...'
                                            : placeholder
                                        : selectedOption
                                          ? selectedOption.label
                                          : placeholder
                                }
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                onClick={e => e.stopPropagation()}
                                aria-autocomplete="list"
                            />
                        </div>
                        <div className="overflow-auto max-h-60 py-14">
                            {isLoading ? (
                                <div className="flex items-center justify-center px-3 py-4 text-sm text-gray-500">
                                    <Loader2
                                        size={18}
                                        className="mr-2 animate-spin"
                                    />
                                    <span>{loadingMessage}</span>
                                </div>
                            ) : availableOptions.length > 0 ? (
                                <ul className="py-1">
                                    {availableOptions.map(option => {
                                        const isSelected = multiple
                                            ? selectedOptions.some(
                                                  item =>
                                                      item.value ===
                                                      option.value,
                                              )
                                            : selectedOption?.value ===
                                              option.value;

                                        return (
                                            <li
                                                key={option.value}
                                                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                                                    isSelected
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                                onClick={() =>
                                                    handleSelectOption(option)
                                                }
                                                role="option"
                                                aria-selected={isSelected}>
                                                <span>{option.label}</span>
                                                {isSelected && (
                                                    <Check
                                                        size={16}
                                                        className="text-blue-600"
                                                    />
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : asyncUrl &&
                              searchValue.length < minSearchLength &&
                              searchValue.length > 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    {searchPromptMessage}
                                </div>
                            ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    {noOptionsMessage}
                                </div>
                            )}

                            {/* Debug info */}
                            {debug && (
                                <div className="p-2 text-xs text-gray-500 border-t border-gray-200">
                                    <div>
                                        <strong>Debug:</strong>
                                    </div>
                                    <div>Search: "{searchValue}"</div>
                                    <div>
                                        Options: {availableOptions.length}
                                    </div>
                                    <div>
                                        Selected:{' '}
                                        {multiple
                                            ? selectedOptions
                                                  .map(o => o.value)
                                                  .join(', ')
                                            : selectedOption?.value || 'none'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

SearchableSelect.displayName = 'SearchableSelect';

export default SearchableSelect;
