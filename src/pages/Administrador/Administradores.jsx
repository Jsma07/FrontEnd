import CustomSwitch from "../../components/consts/switch";
import React, { useEffect, useState } from "react";
import ModalDinamico from "../../components/consts/modalJ";
import Table from "../../components/consts/Tabla";
import axios from "axios";
import LoadingScreen from "../../components/consts/pantallaCarga";
import Fab from "@mui/material/Fab";
import Modal from "../../components/consts/modalContrasena";

const Usuarios = () => {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buscar, setBuscar] = useState("");
  const [rolesActivos, setRolesActivos] = useState([]);
  const [openPasswordModal, setOpenPasswordModal] = useState(false); // Nuevo estado para controlar el modal de cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    Documento: "",
  });

  useEffect(() => {
    // Filtrar roles activos
    const rolesFiltrados = roles.filter((rol) => rol.EstadoRol === 1);
    setRolesActivos(rolesFiltrados);
  }, [roles]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/roles");
        console.log("Roles response:", response.data);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data.usuarios);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchRoles();
    fetchUsers();
  }, []);
  const filtrar = users.filter((user) => {
    const {
      nombre = "",
      apellido = "",
      Documento = "",
      tipoDocumento = "",
      correo = "",
      telefono = "",
      rolId,
    } = user;

    // Solo mostrar usuarios con el rol de idRol 1
    if (rolId !== 1) {
      return false;
    }

    const terminoABuscar = buscar.toLowerCase();
    const rol = roles.find((role) => role.idRol === rolId);
    const nombreRol = rol ? rol.nombre : "";

    return (
      nombre.toLowerCase().includes(terminoABuscar) ||
      apellido.toLowerCase().includes(terminoABuscar) ||
      correo.toLowerCase().includes(terminoABuscar) ||
      telefono.includes(terminoABuscar) ||
      Documento.includes(terminoABuscar) ||
      tipoDocumento.toLowerCase().includes(terminoABuscar) || // Filtrar por tipoDocumento

      nombreRol.toLowerCase().includes(terminoABuscar)
    );
  });

  const handleToggleSwitch = async (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, estado: user.estado === 1 ? 0 : 1 } : user
    );

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
      console.log("Usuario no encontrado");
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
    setErrors({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      Documento: "",
    });
  };

  const handleCrearUsuarioClick = () => {
    handleOpenModal();
  };
  const handlePasswordModalClose = () => {
    setOpenPasswordModal(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmitPasswordChange = async (newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      window.Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }

    if (newPassword.length < 8) {
      window.Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/actualizarContrasena/${seleccionado.id}`,
        {
          newPassword: newPassword,
        }
      );

      window.Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "La contraseña del usuario ha sido actualizada correctamente.",
      });
      handlePasswordModalClose(); // Cerrar el modal después de actualizar la contraseña
    } catch (error) {
      console.error("Error al cambiar la contraseña del usuario:", error);
      window.Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar la contraseña del usuario. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handlePasswordChangeClick = (id) => {
    const usuarioSeleccionado = users.find((user) => user.id === id);
    if (usuarioSeleccionado) {
      setSeleccionado(usuarioSeleccionado);
      setOpenPasswordModal(true);
    } else {
      console.error("Usuario no encontrado");
    }
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

    const validacionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!validacionCorreo.test(formData.correo)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        correo: "El correo ingresado tiene un formato inválido.",
      }));
      return;
    }

    const validacionNombreApellido = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;

    if (!validacionNombreApellido.test(formData.nombre)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nombre: "El nombre ingresado tiene caracteres no válidos.",
      }));
      return;
    }

    if (!validacionNombreApellido.test(formData.apellido)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apellido: "El apellido ingresado tiene caracteres no válidos.",
      }));
      return;
    }

    const validacionDocumento = /^[0-9]{1,10}$/;

    if (!validacionDocumento.test(formData.Documento)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Documento: "El documento ingresado debe contener solo números.",
      }));
      return;
    }

    const validacionTelefono = /^[0-9]{7,15}$/;

    if (!validacionTelefono.test(formData.telefono)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        telefono: "El teléfono ingresado debe contener solo números.",
      }));
      return;
    }
    
    const rolSeleccionado = rolesActivos.find(
      (rol) => rol.idRol === formData.rolId
    );
    if (!rolSeleccionado) {
      window.Swal.fire({
        icon: "error",
        title: "Rol inactivo",
        text: "El rol seleccionado está inactivo. Por favor selecciona un rol activo.",
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
        const updatedUsers = users.map((user) =>
          user.id === seleccionado.id ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
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
        setUsers([...users, formData]);
      }

      console.log("Respuesta del servidor:", response.data);
      handleCloseModal();
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
    { field: "tipoDocumento", headerName: "Tipo de documento", width: "w-60" },

    { field: "Documento", headerName: "Documento", width: "w-50" },

    { field: "nombre", headerName: "Nombre", width: "w-50" },
    { field: "apellido", headerName: "Apellido", width: "w-50" },
    { field: "correo", headerName: "Correo", width: "w-50" },
    { field: "telefono", headerName: "Teléfono", width: "w-50" },
    {
      field: "rolId",
      headerName: "Rol",
      width: "w-36",
      renderCell: (params) => {
        const rol = roles.find((role) => role.id === params.value);
        return rol.nombre;
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: "w-48",
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          {params.row.estado === 1 && (
          <button
            onClick={() => handleEditClick(params.row.id)}
            className="text-yellow-500"
          >
            <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
          </button>
          )}
          {params.row.estado === 1 && (
          <button
            onClick={() => {
              handlePasswordChangeClick(params.row.id); // Abrir el modal de contraseña al hacer clic
            }}
            className="text-black-500"
          >
            <i className="bx bx-lock" style={{ fontSize: "24px" }}></i>{" "}
          </button>
          )}
          <CustomSwitch
            active={params.row.estado === 1}
            onToggle={() => handleToggleSwitch(params.row.id)}
          />
        </div>
      ),
    },
  ];
  // console.log("Roles en Usuarios:", roles); // Verifica los roles aquí antes de pasarlos a la tabla

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4 relative">
       <div className="flex items-center justify-between mb-4">
  <h1 className="text-2xl font-bold">Gestión de administradores</h1>
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
</div>
        <div>
          <Modal
            open={openPasswordModal}
            handleClose={handlePasswordModalClose}
            handleSubmit={handleSubmitPasswordChange}
          />

          <ModalDinamico
            seleccionado={seleccionado}
            open={openModal}
            handleClose={handleCloseModal}
            onSubmit={handleSubmit}
            title={
              seleccionado
                ? "Editar Administrador"
                : "Crear nuevo Administrador"
            }
            fields={[
              {
                name: "tipoDocumento",
                type: "select",
                options: [
                  { value: "T.I", label: "Tarjeta de Identidad (T.I)" },
                  { value: "C.C", label: "Cédula de Ciudadanía (C.C)" },
                  { value: "T.E", label: "Tarjeta de extranjería (T.E)" },
                  { value: "C.E", label: "Cédula de extranjería (C.E)" },
                ],
                value: seleccionado ? seleccionado.tipoDocumento : "C.C", // Valor por defecto seleccionado
                disabled: false, // Si deseas que inicialmente esté deshabilitado, cambia a true
              },
              {
                name: "Documento",
                label: "Tipo de Documento",
                type: "text",
                value: seleccionado ? seleccionado.Documento : "",
              },
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
                name: "rolId",
                // label: "Rol",
                type: "select",
                options: roles
                  .filter((role) => role.idRol === 1) // Filtrar para mostrar solo el rol con idRol 1
                  .map((role) => ({
                    value: role.idRol,
                    label: role.nombre,
                  })),
                value: 1, // Siempre seleccionar el rol con idRol 1
                disabled: true, // Deshabilitar el select
              },
              {
                name: "contrasena",
                label: "Contraseña",
                type: "password",
                value: seleccionado ? seleccionado.contrasena : "",

                hidden: seleccionado,
              },
            ]}
          />
        
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
