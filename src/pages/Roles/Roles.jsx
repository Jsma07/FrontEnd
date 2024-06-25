import React, { useState, useEffect } from "react";
import CustomSwitch from "../../components/consts/switch";
import AddRoleModal from "./ModalRol";
import ModalEditar from "./ModalEditar";
import Table from "../../components/consts/Tabla";
import axios from "axios";
import { Fab } from "@mui/material";
import ModalPermisos from "./modalPermisos";

const Roles = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null); // Estado para almacenar el ID del rol seleccionado para editar
  const [roles, setRoles] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openPermisosModal, setOpenPermisosModal] = useState(false);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      if (response.data && Array.isArray(response.data)) {
        const rolesWithPermissions = response.data.map((role) => ({
          ...role,
          permisos: role.permisos || [], // Asegurar que permisos siempre sea un array
        }));
        setRoles(rolesWithPermissions);
      } else {
        console.error("Data received is empty or malformed:", response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleToggleSwitch = async (id) => {
    const updatedRoles = roles.map((rol) =>
      rol.idRol === id
        ? { ...rol, EstadoRol: rol.EstadoRol === 1 ? 0 : 1 }
        : rol
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
        const response = await axios.put(
          `http://localhost:5000/api/editarRol/${id}`,
          {
            EstadoRol: updatedRole.EstadoRol,
            nombre: updatedRole.nombre,
            permisos: updatedRole.permisos.map((permiso) => permiso.idPermiso),
          }
        );

        if (response.status === 200) {
          setRoles(updatedRoles);
          window.Swal.fire({
            icon: "success",
            title: "Estado actualizado",
            text: "El estado del rol ha sido actualizado correctamente.",
          });
        }
      }
    } catch (error) {
      console.error("Error al cambiar el estado del rol:", error);
      window.Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar el estado del rol. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };
  const filtrar = roles.filter((rol) => {
    const { nombre = "", permisos = [] } = rol;

    // Filtrar por nombre del rol
    const nombreRol = nombre.toLowerCase().includes(buscar.toLowerCase());

    // Filtrar por permisos asociados al rol
    const permisosAsociados = permisos.some((p) =>
      p.nombre.toLowerCase().includes(buscar.toLowerCase())
    );

    return nombreRol || permisosAsociados;
  });

  const handleEditClick = (id) => {
    console.log(`Editando rol con ID: ${id}`);
    setSelectedRoleId(id); // Almacenar el ID del rol seleccionado para editar
    setOpenCreateModal(false); // Cerrar el modal de creación si está abierto
  };

  const handleViewDetailsClick = (permisos) => {
    setSelectedPermisos(permisos);
    setOpenPermisosModal(true);
  };
  const handleClosePermisosModal = () => {
    setOpenPermisosModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setSelectedRoleId(null); // Limpiar el ID del rol seleccionado al abrir el modal de creación
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRoleId(null); // Limpiar el ID del rol seleccionado al cerrar el modal de edición
  };

  const columns = [
    { field: "idRol", headerName: "ID", width: "w-16" }, // Asegúrate de usar el campo correcto para el ID del rol
    { field: "nombre", headerName: "Nombre", width: "w-36" },
    {
      field: "permisos",
      headerName: "Modulo Permiso",
      width: "w-36",
      renderCell: (params) => (
        <ul style={{ textAlign: "center" }}>
          <button
            onClick={() => handleViewDetailsClick(params.row.permisos)}
            className="text-blue-500"
          >
            {" "}
            <i class="bx bx-show-alt" style={{ fontSize: "24px" }}></i>{" "}
          </button>
        </ul>
      ),
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: "w-48",
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          {params.row.EstadoRol === 1 && (
            <button
              onClick={() => handleEditClick(params.row.idRol)}
              className="text-yellow-500"
            >
              <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
            </button>
          )}

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
      {/* <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestión de roles</h1>
        <div className="relative md:w-64 md:mr-4">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Buscar usuario
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="bx bx-search w-4 h-4 text-gray-500 dark:text-gray-400"></i>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-2 pl-8 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar usuario..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              required
            />
          </div>
        </div>
      </div> */}

      <Table title="Gestion de Roles" columns={columns} data={filtrar} />
      <AddRoleModal
        open={openModal && selectedRoleId === null}
        handleClose={handleCloseModal}
        setRoles={setRoles}
      />
      <Fab
        aria-label="add"
        style={{
          border: "0.5px solid grey",
          backgroundColor: "#94CEF2",
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 1000,
        }}
        onClick={handleOpenModal}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>

      {/* Modal de edición */}
      <ModalEditar
        open={selectedRoleId !== null} // Abrir el modal si selectedRoleId tiene un valor
        handleClose={handleCloseModal}
        roleId={selectedRoleId}
        setRoles={setRoles}
      />
      <ModalPermisos
        open={openPermisosModal}
        handleClose={handleClosePermisosModal}
        permisos={selectedPermisos}
      />
    </div>
  );
};

export default Roles;
