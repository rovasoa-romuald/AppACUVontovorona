'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
const Cards = () => {
    const [data, setData] = useState([]);
    const colors = {
        red: 'text-red-600',
        green: 'text-green-600',
        blue: 'text-blue-600',
    };
    useEffect(() => {
        axios.get('/api/dashboard/data').then(res => setData(res.data));
    }, []);
    return (
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
            {data &&
                data.length > 0 &&
                data.map((reporting, idx) => (
                    <div
                        key={'dashboard-card-' + idx}
                        className="p-5 bg-white border-b-4 border-green-600 rounded-lg shadow-xl bg-gradient-to-b">
                        <div className="flex flex-row items-center">
                            {/* eslint-disable-next-line react/self-closing-comp */}
                            <div className="flex-shrink pr-4"></div>
                            <div className="flex-1 text-right md:text-center">
                                <h5
                                    className={`font-bold ${colors[reporting?.color] ?? 'text-gray-600'} uppercase`}>
                                    {reporting.label}
                                </h5>
                                <h3
                                    className={`text-3xl ${colors[reporting?.color] ?? 'text-gray-600'} font-bold`}>
                                    {reporting.value}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};
export default Cards;
