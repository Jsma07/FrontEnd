import React from 'react';
import CheckBox from './CheckBox';

const TablePrueba = ({ columns, data, roles }) => {
  const [allChecked, setAllChecked] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState({});

  const handleCheckBoxChange = (rowIndex) => {
    setCheckedItems({
      ...checkedItems,
      [rowIndex]: !checkedItems[rowIndex]
    });
  };

  const handleAllCheckBoxChange = () => {
    setAllChecked(!allChecked);
    const updatedCheckedItems = {};
    data.forEach((_, index) => {
      updatedCheckedItems[index] = !allChecked;
    });
    setCheckedItems(updatedCheckedItems);
  };

  console.log('Props en TablePrueba:', columns, data, roles); // Verifica aquí que los roles y datos se estén pasando correctamente

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div className="px-4 mx-auto max-w-full lg:px-12">
        <div className="relative overflow-auto bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            {/* Encabezados */}
            <div className="flex items-center flex-1 space-x-4">
              <h5>
                <span className="text-gray-500">All Products:</span>
                <span className="dark:text-white">123456</span>
              </h5>
              <h5>
                <span className="text-gray-500">Total sales:</span>
                <span className="dark:text-white">$88.4k</span>
              </h5>
            </div>
            {/* Botones de acción */}
            <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
              <button type="button" className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add new product
              </button>
              {/* Otros botones... */}
            </div>
          </div>
          {/* Tabla de datos */}
          <div className="w-full">
            <table className="w-full table-auto text-sm text-center text-gray-500 dark:text-gray-400" style={{ tableLayout: 'auto' }}>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center justify-center">
                      <CheckBox checked={allChecked} onChange={handleAllCheckBoxChange} />
                    </div>
                  </th>
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
                    <td className="w-4 px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <CheckBox
                          checked={checkedItems[rowIndex]}
                          onChange={() => handleCheckBoxChange(rowIndex)}
                        />
                      </div>
                    </td>
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
