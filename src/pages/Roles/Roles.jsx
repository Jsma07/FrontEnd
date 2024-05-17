import React, { useState, useEffect } from "react";
import CustomSwitch from "../../components/consts/switch";
import AddRoleModal from "./ModalRol";
import Table from "../../components/consts/Tabla";
import axios from 'axios';


const Roles = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
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
    { field: 'rolId', headerName: 'ID', width: 'w-16' },
    { field: 'nombre', headerName: 'Nombre', width: 'w-36',
   },
    { 
      field: 'permisos', 
      headerName: 'Permisos', 
      width: 'w-36',
      renderCell: (params) => (
        <ul style={{textAlign: 'center'}}>
          {params.row.permisos.map(permiso => (
            <li key={permiso.idPermiso}>{permiso.nombre}</li>
          ))}
        </ul>
      )
    },
    {
      field: 'Acciones',
      headerName: 'Acciones',
      width: 'w-48',
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          <button onClick={() => handleEditClick(params.row.idRol)} className="text-yellow-500">
            <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
          </button>
          <button onClick={() => handleViewDetailsClick(params.row.idRol)} className="text-blue-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a2 2 0 110-4 2 2 0 010 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* CustomSwitch que cambia su estado cuando se hace clic */}
          <CustomSwitch
            active={params.row.isActive}
            onToggle={() => handleToggleSwitch(params.row.idRol)}
          />
        </div>
      ),
    },
  ];
  

  
  console.log("Roles:", roles);

  return (
    <div>
      <h1>Roles</h1>
      <Table columns={columns} data={roles} />
      <AddRoleModal open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default Roles;
