import React from 'react';

const Alert = ({
    message,
    type,
    onAccept,
    onRefuse,
    alertTitle = 'Attention!!',
}) => {
    const className = type === 'success' ? 'bg-green-100 ' : 'bg-red-100 ';

    return (
        message &&
        type &&
        onAccept &&
        onRefuse && (
            <div
                className={`fixed top-0 left-0 w-full h-full bg-white bg-opacity-70 z-50`}
                onClick={onRefuse}>
                <div
                    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${className} border rounded-lg p-4 border-white-500 `}
                    style={{ backgroundColor: 'rgba(240,240,240,0.5)' }}
                    onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-600">
                                {alertTitle}
                            </h3>
                        </div>
                        <div className="mt-2">
                            <p className="text-gray-500">{message}</p>
                        </div>
                        <div
                            className="flex justify-between mt-4 space-x-4
                            ">
                            <button
                                className={`w-full px-4 py-2 text-white ${
                                    type === 'success'
                                        ? 'bg-green-600'
                                        : 'bg-red-600'
                                } rounded-md`}
                                onClick={onAccept}>
                                Accepter
                            </button>
                            <button
                                className={`w-full px-4 py-2 text-white bg-gray-600 rounded-md`}
                                onClick={onRefuse}>
                                Refuser
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default Alert;
