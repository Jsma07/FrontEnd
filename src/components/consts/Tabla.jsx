// Importa React
import React from 'react';

// Define el componente Table
const Table = ({ columns, data, roles }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800 p-4 border border-1" style={{ width: '900px' }}>
      <table className="w-full min-w-max text-sm text-gray-700 dark:text-gray-300">
        <thead style={{ backgroundColor: '#94CEF2' }}>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.field} 
                className="px-6 py-3 text-center" 
                style={{ minWidth: column.minWidth || '25px' }} 
              >
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center"> 
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className="px-6 py-3" 
                  style={{ minWidth: column.minWidth || '25px' }} >
                  {column.field === 'rolId' 
                    ? (roles.find(role => role.id === row[column.field])?.nombre || 'Desconocido') 
                    : (column.renderCell 
                        ? column.renderCell({ row }) 
                        : row[column.field])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
