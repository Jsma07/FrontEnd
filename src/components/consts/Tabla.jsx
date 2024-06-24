import React from 'react';

const TablePrueba = ({ columns, data, roles }) => {

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div className="px-4 mx-auto max-w-full lg:px-12">
        <div className="relative overflow-auto bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            {/* Encabezados */}
            <div className="flex items-center flex-1 space-x-4">
              {/* <h5>
                <span className="text-gray-500">All Products:</span>
                <span className="dark:text-white">123456</span>
              </h5>
              <h5>
                <span className="text-gray-500">Total sales:</span>
                <span className="dark:text-white">$88.4k</span>
              </h5> */}
            </div>
            {/* Botones de acción */}
            
          </div>
          {/* Tabla de datos */}
          <div className="w-full">
            <table className="w-full table-auto text-sm text-center text-gray-500 dark:text-gray-400" style={{ tableLayout: 'auto' }}>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {/* Encabezados de columnas */}
                  {columns.map((column) => (
                    <th scope="col" key={column.field} className="px-4 py-3 text-center">
                      {column.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Filas de la tabla */}
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    {/* Celdas de datos */}
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                        {/* Renderizado condicional según la columna */}
                        {column.field === 'rolId'
                          ? roles.find(role => role.idRol === row[column.field])?.nombre || 'Desconocido'
                          : column.renderCell 
                            ? column.renderCell({ row }) 
                            : row[column.field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TablePrueba;
