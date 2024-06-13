import React, { useState, useEffect } from "react";
import CustomSwitch from "../../components/consts/switch";
import AddRoleModal from "./ModalRol";
import ModalEditar from "./ModalEditar";
import Table from "../../components/consts/Tabla";
import axios from 'axios';
import { Fab } from "@mui/material";

const Roles = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null); // Estado para almacenar el ID del rol seleccionado para editar
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/roles'); 
        if (response.data && Array.isArray(response.data)) {
          const rolesWithPermissions = response.data.map(role => ({
            ...role,
            permisos: role.permisos || [] // Asegurar que permisos siempre sea un array
          }));
          setRoles(rolesWithPermissions);
        } else {
          console.error('Data received is empty or malformed:', response.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleToggleSwitch = async (id) => {
    const updatedRoles = roles.map((rol) =>
      rol.idRol === id ? { ...rol, EstadoRol: rol.EstadoRol === 1 ? 0 : 1 } : rol
    );

    try {
      const updatedRole = updatedRoles.find((rol) => rol.idRol === id);
      if (!updatedRole) {
        console.error("No se encontró el rol actualizado");
        return;
      }

      const result = await window.Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "¿Quieres cambiar el estado del rol?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await axios.put(`http://localhost:5000/api/editarRol/${id}`, {
          EstadoRol: updatedRole.EstadoRol,
          nombre: updatedRole.nombre,
          permisos: updatedRole.permisos.map(permiso => permiso.idPermiso)
        });
        if (response.status === 200) {
          setRoles(updatedRoles);
          window.Swal.fire({
            icon: "success",
            title: "Estado actualizado",
            text: "El estado del rol ha sido actualizado correctamente.",
          });
        }}
    } catch (error) {
      console.error("Error al cambiar el estado del rol:", error);
      window.Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Hubo un error al cambiar el estado del rol. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleEditClick = (id) => {
    console.log(`Editando rol con ID: ${id}`);
    setSelectedRoleId(id); // Almacenar el ID del rol seleccionado para editar
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
    setSelectedRoleId(null); // Limpiar el ID del rol seleccionado al cerrar el modal
  };

  const columns = [
    { field: 'idRol', headerName: 'ID', width: 'w-16' }, // Asegúrate de usar el campo correcto para el ID del rol
    { field: 'nombre', headerName: 'Nombre', width: 'w-36' },
    { 
      field: 'permisos', 
      headerName: 'Modulo Permiso', 
      width: 'w-36',
      renderCell: (params) => (
        <ul style={{ textAlign: 'center' }}>
          {params.row.permisos && Array.isArray(params.row.permisos) ? (
            params.row.permisos.map(permiso => (
              <li key={permiso.idPermiso}>{permiso.nombre}</li>
            ))
          ) : (
            <li>No hay permisos asignados</li>
          )}
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
          <CustomSwitch
            active={params.row.EstadoRol === 1}
            onToggle={() => handleToggleSwitch(params.row.idRol)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Roles</h1>
      <Table columns={columns} data={roles} />
      <AddRoleModal open={openModal} handleClose={handleCloseModal} />
      <Fab
        aria-label="add"
        style={{
          border: '0.5px solid grey',
          backgroundColor: '#94CEF2',
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
        }}
        onClick={handleOpenModal}
      >
        <i className='bx bx-plus' style={{ fontSize: '1.3rem' }}></i>
      </Fab>

      {/* Modal de edición */}
      <ModalEditar
        open={selectedRoleId !== null} // Abrir el modal si selectedRoleId tiene un valor
        handleClose={handleCloseModal}
        roleId={selectedRoleId} // Pasar el ID del rol seleccionado al modal de edición
      />
    </div>
  );
};

export default Roles;
