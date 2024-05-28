import React, { useEffect, useState } from "react";
import CustomSwitch from "../../components/consts/switch";
import ModalDinamico from "../../components/consts/modal";
import Table from "../../components/consts/Tabla";
import axios from "axios";
import LoadingScreen from "../../components/consts/pantallaCarga";
import Fab from "@mui/material/Fab";

const Usuarios = () => {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/roles");
        setRoles(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/users");
        setUsers(respuesta.data.usuarios);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const filtrar = users.filter((user) => {
    const { nombre, apellido, correo, telefono, rolId } = user;
    const terminoABuscar = buscar.toLowerCase();
    const rol = roles.find((role) => role.id === rolId);
    const nombreRol = rol ? rol.nombre.toLowerCase() : "";
    return (
      nombre.toLowerCase().includes(terminoABuscar) ||
      apellido.toLowerCase().includes(terminoABuscar) ||
      correo.toLowerCase().includes(terminoABuscar) ||
      telefono.includes(terminoABuscar) ||
      nombreRol.includes(terminoABuscar)
    );
  });

  const handleToggleSwitch = async (id) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        const newEstado = user.estado === 1 ? 0 : 1;
        return { ...user, estado: newEstado };
      }
      return user;
    });

    try {
      const updatedUser = updatedUsers.find((user) => user.id === id);
      if (!updatedUser) {
        console.error("No se encontró el usuario actualizado");
        return;
      }

      const result = await window.Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "¿Quieres cambiar el estado del usuario?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await axios.put(`http://localhost:5000/api/editarUsuario/${id}`, {
          estado: updatedUser.estado,
        });
        setUsers(updatedUsers);
        window.Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: "El estado del usuario ha sido actualizado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      window.Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar el estado del usuario. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleEditClick = (id) => {
    if (users.length === 0) {
      return;
    }

    const usuarioEditar = users.find((user) => user.id === id);
    if (!usuarioEditar) {
      console.log("no encontrado");
      return;
    }

    setSeleccionado(usuarioEditar);
    setOpenModal(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSeleccionado(null);
  };

  const handleCrearUsuarioClick = () => {
    handleOpenModal();
  };

  const handleSubmit = async (formData) => {
    const mandatoryFields = [
      "nombre",
      "correo",
      "apellido",
      "telefono",
      "rolId",
      "contrasena",
      "Documento",
    ];

    const emptyFields = mandatoryFields.filter((field) => {
      const value = formData[field];
      if (field === "rolId") {
        return value === undefined || value.toString().trim() === "";
      }
      return typeof value !== "string" || value.trim() === "";
    });

    if (emptyFields.length > 0) {
      window.Swal.fire({
        icon: "error",
        title: "Campos obligatorios vacíos",
        text: "Por favor, completa todos los campos obligatorios antes de continuar.",
      });
      return;
    }

    const validacionCorreo =
      /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail)\.(com|net|org)$/i;
    if (!validacionCorreo.test(formData.correo)) {
      window.Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "El correo ingresado tiene un formato inválido.",
      });
      return;
    }

    try {
      const result = await window.Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: `¿Quieres ${seleccionado ? "editar" : "crear"} el usuario?`,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }

      setIsLoading(true);

      // Verificar si el Documento ya existe
      const DocumentoExiste = users.some(
        (user) =>
          user.Documento === formData.Documento && user.id !== seleccionado?.id
      );

      if (DocumentoExiste) {
        window.Swal.fire({
          icon: "error",
          title: "Documento existente",
          text: "El Documento ingresado ya está en uso. Por favor, utiliza otro Documento.",
        });
        setIsLoading(false);
        return;
      }

      let response;
      if (seleccionado) {
        response = await axios.put(
          `http://localhost:5000/api/editarUsuario/${seleccionado.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        window.Swal.fire({
          icon: "success",
          title: "Usuario editado",
          text: "El usuario ha sido editado correctamente.",
        });
      } else {
        response = await axios.post(
          "http://localhost:5000/api/crearUsuario",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        window.Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario ha sido creado correctamente.",
        });
      }

      console.log("Respuesta del servidor:", response.data);
      handleCloseModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error al crear/editar usuario:", error);
      window.Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al crear/editar el usuario. Por favor, inténtalo de nuevo más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { field: "nombre", headerName: "Nombre", width: "w-36" },
    { field: "apellido", headerName: "Apellido", width: "w-36" },
    { field: "correo", headerName: "Correo", width: "w-36" },
    { field: "telefono", headerName: "Teléfono", width: "w-36" },
    { field: "Documento", headerName: "Documento", width: "w-36" },
    {
      field: "rolId",
      headerName: "Rol",
      width: "w-36",
      renderCell: (params) => {
        const rol = roles.find((role) => role.id === params.value);
        return rol ? rol.nombre : "Desconocido";
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: "w-48",
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleEditClick(params.row.id)}
            className="text-yellow-500"
          >
            <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
          </button>
          <CustomSwitch
            active={params.row.estado === 1}
            onToggle={() => handleToggleSwitch(params.row.id)}
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-4">Usuarios</h1>
      <div className="md:flex md:justify-between md:items-center mb-4">
        <div className="relative md:w-64 md:mr-4 mb-4 md:mb-0">
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
        <div>
          <ModalDinamico
            seleccionado={seleccionado}
            open={openModal}
            handleClose={handleCloseModal}
            onSubmit={handleSubmit}
            title={seleccionado ? "Editar Usuario" : "Crear nuevo usuario"}
            fields={[
              {
                name: "nombre",
                label: "Nombre",
                type: "text",
                value: seleccionado ? seleccionado.nombre : "",
              },
              {
                name: "apellido",
                label: "Apellido",
                type: "text",
                value: seleccionado ? seleccionado.apellido : "",
              },
              {
                name: "correo",
                label: "Correo",
                type: "text",
                value: seleccionado ? seleccionado.correo : "",
              },
              {
                name: "telefono",
                label: "Teléfono",
                type: "text",
                value: seleccionado ? seleccionado.telefono : "",
                maxLength: 15,
                minlength: 7,
              },
              {
                name: "Documento",
                label: "Documento",
                type: "text",
                value: seleccionado ? seleccionado.Documento : "",
              },
              {
                name: "rolId",
                label: "Rol",
                type: "select",
                options: roles.map((role) => ({
                  value: role.id,
                  label: role.nombre,
                })),
                value: seleccionado ? seleccionado.rolId : "",
              },
              {
                name: "contrasena",
                label: "Contraseña",
                type: "password",
                value: seleccionado ? seleccionado.contrasena : "",
              },
            ]}
          />
        </div>
      </div>
      <Table columns={columns} data={filtrar} roles={roles} />
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
        onClick={handleCrearUsuarioClick}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
    </div>
  );
};

export default Usuarios;
