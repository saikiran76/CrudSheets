import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/Button';
import useUndo from 'use-undo';

const Sheet = () => {
    const [data, { set: setDataState, undo, redo, canUndo, canRedo }] = useUndo([]);
    const presentData = data.present;
    const [columns, setColumns] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    const [newValue, setNewValue] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [dates, setDates] = useState([]);

    useEffect(() => {
        fetchDates();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchData(selectedDate);
        } else {
            fetchData();
        }
    }, [selectedDate]);

    const fetchDates = async () => {
        try {
            const result = await axios.get('https://crudsheets-production.up.railway.app/api/spreadsheet/dates');
            setDates(result.data);
        } catch (error) {
            console.error('Error fetching dates:', error);
        }
    };

    const fetchData = async (date) => {
        try {
            const result = await axios.get('https://crudsheets-production.up.railway.app/api/spreadsheet', {
                params: { date }
            });
            const fetchedData = result.data.map(row => ({
                id: row.id,
                ...row.data
            }));
            setDataState(fetchedData);
            setColumns(Object.keys(fetchedData[0] || {}));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEdit = (rowIndex, colKey) => {
        setEditingCell({ rowIndex, colKey });
        setNewValue(presentData[rowIndex][colKey]);
    };

    const handleChange = (e) => {
        setNewValue(e.target.value);
    };

    const handleSave = async () => {
        const { rowIndex, colKey } = editingCell;
        const updatedData = [...presentData];
        updatedData[rowIndex][colKey] = newValue;
        setDataState(updatedData);
        setEditingCell(null);

        try {
            await axios.put(`https://crudsheets-production.up.railway.app/api/spreadsheet/${presentData[rowIndex].id}`, { [colKey]: newValue });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleAddRow = async () => {
        const newRow = columns.reduce((acc, col) => {
            acc[col] = '';
            return acc;
        }, {});

        try {
            const result = await axios.post('https://crudsheets-production.up.railway.app/api/spreadsheet', { data: newRow });
            setDataState([...presentData, result.data]);
        } catch (error) {
            console.error('Error adding row:', error);
            const newRowWithId = { id: presentData.length + 1, ...newRow };
            setDataState([...presentData, newRowWithId]);
        }
    };

    const handleAddColumn = () => {
        const newColumn = `column${columns.length + 1}`;
        setColumns([...columns, newColumn]);
        const updatedData = presentData.map(row => ({ ...row, [newColumn]: '' }));
        setDataState(updatedData);
    };

    const handleDeleteRow = async (rowIndex) => {
        const id = presentData[rowIndex].id;

        if (!id) {
            console.error('Error: No ID found for the row.');
            return;
        }

        try {
            await axios.delete(`https://crudsheets-production.up.railway.app/api/spreadsheet/${id}`);
            const updatedData = presentData.filter((_, index) => index !== rowIndex);
            setDataState(updatedData);
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await axios.post('https://crudsheets-production.up.railway.app/api/spreadsheet/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDataState(result.data.map(row => ({
                id: row.id,
                ...row.data
            })));
            setColumns(Object.keys(result.data[0].data || {}));
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleBlur = async () => {
        if (editingCell) {
            await handleSave();
        }
    };

    useEffect(() => {
        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, [editingCell]);

    return (
        <div className="mx-auto bg-custom-gradient font-poppin">
            <Button name="Add Row" handler={handleAddRow} />
            <input type="file" onChange={handleUpload} className="m-6" />
            <select value={selectedDate} onChange={handleDateChange} className="m-6">
                <option value="">Select Date</option>
                {dates.map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                ))}
            </select>
            <div className="overflow-x-auto m-8 rounded-lg border-gray-400 border-1 shadow-md bg-inherit backdrop-blur-md">
                <table className="min-w-full bg-[#293548] shadow-md bg-inherit backdrop-blur-md">
                    <thead>
                        <tr className='text-[#35B0E9]'>
                            {columns.map((col, index) => (
                                <th key={index} className="py-2 px-4 border-b">{col}</th>
                            ))}
                            <th className="py-2 px-4 border-b">Actions</th>
                            <th className="py-2 px-4 border-b">+</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presentData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((colKey, colIndex) => (
                                    <td key={colIndex} className="py-2 px-4 border-b" onDoubleClick={() => handleEdit(rowIndex, colKey)}>
                                        {editingCell && editingCell.rowIndex === rowIndex && editingCell.colKey === colKey ? (
                                            <input className='text-black p-2 rounded-lg border-none' value={newValue} onChange={handleChange} onBlur={handleSave} />
                                        ) : (
                                            row[colKey]
                                        )}
                                    </td>
                                ))}
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleDeleteRow(rowIndex)} className="p-2 bg-[#18334F] hover:bg-[#CA2676] hover:text-[#35B0E9] duration-300 text-white rounded">Delete Row</button>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={handleAddRow} className="p-2 bg-[#18334F] hover:bg-[#CA2676] hover:text-[#35B0E9] duration-300 text-white rounded">+</button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            {columns.map((col, index) => (
                                <td key={index} className="py-2 px-4 border-b"></td>
                            ))}
                            <td className="py-2 px-4 border-b"></td>
                            <td className="py-2 px-4 border-b">
                                <button onClick={handleAddColumn} className="p-2 bg-[#18334F] hover:bg-[#CA2676] hover:text-[#35B0E9] duration-300 text-white rounded">+</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Sheet;
