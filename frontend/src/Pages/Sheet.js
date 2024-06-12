import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/Button';

const Sheet = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    const [newValue, setNewValue] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [dates, setDates] = useState([]);

    useEffect(() => {
        fetchDates();
    }, []);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchDates = async () => {
        try {
            const result = await axios.get('http://localhost:5000/api/spreadsheet/dates');
            setDates(result.data);
        } catch (error) {
            console.error('Error fetching dates:', error);
        }
    };


    const fetchData = async () => {
        try {
            const result = await axios.get('http://localhost:5000/api/spreadsheet');
            const data = result.data.map(row => row.data);
            console.log('Fetched data:', data); 
            setData(data);
            setColumns(Object.keys(data[0] || {}));
        } catch (error) {
            console.error('Error feching data:', error);
        }
    };

    const handleEdit = (rowIndex, colKey) => {
        setEditingCell({ rowIndex, colKey });
        setNewValue(data[rowIndex][colKey]);
    };

    const handleChange = (e) => {
        setNewValue(e.target.value);
    };

    const handleSave = async () => {
        const { rowIndex, colKey } = editingCell;
        const updatedData = [...data];
        updatedData[rowIndex][colKey] = newValue;
        setData(updatedData);
        setEditingCell(null);

        try {
            await axios.put(`http://localhost:5000/api/spreadsheet/${data[rowIndex].id}`, { [colKey]: newValue });
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
            const result = await axios.post('http://localhost:5000/api/spreadsheet', { data: newRow });
            setData([...data, result.data]);
        } catch (error) {
            console.error('error ading row:', error);
        }
    };

    const handleAddColumn = () => {
        const newColumn = `column${columns.length + 1}`;
        setColumns([...columns, newColumn]);
        const updatedData = data.map(row => ({ ...row, [newColumn]: '' }));
        setData(updatedData);
    };

    const handleDeleteRow = async (rowIndex) => {
        const id = data[rowIndex].id;
        try {
            await axios.delete(`http://localhost:5000/api/spreadsheet/${id}`);
            const updatedData = data.filter((_, index) => index !== rowIndex);
            setData(updatedData);
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            await axios.post('http://localhost:5000/api/spreadsheet/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchData();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div className="mx-auto bg-custom-gradient font-poppin">
            <Button name="Add Row" handler={handleAddRow}/>
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
                        {data.map((row, rowIndex) => (
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

