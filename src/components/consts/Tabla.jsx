import React from 'react';

const Table = ({ columns, data }) => {
  return (
    
      <table className="w-full min-w-max bg-white dark:bg-gray-800 rounded-lg shadow-md text-sm text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            {/* Renderiza las columnas de la tabla */}
            {columns.map((column) => (
              <th key={column.field} className="px-4 py-2">
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Renderiza las filas de la tabla */}
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  {/* Renderiza el contenido de cada celda */}
                  {column.renderCell ? column.renderCell({ row }) : row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    
  );
};

export default Table;
