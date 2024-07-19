import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModalDinamico from "../../components/consts/modaled";
import CustomSwitch from "../../components/consts/switch";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Clientes"
        );
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de clientes:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (data) => {
    setModalData(data);
  };
  const columns = [
    { field: "Nombre", headerName: "Nombre" },
    { field: "Apellido", headerName: "Apellido" },
    { field: "Correo", headerName: "Correo" },
    { field: "Telefono", headerName: "Teléfono" },
    { field: "Documento", headerName: "Documento" },
    { field: "Direccion", headerName: "Dirección" },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: "w-48",
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          {params.row.Estado === 1 && (
            <button
              onClick={() =>
                handleOpenModal({
                  ...params.row,
                  modo: "actualizacion",
                  seleccionado: params.row,
                })
              }
            >
              <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
            </button>
          )}
          {params.row.Estado === 1 && (
            <button
              //onClick={() => handlePasswordChangeClick(params.row.IdCliente)}
              className="text-black-500"
            >
              <i className="bx bx-lock" style={{ fontSize: "24px" }}></i>
            </button>
          )}
          <CustomSwitch
            active={params.row.Estado === 1}
            onToggle={() => handleToggleSwitch(params.row.IdCliente)}
          />
        </div>
      ),
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      // Verificar si el correo electrónico o el documento están siendo utilizados por otro cliente
      const correoExistente = clientes.some(
        (cliente) => cliente.Correo === formData.Correo
      );

      const documentoExistente = clientes.some(
        (cliente) => cliente.Documento === formData.Documento
      );

      if (correoExistente) {
        Swal.fire({
          icon: "error",
          title: "Correo electrónico duplicado",
          text: "El correo electrónico ingresado ya está registrado. Por favor, elija otro correo electrónico.",
        });
      } else if (documentoExistente) {
        Swal.fire({
          icon: "error",
          title: "Documento duplicado",
          text: "El documento ingresado ya está registrado. Por favor, elija otro documento.",
        });
      } else {
        // Continuar con el registro del cliente si el correo y el documento no están duplicados
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Quieres registrar este cliente?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          const formDataNumerico = {
            Nombre: formData.Nombre,
            Apellido: formData.Apellido,
            Correo: formData.Correo,
            Telefono: formData.Telefono,
            Estado: 1,
            IdRol: 4,
            Documento: formData.Documento,
            Direccion: formData.Direccion,
            Tip_Documento: formData.Tip_Documento,
            Contrasena: formData.Contrasena,
          };

          console.log("Datos del formulario numéricos:", formDataNumerico);

          await axios.post(
            "http://localhost:5000/Jackenail/RegistrarClientes",
            formDataNumerico
          );

          // Mostrar una alerta de éxito si el registro es exitoso
          Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "El cliente se ha registrado correctamente.",
          });

          // Cerrar el modal después de enviar el formulario
          setModalData(null);

          // Agregar el nuevo cliente a la lista de clientes
          setClientes([...clientes, formDataNumerico]);
        }
      }
    } catch (error) {
      console.error("Error al registrar el cliente:", error);

      // Mostrar una alerta de error si ocurre algún problema durante el registro
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al registrar el cliente.",
        footer: '<a href="#">Inténtelo nuevamente</a>',
      });
    }
  };

  const handleToggleSwitch = async (id) => {
    const updatedClientes = clientes.map((cliente) => {
      if (cliente.IdCliente === id) {
        const newEstado = cliente.Estado === 1 ? 0 : 1;
        return { ...cliente, Estado: newEstado };
      }
      return cliente;
    });

    try {
      const updatedCliente = updatedClientes.find(
        (cliente) => cliente.IdCliente === id
      );
      if (!updatedCliente) {
        console.error("No se encontró el cliente actualizado");
        return;
      }

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
          `http://localhost:5000/Jackenail/CambiarEstadoo/${id}`,
          {
            Estado: updatedCliente.Estado,
          }
        );
        setClientes(updatedClientes);
        Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: "El estado del cliente ha sido actualizado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al cambiar el estado del cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar el estado del cliente. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleActualizacionSubmit = async (formData) => {
    try {
      // Verificar si el correo electrónico o el documento están siendo utilizados por otro cliente
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
        Swal.fire({
          icon: "error",
          title: "Correo electrónico duplicado",
          text: "El correo electrónico ingresado ya está registrado. Por favor, elija otro correo electrónico.",
        });
      } else if (documentoExistente) {
        Swal.fire({
          icon: "error",
          title: "Documento duplicado",
          text: "El documento ingresado ya está registrado. Por favor, elija otro documento.",
        });
      } else {
        // Convertir campos de texto a números si es necesario
        const formDataNumerico = {
          ...formData,
          Telefono: parseInt(formData.Telefono),
          IdRol: 2, // Rol por defecto
        };

        console.log(formDataNumerico);
        console.log(formDataNumerico.IdCliente);

        // Determinar la URL de la API para actualizar el cliente
        const url = `http://localhost:5000/Jackenail/Actualizar/${formDataNumerico.IdCliente}`;

        // Realizar la solicitud de actualización a la API utilizando axios.put
        await axios.put(url, formDataNumerico);

        Swal.fire({
          icon: "success",
          title: "¡Actualización exitosa!",
          text: "El cliente se ha actualizado correctamente.",
        }).then((result) => {
          if (
            result.isConfirmed ||
            result.dismiss === Swal.DismissReason.close
          ) {
            setModalData(null);
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);

      // Mostrar una alerta de error si ocurre algún problema durante la actualización
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al actualizar el cliente.",
        footer: '<a href="#">Inténtelo nuevamente</a>',
      });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
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
        }}
        className="w-full mx-auto max-w-full"
      >
        <div className="bg-white rounded-lg shadow-md p-8 border border-purple-500">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-3xl">Gestion de Clientes</h4>

            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                required
              />
            </div>
          </div>

          <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
            <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
              <div className="flex items-center flex-1 space-x-4">
                <h5>
                  <span className="text-gray-500">All Products:</span>
                  <span className="dark:text-white">123456</span>
                </h5>
                <h5>
                  <span className="text-gray-500">Total sales:</span>
                  <span className="dark:text-white">$88.4k</span>
                </h5>
              </div>
              <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  <svg
                    className="h-3.5 w-3.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    />
                  </svg>
                  Add new product
                </button>
                {/* Otros botones... */}
              </div>
            </div>
            {/* Tabla de datos */}
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto text-sm text-center text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.field}
                        scope="col"
                        className="px-6 py-3 text-center"
                      >
                        {column.headerName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.field}
                          className="px-6 py-3 text-center whitespace-nowrap"
                        >
                          {column.field === "Acciones"
                            ? column.renderCell({ row: cliente })
                            : cliente[column.field]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

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
                        { value: "DNI", label: "DNI" },
                        {
                          value: "Cedula Ciudadania",
                          label: "Cedula Ciudadania",
                        },

                        {
                          value: "Tarjeta de Identidad",
                          label: "Tarjeta de Identidad",
                        },

                        { value: "Pasaporte", label: "Pasaporte" },
                        {
                          value: "Carné de extranjería",
                          label: "Carné de extranjería",
                        },
                      ],
                    },
                    {
                      label: "Nombre",
                      name: "Nombre", // Nombre ajustado a "Nombre"
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
                      label: "Documento",
                      name: "Documento",
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Direccion",
                      name: "Direccion",
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
                  title="Actualizar Empleado"
                  fields={[
                    {
                      label: "Tip_Documento",
                      name: "Tip_Documento",
                      type: "select",
                      required: true,
                      options: [
                        { value: "DNI", label: "DNI" },
                        {
                          value: "Cedula Ciudadania",
                          label: "Cedula Ciudadania",
                        },

                        {
                          value: "Tarjeta de Identidad",
                          label: "Tarjeta de Identidad",
                        },

                        { value: "Pasaporte", label: "Pasaporte" },
                        {
                          value: "Carné de extranjería",
                          label: "Carné de extranjería",
                        },
                      ],
                    },
                    {
                      label: "Nombre",
                      name: "Nombre", // Nombre ajustado a "Nombre"
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
                      label: "Documento",
                      name: "Documento",
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Direccion",
                      name: "Direccion",
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
                  onSubmit={handleActualizacionSubmit}
                  seleccionado={modalData.seleccionado}
                />
              )}
            </div>

            <button
              className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-xl hover:shadow-2xl"
              style={{
                right: "4rem",
                bottom: "4rem",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)", // Sombra negra más pronunciada
              }}
              onClick={() => handleOpenModal(cliente)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clientes;
