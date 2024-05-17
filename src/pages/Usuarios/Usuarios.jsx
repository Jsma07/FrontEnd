import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../components/consts/switch";
import ModalDinamico from "../../components/consts/Modal";
import Table from "../../components/consts/Tabla";

const Usuarios = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/roles'); 
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

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
    // Lógica para cambiar el estado del switch
  };

  const handleEditClick = (id) => {
    console.log(`Editando usuario con ID: ${id}`);
  };

  const handleViewDetailsClick = (id) => {
    console.log(`Viendo detalles del usuario con ID: ${id}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCrearUsuarioClick = () => {
    handleOpenModal();
  };

  const handleCrearUsuario = (formData) => {
    // Lógica para crear un nuevo usuario con los datos proporcionados
    console.log('Datos del nuevo usuario:', formData);
    // Cierra el modal después de enviar el formulario
    handleCloseModal();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 'w-16' },
    { field: 'nombre', headerName: 'Nombre', width: 'w-36' },
    { field: 'apellido', headerName: 'Apellido', width: 'w-36' },
    { field: 'correo', headerName: 'Correo', width: 'w-36' },
    { field: 'telefono', headerName: 'Teléfono', width: 'w-36' },
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
      <button onClick={handleCrearUsuarioClick} className="text-blue-500">Crear Usuario</button>
      <ModalDinamico
        open={openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCrearUsuario}
        title="Crear Nuevo Usuario"
        fields={[
          { name: 'nombre', label: 'Nombre', type: 'text' },
          { name: 'apellido', label: 'Apellido', type: 'text' },
          { name: 'correo', label: 'Correo', type: 'text' },
          { name: 'telefono', label: 'Teléfono', type: 'text' },
          { 
            name: 'rol', 
            label: 'Rol', 
            type: 'select',
            options: roles.map(role => ({ value: role.id, label: role.nombre })) 
          },
          { name: 'contraseña', label: 'Contraseña', type: 'password' }
        ]}
      />
      <Table columns={columns} data={users} />
    </div>
  );
};

export default Usuarios;
