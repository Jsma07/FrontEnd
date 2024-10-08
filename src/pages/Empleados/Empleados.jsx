import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModalDinamico from "../../components/consts/modaled";
import CustomSwitch from "../../components/consts/switch";
import TablePrueba from "../../components/consts/Tabla";
import Modal from "../../components/consts/modalContrasena";
import { toast } from "react-toastify";
import Fab from '@mui/material/Fab';
import { Button } from '@mui/material';



const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleado, setEmpleado] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [roles, setRoles] = useState([]);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/api/roles");
        console.log("Roles response:", response.data);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);

  const handlePasswordChangeClick = (IdEmpleado) => {
    const empleadoSeleccionado = empleados.find(
      (empleado) => empleado.IdEmpleado === IdEmpleado
    );
    if (empleadoSeleccionado) {
      setSeleccionado(empleadoSeleccionado);
      setOpenPasswordModal(true);
    } else {
      console.error("Empleado no encontrado");
    }
  };

  const handlePasswordModalClose = () => {
    setOpenPasswordModal(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setSeleccionado(null); // Limpiar el empleado seleccionado al cerrar el modal
  };

 
  const [modalData, setModalData] = useState(null);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/api/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);


 

  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones si el componente se desmonta

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/jackenail/Listar_Empleados"
        );
        const empleadosConRol = response.data.map((empleado) => ({
          ...empleado,
          Rol: empleado.role?.nombre || "Sin rol", // Añade el nombre del rol directamente
        }));
        if (isMounted) {
          setEmpleados(empleadosConRol);
        }
      } catch (error) {
        console.error("Error al obtener los datos de empleados:", error);
      }
    };

    fetchData(); // Obtener datos iniciales

    const intervalId = setInterval(fetchData, 5000); // Actualizar cada 5 segundos

    // Cleanup function para detener el intervalo cuando el componente se desmonta
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleOpenModal = (data) => {
    console.log("Datos del empleado al abrir el modal:", data);
    setModalData({
      ...data,
    });
  };


  const colorPalette = [
    "#FF5722", // Rojo anaranjado
    "#4CAF50", // Verde
    "#2196F3", // Azul
    "#FFC107", // Amarillo
    "#9E9E9E", // Gris
    "#E91E63", // Rosa
    "#00BCD4", // Cian
    "#8BC34A", // Verde claro
    "#FF9800", // Naranja
    "#9C27B0", // Púrpura
  ];
  
  // Función para obtener el color basado en el rol
  const getRoleColor = (roleName) => {
    const roleHash = Array.from(roleName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = roleHash % colorPalette.length;
    return colorPalette[colorIndex];
  };
  
  const columns = [
    { field: "Tip_Documento", headerName: "Tipo de Documento" },
    {
      field: "Img",
      headerName: "Imagen",
      width: 100,
      renderCell: (params) => {
        const imageUrl = `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev${params.row.Img}`;
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <img
              src={imageUrl}
              alt={params.row.Nombre}
              style={{ maxWidth: "100%", height: "auto", width: "3rem", height: "3rem", borderRadius: "50%" }}
            />
          </div>
        );
      },
    },
    { field: "Nombre", headerName: "Nombre" },
    { field: "Apellido", headerName: "Apellido" },
    { field: "Correo", headerName: "Correo" },
    { field: "Telefono", headerName: "Teléfono" },
    { field: "Documento", headerName: "Documento" },
    { field: "Direccion", headerName: "Dirección" },
    {
      field: "Rol",
      headerName: "Rol",
      width: 150,
      valueGetter: (params) => params.row.role?.nombre || "Sin rol",
      renderCell: (params) => {
        const roleName = params.row.role?.nombre || "Sin rol";
        const roleColor = getRoleColor(roleName);
  
        return (
          <Button
            variant="contained"
            style={{
              backgroundColor: roleColor,
              color: 'white',
              textTransform: 'none',
              borderRadius: '12px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
            }}
            disabled // Desactiva el botón si es solo visual
          >
            {roleName}
          </Button>
        );
      },
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          {params.row.Estado === 1 && (
            <Fab
              style={{ fontSize: '16px', width: '40px', height: '40px', backgroundColor: '#F0F0F0' }}
              onClick={() =>
                handleOpenModal({
                  ...params.row,
                  modo: "actualizacion",
                  seleccionado: params.row,
                })
              }
              className="text-yellow-500"
            >
              <i className="bx bx-edit" style={{ fontSize: "23px", color: "#F0AC00" }}></i>
            </Fab>
          )}
          {params.row.Estado === 1 && (
            <Fab
              style={{ fontSize: '16px', width: '40px', height: '40px', backgroundColor: '#F0F0F0' }}
              onClick={() => handlePasswordChangeClick(params.row.IdEmpleado)}
              className="text-black-500"
            >
              <i className="bx bx-lock" style={{ fontSize: "24px" }}></i>
            </Fab>
          )}
          <CustomSwitch
            active={params.row.Estado === 1}
            onToggle={() => handleToggleSwitch(params.row.IdEmpleado)}
          />
        </div>
      ),
    },
  ];
  
  
  const handleSubmit = async (formData) => {
    try {
      // Verificar si el correo electrónico está duplicado
      const correoExistente = empleados.some(
        (empleado) => empleado.Correo === formData.Correo
      );
  
      // Verificar si el documento está duplicado
      const documentoExistente = empleados.some(
        (empleado) => empleado.Documento === formData.Documento
      );
  
      if (correoExistente) {
        toast.error(
          "El correo electrónico ingresado ya está registrado. Por favor, elija otro correo electrónico."
        );
      } else if (documentoExistente) {
        toast.error(
          "El documento ingresado ya está registrado. Por favor, elija otro documento."
        );
      } else {
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Quieres registrar este empleado?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
        });
  
        if (result.isConfirmed) {
          // Crear un nuevo objeto FormData
          const formDataToSend = new FormData();
  
          // Añadir todos los campos al FormData
          formDataToSend.append("Nombre", formData.Nombre);
          formDataToSend.append("Apellido", formData.Apellido);
          formDataToSend.append("Correo", formData.Correo);
          formDataToSend.append("Telefono", formData.Telefono);
          formDataToSend.append("Estado", 1);
          formDataToSend.append("IdRol", formData.IdRol);
          formDataToSend.append("Documento", formData.Documento);
          formDataToSend.append("Direccion", formData.Direccion);
          formDataToSend.append("Tip_Documento", formData.Tip_Documento);
          formDataToSend.append("Contrasena", formData.Contrasena);
  
          // Añadir imagen si existe
          if (formData.Img) {
            formDataToSend.append("Img", formData.Img);
          }
  
          console.log("Datos del formulario numéricos:", formData);
  
          // Enviar la solicitud POST con FormData
          const response = await axios.post(
            "https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/crearEmpleadoss",
            formDataToSend,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
  
          // Suponiendo que el servidor devuelve el empleado creado con todos sus campos
          const nuevoEmpleado = response.data;
          console.log("Nuevo empleado:", nuevoEmpleado);
  
          setEmpleados((prevEmpleados) => [...prevEmpleados, nuevoEmpleado]);
  
          Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "El empleado se ha registrado correctamente.",
          });
  
          setModalData(null);
        }
      }
    } catch (error) {
      console.error("Error al registrar el empleado:", error);
      console.error(
        "Detalles del error:",
        error.response ? error.response.data : error.message
      );
   
      toast.error(
        "Ocurrió un error al registrar el empleado. Inténtelo nuevamente."
      );
    }
  };
  

  const handleToggleSwitch = async (id) => {
    const updatedEmpleados = empleados.map((empleado) => {
      if (empleado.IdEmpleado === id) {
        const newEstado = empleado.Estado === 1 ? 0 : 1;
        return { ...empleado, Estado: newEstado };
      }
      return empleado;
    });

    try {
      const updatedEmpleado = updatedEmpleados.find(
        (empleado) => empleado.IdEmpleado === id
      );
      if (!updatedEmpleado) {
        console.error("No se encontró el empleado actualizado");
        return;
      }

      const result = await Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "¿Quieres cambiar el estado del empleado?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await axios.put(
          `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/CambiarEstadoEmpleado/${id}`,
          {
            Estado: updatedEmpleado.Estado,
          }
        );
        setEmpleados(updatedEmpleados);

        toast.success(
          "El estado del empleado ha sido actualizado correctamente.",
          {
            position: "bottom-right",
            autoClose: 3000, // Cierra automáticamente después de 3 segundos
          }
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado del empleado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar el estado del empleado. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleActualizacionSubmit = async (formData) => {
    try {
        // Validar datos
        const empleadoExistente = empleados.find(
            (empleado) =>
                (empleado.Correo === formData.Correo ||
                empleado.Documento === formData.Documento) &&
                empleado.IdEmpleado !== formData.IdEmpleado
        );

        if (empleadoExistente) {
            Swal.fire({
                icon: "error",
                title: "Error de actualización",
                text: "El correo electrónico o el documento ya están registrados para otro empleado. Por favor, elija otro correo electrónico o documento.",
            });
            return;
        }

        // Crear FormData
        const formDataToSend = new FormData();
        formDataToSend.append("IdEmpleado", formData.IdEmpleado);
        formDataToSend.append("Nombre", formData.Nombre);
        formDataToSend.append("Apellido", formData.Apellido);
        formDataToSend.append("Correo", formData.Correo);
        formDataToSend.append("Telefono", formData.Telefono);
        formDataToSend.append("Estado", formData.Estado || 1);
        formDataToSend.append("IdRol", formData.IdRol);
        formDataToSend.append("Documento", formData.Documento);
        formDataToSend.append("Direccion", formData.Direccion);
        formDataToSend.append("Tip_Documento", formData.Tip_Documento);
        formDataToSend.append("Contrasena", formData.Contrasena);

        // Añadir imagen si existe
        if (formData.Img && formData.Img instanceof File) {
            formDataToSend.append("Img", formData.Img);
        }

        console.log("Datos del formulario a enviar:");
        for (const [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value);
        }

        // Corrección de la URL para editar empleados
        const url = `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/editarEmpleadoimg/${formData.IdEmpleado}`;

        const response = await axios.put(url, formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
        
        console.log("Respuesta del servidor:", response.data);

        // Actualizar la lista de empleados
        setEmpleados((prevEmpleados) =>
            prevEmpleados.map((empleado) =>
                empleado.IdEmpleado === formData.IdEmpleado
                    ? {
                        ...empleado,
                        ...formData,
                        Img: response.data.Img || empleado.Img,
                        role: {
                            idRol: formData.Rol,
                            nombre: roles.find(
                                (role) => role.idRol === formData.Rol
                            )?.nombre,
                        },
                    }
                    : empleado
            )
        );

        toast.success("El empleado se ha actualizado correctamente.", {
          position: "top-right",
          autoClose: 3000,
        });

        setModalData(null);

    } catch (error) {
        console.error("Error al actualizar el empleado:", error);
        toast.error("UPS, no se pudo registrar el empleado intentelo de nuevo", {
          position: "top-right",
          autoClose: 3000,
        });
    }
};




  const empleadosFiltrados = empleados.filter((empleado) => {
    // Convertir el filtro a minúsculas una vez
    const filtroLower = filtro.toLowerCase();

    // Verificar y convertir cada campo a minúsculas si está definido
    const nombreLower = empleado.Nombre ? empleado.Nombre.toLowerCase() : "";
    const apellidoLower = empleado.Apellido
      ? empleado.Apellido.toLowerCase()
      : "";
    const correoLower = empleado.Correo ? empleado.Correo.toLowerCase() : "";
    const documentoLower = empleado.Documento
      ? empleado.Documento.toLowerCase()
      : "";

    return (
      nombreLower.includes(filtroLower) ||
      apellidoLower.includes(filtroLower) ||
      correoLower.includes(filtroLower) ||
      documentoLower.includes(filtroLower) ||
      empleado.Telefono.toString().includes(filtro) ||
      (empleado.Estado === 1 ? "Activo" : "Inactivo")
        .toLowerCase()
        .includes(filtroLower)
    );
  });

  const handleSubmitPasswordChange = async (newPassword, confirmPassword) => {
    // Paso 1: Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      console.error(
        "Las contraseñas no coinciden:",
        newPassword,
        confirmPassword
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }

    // Paso 2: Validar que la contraseña tenga al menos 8 caracteres
    if (newPassword.length < 8) {
      console.error("La contraseña es demasiado corta:", newPassword);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    try {
      // Paso 3: Realizar la solicitud PUT para actualizar la contraseña
      console.log("Datos a enviar al servidor:", {
        IdEmpleado: seleccionado.IdEmpleado,
        newPassword: newPassword,
      });

      const response = await axios.put(
        `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/Empleado/${seleccionado.IdEmpleado}`,
        {
          Contrasena: newPassword,
        }
      );

      // Verificar la respuesta de la solicitud PUT
      console.log("Respuesta de la API:", response);

      if (response.status === 200) {
        // La solicitud PUT fue exitosa
        console.log("Contraseña actualizada correctamente");
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: "La contraseña del empleado ha sido actualizada correctamente.",
        });

        // Cerrar el modal después de actualizar la contraseña
        handlePasswordModalClose();
      } else {
        // Manejar un caso donde la solicitud no tenga éxito
        console.error("Error en la solicitud PUT:", response);
        throw new Error("Error al actualizar la contraseña del empleado");
      }
    } catch (error) {
      // Manejar errores capturados durante la solicitud PUT
      console.error("Error al cambiar la contraseña del empleado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar la contraseña del empleado. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  return (
    <div
      style={{
        paddingTop: "5px",
        margin: "0 auto",
        borderRadius: "40px",
        marginTop: "20px",
        boxShadow: "0 4px 12px rgba(128, 0, 128, 0.1)",
        position: "fixed",
        left: "90px",
        top: "80px",
        width: "calc(100% - 100px)",
        overflowY: "auto",
      }}
      className="w-full mx-auto max-w-full"
    >
      <TablePrueba
        title="Gestion de Empleados"
        columns={columns}
        data={empleados}
      />
      {modalData && !modalData.modo && (
        <ModalDinamico
          open={true}
          handleClose={() => setModalData(null)}
          title="Registrar empleados"
          fields={[
            {
              label: "Tip_Documento",
              name: "Tip_Documento",
              type: "select",
              required: true,
              options: [
                { value: "C.C", label: "Cédula de Ciudadanía (C.C)" },
                { value: "C.E", label: "Cédula de extranjería (C.E)" },
              ],
            },
            {
              label: "Documento",
              name: "Documento",
              type: "text",
              required: true,
              icon: "bx-id-card",
            },
            {
              label: "Nombre",
              name: "Nombre",
              type: "text",
              required: true,
              icon: "bx-user", // Icono para el nombre

            },
            {
              label: "Apellido",
              name: "Apellido",
              type: "text",
              required: true,
            },
            {
              label: "Correo",
              name: "Correo",
              type: "text",
              required: true,
            },
            {
              label: "Teléfono",
              name: "Telefono",
              type: "text",
              required: true,
              icon: "bx-phone", // Icono para el teléfono

            },
            {
              label: "Dirección",
              name: "Direccion",
              type: "text",
              required: true,
              icon: "bx-home", // Icono para la dirección

            },
            {
              label: "Contraseña",
              name: "Contrasena",
              type: "password",
              required: true,
            },
            {
              label: "Rol",
              name: "IdRol",
              type: "select",
              required: true,
              options: roles.map((role) => ({
                value: role.idRol,
                label: role.nombre,
              })),
            },
          ]}
          onSubmit={handleSubmit}
          seleccionado={modalData.seleccionado} // Asegúrate de que `modalData.seleccionado` tiene el rol seleccionado
        />
      )}

      {modalData && modalData.modo === "actualizacion" && (
        <ModalDinamico
          open={true}
          handleClose={() => setModalData(null)}
          title="Actualizar Empleado"
          fields={[
            {
              label: "Tip_Documento",
              name: "Tip_Documento",
              type: "select",
              required: true,
              options: [
                { value: "C.C", label: "Cédula de Ciudadanía (C.C)" },
                { value: "C.E", label: "Cédula de extranjería (C.E)" },
              ],
            },
            {
              label: "Nombre",
              name: "Nombre",
              type: "text",
              required: true,
            },
            {
              label: "Apellido",
              name: "Apellido",
              type: "text",
              required: true,
            },
            {
              label: "Correo",
              name: "Correo",
              type: "text",
              required: true,
            },
            {
              label: "Teléfono",
              name: "Telefono",
              type: "text",
              required: true,
            },
            {
              label: "Documento",
              name: "Documento",
              type: "text",
              required: true,
            },
            {
              label: "Rol",
              name: "IdRol",
              type: "select",
              required: true,
              options: roles.map((role) => ({
                value: role.idRol, // ID del rol como valor
                label: role.nombre, // Nombre del rol como texto visible
              })),
              defaultValue: modalData.seleccionado.IdRol, // Usa el ID del rol como valor por defecto
            },
            {
              label: "Direccion",
              name: "Direccion",
              type: "text",
              required: true,
            },
          ]}
          onSubmit={handleActualizacionSubmit}
          seleccionado={modalData.seleccionado}
        />
      )}

      <Modal
        open={openPasswordModal}
        handleClose={handlePasswordModalClose}
        handleSubmit={handleSubmitPasswordChange}
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
        onClick={() => handleOpenModal(empleado)}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
    </div>
  );
};

export default Empleados;
