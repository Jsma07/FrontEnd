import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModalDinamico from "../../components/consts/modaled";
import Modal from "../../components/consts/modalContrasena";
import TablePrueba from "../../components/consts/Tabla";
import CustomSwitch from "../../components/consts/switch";
import { toast } from "react-toastify";
import Fab from '@mui/material/Fab';


const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const [seleccionado, setSeleccionado] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChangeClick = (IdCliente) => {
    const clienteseleccionado = clientes.find(
      (Clientess) => Clientess.IdCliente === IdCliente
    );
    if (clienteseleccionado) {
      setSeleccionado(clienteseleccionado);
      setOpenPasswordModal(true);
    } else {
      console.error("Cliente no encontrado");
      toast.error(
        "Cliente no encontrado. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  const handlePasswordModalClose = () => {
    setOpenPasswordModal(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setSeleccionado(null); // Limpiar el Cliente seleccionado al cerrar el modal
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizar el estado si el componente se desmonta

    const fetchData = async () => {
      try {
        const response = await axios.get("https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/jackenail/Listar_Clientes");
        if (isMounted) {
          setClientes(response.data);
        }
      } catch (error) {
        console.error("Error al obtener los datos de clientes:", error);
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
    setModalData(data);
  };

  const columns = [
    { field: "tipoDocumento", headerName: "Tipo Documento" },
    {
      field: "Img",
      headerName: "Imagen",
      width: 100,
      renderCell: (params) => {
        const imageUrl = `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/${params.row.Img}?${new Date().getTime()}`;
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src={imageUrl}
              alt={params.row.Nombre}
              style={{
                maxWidth: "100%",
                height: "auto",
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
              }}
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
    {
      field: "Verificado",
      headerName: "Verificación",
      width: 150,
      renderCell: (params) => {
        const isVerified = params.row.Verificado;
        return (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.25rem 0.5rem",
              border: "none",
              borderRadius: "12px",
              backgroundColor: isVerified ? "green" : "red",
              color: "white",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
            onClick={() => {
              if (!isVerified) {
                toast.error("No se puede activar al cliente porque no está verificado.");
                return;
              }
              toast.info(`El estado de verificación es ${isVerified ? "Sí" : "No"}`);
            }}
          >
            <i
              className={`bx bx-${isVerified ? "check" : "x"}`}
              style={{ marginRight: "0.25rem", fontSize: "1rem" }}
            ></i>
            {isVerified ? "Verificado" : "No Verificado"}
          </button>
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
              style={{
                fontSize: '16px',
                width: '40px',
                height: '40px',
                backgroundColor: '#F0F0F0',
              }}
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
              style={{
                fontSize: '16px',
                width: '40px',
                height: '40px',
                backgroundColor: '#F0F0F0',
              }}
              onClick={() => handlePasswordChangeClick(params.row.IdCliente)}
              className="text-black-500"
            >
              <i className="bx bx-lock" style={{ fontSize: "24px" }}></i>
            </Fab>
          )}
          <CustomSwitch
            active={params.row.Estado === 1}
            onToggle={() => handleToggleSwitch(params.row)}
            disabled={params.row.Estado === 2}
          />
        </div>
      ),
    },
  ];
  
  
  
  
  const handleSubmit = async (formData) => {
    try {
      // Mostrar confirmación antes de registrar al cliente
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres registrar este cliente?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });
  
      if (result.isConfirmed) {
        // Crear un objeto FormData
        const data = new FormData();

        const formDataNumerico = {
          Nombre: formData.Nombre,
          Apellido: formData.Apellido,
          Correo: formData.Correo,
          Telefono: formData.Telefono,
          Documento: formData.Documento,
          tipoDocumento: formData.Tip_Documento,
          Contrasena: formData.Contrasena,
          Img: formData.Img,
          Estado: 2,
          IdRol: 4,
        };
        
        console.log("Datos del formulario con imagen:", formDataNumerico);
  
        // Enviar los datos al backend
        const response = await axios.post(
          "https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/crearClientesedu",
          formDataNumerico,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        const NuevoCliente = response.data;
        console.log("Nuevo cliente:", NuevoCliente);
        setClientes((prevClient) => [...prevClient, NuevoCliente]);
  
        // Mostrar una alerta de éxito si el registro es exitoso
        toast.success("El cliente se ha registrado correctamente.", {
          position: "top-right",
          autoClose: 3000,
        });
  
        setModalData(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errores = error.response.data.errores || [
          { mensaje: error.response.data.mensaje },
        ];
  
        errores.forEach((error) => {
          toast.error(`Error: ${error.mensaje}`, {
            position: "top-right",
            autoClose: 5000,
          });
        });
      } else {
        console.error("Error al registrar el cliente:", error);
  
        toast.error("Ocurrió un error al registrar el cliente.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    }
  };
  

  const handleToggleSwitch = async (cliente) => {
    if (!cliente.IdCliente) {
      console.error("El ID del cliente es inválido");
      return;
    }
  
    if (!cliente.Verificado) {
      toast.error("No se puede activar al cliente porque no está verificado.");
      return;
    }
  
    const updatedClientes = clientes.map((c) => {
      if (c.IdCliente === cliente.IdCliente) {
        const newEstado = c.Estado === 1 ? 2 : 1; // Cambia 1 por 2 para el estado inactivo
        return { ...c, Estado: newEstado };
      }
      return c;
    });
  
    const updatedCliente = updatedClientes.find(
      (c) => c.IdCliente === cliente.IdCliente
    );
  
    if (!updatedCliente) {
      console.error("No se encontró el cliente actualizado");
      return;
    }
  
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "¿Quieres cambiar el estado del cliente?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });
  
      if (result.isConfirmed) {
        await axios.put(
          `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/CambiarEstadocliente/${cliente.IdCliente}`,
          {
            Estado: updatedCliente.Estado,
          }
        );
  
        setClientes(updatedClientes);
  
        toast.info("El estado del cliente ha sido actualizado correctamente.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error al cambiar el estado del cliente:", error);
      toast.error(
        "Hubo un error al cambiar el estado del cliente. Por favor, inténtalo de nuevo más tarde.",
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );
    }
  };

  const handleActualizacionSubmit = async (formData) => {
    try {
      if (!formData.IdCliente) {
        throw new Error("El ID del cliente no está definido.");
      }
  
      // Verifica la existencia de correo y documento
      const correoExistente = clientes.some(
        (cliente) =>
          cliente.Correo === formData.Correo &&
          cliente.IdCliente !== formData.IdCliente
      );
  
      const documentoExistente = clientes.some(
        (cliente) =>
          cliente.Documento === formData.Documento &&
          cliente.IdCliente !== formData.IdCliente
      );
  
      if (correoExistente) {
        toast.error(
          "El correo electrónico ingresado ya está registrado. Por favor, elija otro correo electrónico.",
          {
            position: "bottom-right",
            autoClose: 3000,
          }
        );
        return;
      }
  
      if (documentoExistente) {
        toast.error(
          "El documento ingresado ya está registrado. Por favor, elija otro documento.",
          {
            position: "bottom-right",
            autoClose: 3000,
          }
        );
        return;
      }
  
      const data = new FormData();
      data.append("IdCliente", formData.IdCliente);
      data.append("Nombre", formData.Nombre);
      data.append("Apellido", formData.Apellido);
      data.append("Correo", formData.Correo);
      data.append("Telefono", formData.Telefono);
      data.append("Documento", formData.Documento);
      data.append("tipoDocumento", formData.tipoDocumento);
      data.append("Contrasena", formData.Contrasena);
      data.append("Estado", formData.Estado);
      data.append("IdRol", formData.IdRol);
      if (formData.Img) {
        data.append("Img", formData.Img); // Aquí estamos agregando el archivo
      }
  
      const url = `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/actualizarClientes/${formData.IdCliente}`;
      const response = await axios.put(url, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      console.log("Respuesta de la API:", response.data);
  
      // Actualiza el cliente en el estado, incluyendo la nueva imagen
      const updatedClientes = clientes.map((cliente) =>
        cliente.IdCliente === formData.IdCliente
          ? { ...cliente, ...formData, Img: response.data.Img }
          : cliente
      );
  
      setClientes(updatedClientes);
  
      toast.success("El cliente se ha actualizado correctamente.", {
        position: "top-right",
        autoClose: 3000,
      });
  
      setModalData(null);
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      toast.error(
        "Ocurrió un error al actualizar el cliente. Inténtelo nuevamente.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };
  

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
        IdCliente: seleccionado.IdCliente,
        newPassword: newPassword,
      });

      const response = await axios.put(
        `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/CambiarContrasena/${seleccionado.IdCliente}`,
        {
          nuevaContrasena: newPassword,
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
          text: "La contraseña del Cliente ha sido actualizada correctamente.",
        });

        // Cerrar el modal después de actualizar la contraseña
        handlePasswordModalClose();
      } else {
        // Manejar un caso donde la solicitud no tenga éxito
        console.error("Error en la solicitud PUT:", response);
        throw new Error("Error al actualizar la contraseña del Cliente");
      }
    } catch (error) {
      // Manejar errores capturados durante la solicitud PUT
      console.error("Error al cambiar la contraseña del empleado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar la contraseña del Cliente. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
     
       
       <TablePrueba
        title="Gestion Clientes"
        columns={columns}
        data={clientes}
      />
          
              {modalData && (
                <ModalDinamico
                  open={true}
                  handleClose={() => setModalData(null)}
                  title="Registrar clientes"
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
                    },
                    {
                      label: "Nombre",
                      name: "Nombre",
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Apellido",
                      name: "Apellido", // Nombre ajustado a "Apellido"
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Correo",
                      name: "Correo", // Nombre ajustado a "Correo"
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Teléfono",
                      name: "Telefono", // Nombre ajustado a "Telefono"
                      type: "text",
                      required: true,
                    },
                    

                    {
                      label: "Contraseña",
                      name: "Contrasena",
                      type: "password",
                      required: true,
                    },
                  ]}
                  onSubmit={handleSubmit}
                  seleccionado={modalData}
                />
              )}

              {modalData && modalData.modo === "actualizacion" && (
                <ModalDinamico
                  open={true}
                  handleClose={() => setModalData(null)}
                  title="Actualizar Cliente"
                  fields={[
                    {
                      label: "Tip_Documento",
                      name: "tipoDocumento",
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
                   
                  ]}
                  onSubmit={handleActualizacionSubmit}
                  seleccionado={modalData.seleccionado}
                />
              )}


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
              onClick={() => handleOpenModal(cliente)}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
        
      <Modal
        open={openPasswordModal}
        handleClose={handlePasswordModalClose}
        handleSubmit={handleSubmitPasswordChange}
      />
    </section>
  );
};

export default Clientes;
