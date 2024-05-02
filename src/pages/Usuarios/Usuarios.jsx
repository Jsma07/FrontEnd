import React, { useEffect, useState } from "react";
import CustomSwitch from "../../components/consts/switch";
import AddRoleModal from "../Roles/ModalRol";
import Table from "../../components/consts/Tabla";
import axios from 'axios';

const Usuarios = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/users');
        setUsers(respuesta.data.usuarios);
      } catch(error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleSwitch = (id) => {
    // Encuentra la fila correspondiente al ID
    // const updatedRows = rows.map((row) => {
    //   if (row.id === id) {
    //     // Invierte el estado isActive
    //     return { ...row, isActive: !row.isActive };
    //   }
    //   return row;
    // });

    // Actualiza el estado de las filas
    // setRows(updatedRows);
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
    { field: 'nombre', headerName: 'Nombre', width: 'w-36' },
    { field: 'apellido', headerName: 'Apellido', width: 'w-36' },
    { field: 'correo', headerName: 'Correo', width: 'w-36' },
    { field: 'telefono', headerName: 'Telefono', width: 'w-36' },
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
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
            </svg>
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

  return (
    <div>
      <h1>Usuarios</h1>
      <Table columns={columns} data={users} />
      <AddRoleModal open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default Usuarios;
