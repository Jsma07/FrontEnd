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

  // console.log('Props en TablePrueba:', columns, data, roles); // Verifica aquí que los roles y datos se estén pasando correctamente

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div className="px-4 mx-auto max-w-full lg:px-12">
        <div className="relative overflow-auto bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          
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
