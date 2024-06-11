import React, { useState } from 'react';

const initialData = [
    { id: 1, column1: 'Sample Data 1', column2: 'Sample Data 2', column3: 'Sample Data 3' },
    { id: 2, column1: 'Sample Data 4', column2: 'Sample Data 5', column3: 'Sample Data 6' },
    { id: 3, column1: 'Sample Data 7', column2: 'Sample Data 8', column3: 'Sample Data 9' },
    { id: 1, column1: 'Sample Data 1', column2: 'Sample Data 2', column3: 'Sample Data 3' },
    { id: 2, column1: 'Sample Data 4', column2: 'Sample Data 5', column3: 'Sample Data 6' },
    { id: 3, column1: 'Sample Data 7', column2: 'Sample Data 8', column3: 'Sample Data 9' },
    { id: 1, column1: 'Sample Data 1', column2: 'Sample Data 2', column3: 'Sample Data 3' },
    { id: 2, column1: 'Sample Data 4', column2: 'Sample Data 5', column3: 'Sample Data 6' },
    { id: 3, column1: 'Sample Data 7', column2: 'Sample Data 8', column3: 'Sample Data 9' },
    { id: 1, column1: 'Sample Data 1', column2: 'Sample Data 2', column3: 'Sample Data 3' },
    { id: 2, column1: 'Sample Data 4', column2: 'Sample Data 5', column3: 'Sample Data 6' },
    { id: 3, column1: 'Sample Data 7', column2: 'Sample Data 8', column3: 'Sample Data 9' },
];

const Sheet = () => {
    /**------------------------------------ Local States --------------------------------------------------- */

    const [data, setData] = useState(initialData);
    const [editingCell, setEditingCell] = useState(null);
    const [newValue, setNewValue] = useState('');

    /**------------------------------------ Handlers ------------------------------------------------------- */

    const handleEdit = (rowIndex, colKey) => {
        setEditingCell({ rowIndex, colKey });
        setNewValue(data[rowIndex][colKey]);
    };

    const handleChange = (e) => {
        setNewValue(e.target.value);
    };

    const handleSave = () => {
        const { rowIndex, colKey } = editingCell;
        const updatedData = [...data];
        updatedData[rowIndex][colKey] = newValue;
        setData(updatedData);
        setEditingCell(null);
    };

    const handleAddRow = () => {
        const newRow = { id: data.length + 1, column1: '', column2: '', column3: '' };
        setData([...data, newRow]);
    };

    const handleDeleteRow = (rowIndex) => {
        const updatedData = data.filter((_, index) => index !== rowIndex);
        setData(updatedData);
    };

    return (
        <div className="mx-auto bg-custom-gradient font-poppin">
            <button onClick={handleAddRow} className="m-6 p-[0.75em] text-sm bg-[#18334F] hover:bg-[#FEE4A4] hover:text-[#764A2D] duration-300 text-white rounded">Add Row</button>
            <div className="overflow-x-auto m-8 rounded-lg border-gray-400 border-1 shadow-md bg-inherit backdrop-blur-md">
                <table className="min-w-full bg-[#293548] shadow-md bg-inherit backdrop-blur-md">
                    <thead>
                        <tr className='text-[#35B0E9]'>
                            <th className="py-2 px-4 border-b">Column 1</th>
                            <th className="py-2 px-4 border-b">Column 2</th>
                            <th className="py-2 px-4 border-b">Column 3</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}> 
                                {Object.entries(row).map(([colKey, cell], colIndex) => (
                                    colKey !== 'id' && (
                                        <td key={colIndex} className="py-2 px-4 border-b" onDoubleClick={() => handleEdit(rowIndex, colKey)}>
                                            {editingCell && editingCell.rowIndex === rowIndex && editingCell.colKey === colKey ? (
                                                <input className='text-black p-2 rounded-lg border-none' value={newValue} onChange={handleChange} onBlur={handleSave} />
                                            ) : (
                                                cell
                                            )}
                                        </td>
                                    )
                                ))}
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleDeleteRow(rowIndex)} className="p-2 bg-[#18334F] hover:bg-[#CA2676] hover:text-[#35B0E9] duration-300 text-white rounded">Delete Row</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sheet;
