import React, { useState } from "react";
import CustomSwitch from "../../components/consts/switch";
import AddRoleModal from "./ModalRol";
import Table from "../../components/consts/Tabla";

const Proveedores = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleToggleSwitch = (id) => {
    // Encuentra la fila correspondiente al ID
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        // Invierte el estado isActive
        return { ...row, isActive: !row.isActive };
      }
      return row;
    });

    // Actualiza el estado de las filas
    setRows(updatedRows);
  };

  const handleEditClick = (id) => {
    console.log(`Editando rol con ID: ${id}`);
    handleOpenModal();
  };

  const handleViewDetailsClick = (id) => {
    console.log(`Viendo detalles del rol con ID: ${id}`);
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
    { field: 'Correo', headerName: 'Correo', width: 'w-36' },
    { field: 'Telefono', headerName: 'Telefono', width: 'w-36' },
    { field: 'Direccion', headerName: 'Direccion', width: 'w-36' },
    { field: 'Empresa', headerName: 'Empresa', width: 'w-36' },

    {
      field: 'Acciones',
      headerName: 'Acciones',
      width: 'w-48',
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          <button onClick={() => handleEditClick(params.row.id)} className="text-yellow-500">
            <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
          </button>
          <button onClick={() => handleViewDetailsClick(params.row.id)} className="text-blue-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a2 2 0 110-4 2 2 0 010 4z"
                clipRule="evenodd"
              />
            </svg>|
          </button>
          {/* CustomSwitch que cambia su estado cuando se hace clic */}
          <CustomSwitch
            active={params.row.isActive}
            onToggle={() => handleToggleSwitch(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const [rows, setRows] = useState([
    { id: 1, Nombre: 'Esneider P', Correo: 'Esne23@gmail.com', Telefono: 3045458593, Direccion: 'Cll 54 #34-50', Empresa: 'Nivea', isActive: false },
    { id: 2, Nombre: 'Leonardo A', Correo: 'Leo3@gmail.com', Telefono: 3234594584, Direccion: 'Cll 54 #34-50', Empresa: 'Adidas', isActive: false },
    { id: 3, Nombre: 'Johan M', Correo: 'Jojan@gmail.com', Telefono: 3054584593, Direccion: 'Cll 54 #34-50', Empresa: 'Nivea', isActive: false },
    { id: 4, Nombre: 'Emerson V', Correo: 'Emers2@gmail.com', Telefono: 3014503495, Direccion: 'Cll 54 #34-50', Empresa: 'Electrox',  isActive: false },
    { id: 5, Nombre: 'Sofia M', Correo: 'Sofi45@gmail.com', Telefono: 3055695604, Direccion: 'Cll 54 #34-50', Empresa: 'Caramelo', isActive: true },
  ]);

  return (
    <div>
      <h1>Roles</h1>
      <Table columns={columns} data={rows} />
      <AddRoleModal open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default Proveedores;
