// Importa React
import React from 'react';

// Define el componente Table
const Table = ({ columns, data, roles }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800 p-4 border border-1">
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        <thead style={{backgroundColor: '#94CEF2'}}>
          <tr>
            {/* Renderiza las columnas de la tabla */}
            {columns.map((column) => (
              <th key={column.field} className={`px-4 py-2 ${column.width}`}>
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Renderiza las filas de la tabla */}
          {data.map((row, rowIndex) => (
            <tr style={{textAlign : 'center'}} key={rowIndex} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`px-4 py-2 ${column.width}`}>
                  {/* Renderiza el contenido de cada celda */}
                  {column.field === 'rolId' ? (roles.find(role => role.id === row[column.field])?.nombre || 'Desconocido') : (column.renderCell ? column.renderCell({ row }) : row[column.field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Exporta el componente Table
export default Table;
