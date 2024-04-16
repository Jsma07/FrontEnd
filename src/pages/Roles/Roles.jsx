import React, { useState } from "react";
import CustomSwitch from "../../components/consts/switch";
import AddRoleModal from "./ModalRol";

const Roles = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleToggle = (id) => {
    // Implementa la lógica para cambiar el estado de isActive para la fila con el id dado
  };

  const handleEditClick = (id) => {
    // Implementa la lógica para manejar el clic en el botón de editar
  };

  const handleViewDetailsClick = (id) => {
    // Implementa la lógica para manejar el clic en el botón de ver detalles
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 'w-16' },
    { field: 'Nombre', headerName: 'Nombre', width: 'w-36' },
    { field: 'Permisos', headerName: 'Permisos', width: 'w-36' },
    {
      field: 'Acciones',
      headerName: 'Acciones',
      width: 'w-48',
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          <button onClick={handleOpenModal} className="text-yellow-500">
          <i class='bx bx-edit' style={{ fontSize: "24px" }}></i>
          </button>
          <button onClick={() => handleViewDetailsClick(params.row.id)} className="text-blue-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a2 2 0 110-4 2 2 0 010 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <CustomSwitch active={params.row.isActive} onToggle={() => handleToggle(params.row.id)} />
        </div>
      ),
    },
   
  ];

  const rows = [
    { id: 1, Nombre: 'Administrador', Permisos: 'CRUD', isActive: false },
    { id: 2, Nombre: 'Empleado', Permisos: 'RU', isActive: false },
    { id: 3, Nombre: 'Cliente', Permisos: 'RU', isActive: false },
    { id: 4, Nombre: 'Cajero', Permisos: 'RU', isActive: false },
    { id: 5, Nombre: 'A', Permisos: 'RU', isActive: true },
  ];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800 p-4">
      <div className="mb-4 flex justify-end">
        <button onClick={handleOpenModal} className="text-blue-500">
        <i class='bx bxs-shield-plus' style={{ fontSize: "24px" }}></i>
        </button>
      </div>
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            {columns.map((column) => (
              <th key={column.field} className={`px-4 py-2 ${column.width}`}>
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
              {columns.map((column, index) => (
                <td key={index} className={`px-4 py-2 ${column.width}`}>
                  {column.renderCell ? column.renderCell({ row }) : row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <AddRoleModal open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default Roles;
