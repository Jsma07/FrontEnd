import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModalDinamico from "../../components/consts/modal";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState([]);

  const [modalData, setModalData] = useState(null);

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
    { name: "FotoPerfil", label: "Foto de Perfil" },
    { name: "Nombre", label: "Nombre" },
    { name: "Apellido", label: "Apellido" },
    { name: "Correo", label: "Correo" },
    { name: "Telefono", label: "Teléfono" },
    { name: "Estado", label: "Estado" },
    { name: "IdRol", label: "ID de Rol" },
  ];
  const handleSubmit = async (formData) => {
    try {
      // Mostrar un diálogo de confirmación antes de registrar el cliente
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres registrar este cliente?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      // Si el usuario hace clic en "Sí", procede con el registro del cliente
      if (result.isConfirmed) {
        // Normalizar el valor del campo "Estado" si es necesario
        let EstadoNormalizado;
        if (formData.Estado === "Activo") {
          EstadoNormalizado = 1;
        } else if (formData.Estado === "Inactivo") {
          EstadoNormalizado = 2;
        } else {
          // Valor predeterminado si el Estado no coincide con ninguno de los valores esperados
          EstadoNormalizado = 0;
        }

        // Convertir campos de texto a números si es necesario
        const formDataNumerico = {
          ...formData,
          Telefono: parseInt(formData.Telefono),
          Estado: EstadoNormalizado,
          IdRol: parseInt(formData.IdRol),
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
          text: "El usuario se ha registrado correctamente.",
        });

        // Cerrar el modal después de enviar el formulario
        setModalData(null);
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

  const handleActualizacionSubmit = async (formData) => {
    try {
      // Normalizar el valor del campo "Estado" si es necesario
      let estadoNormalizado;
      if (formData.Estado === "Inactivo") {
        estadoNormalizado = 1;
      } else if (formData.Estado === "Activo") {
        estadoNormalizado = 2;
      } else {
        estadoNormalizado = 0;
      }

      // Convertir campos de texto a números si es necesario
      const formDataNumerico = {
        ...formData,
        Telefono: parseInt(formData.Telefono),
        Estado: estadoNormalizado,
        IdRol: parseInt(formData.IdRol),
      };

      console.log(formDataNumerico);

      // Determinar la URL de la API para actualizar el cliente
      const url = `http://localhost:5000/Jackenail/Actualizar/${formDataNumerico.IdCliente}`;

      // Realizar la solicitud de actualización a la API utilizando axios.put
      await axios.put(url, formDataNumerico);

      // Mostrar una alerta de éxito si la actualización es exitosa
      Swal.fire({
        icon: "success",
        title: "¡Actualización exitosa!",
        text: "El cliente se ha actualizado correctamente.",
      });

      // Cerrar el modal después de enviar el formulario
      setModalData(null);
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
    <div
      style={{
        paddingTop: "5px",
        width: "90vw",
        margin: "0 auto",
        marginLeft: "-11vw",
        borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
        marginTop: "-40px",
      }}
    >
      <div
        className="w-full mx-auto max-w-full"
        style={{
          position: "fixed",
          top: "calc(50% - 90px)",
          left: "90px",
          top: "80px",
          width: "92%",
          overflowY: "auto",
        }}
      >
        <div className="w-full mx-auto max-w-full">
          <div className="bg-white rounded-lg shadow-md p-8 border border-purple-500">
            <h4 className="text-5xl mb-4">Gestión de Clientes</h4>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900"></div>

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-pink-100 dark:bg-pink-700 dark:text-gray-400">
                    <tr>
                      {columns.map((column) => (
                        <th key={column.name} scope="col" className="px-6 py-3">
                          {column.label}
                        </th>
                      ))}
                      <th>
                        Acciones
                        <button onClick={() => handleOpenModal(cliente)}>
                          Abrir Modal
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        {columns.map((column) => (
                          <td
                            key={column.name}
                            className="px-6 py-4 font-semibold text-gray-900 dark:text-white"
                          >
                            {column.name === "FotoPerfil" ? (
                              <img
                                src={cliente.FotoPerfil}
                                className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
                                alt={`${cliente.Nombre} ${cliente.Apellido}`}
                              />
                            ) : column.name === "Estado" ? (
                              <span className="inline-flex items-center">
                                <span
                                  className={`h-2 w-2 rounded-full mr-1 ${
                                    cliente[column.name] === 1
                                      ? "bg-blue-500"
                                      : cliente[column.name] === 2
                                      ? "bg-green-500"
                                      : ""
                                  }`}
                                ></span>{" "}
                                {cliente[column.name] === 1
                                  ? "Activo"
                                  : cliente[column.name] === 2
                                  ? "Inactivo"
                                  : ""}
                              </span>
                            ) : (
                              cliente[column.name]
                            )}
                          </td>
                        ))}

                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleOpenModal({
                                ...cliente,
                                modo: "actualizacion",
                                seleccionado: cliente,
                              })
                            }
                            class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          >
                            <i class="bx bxs-edit"></i>
                          </button>
                        </td>
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
                        label: "Estado",
                        name: "Estado", // Nombre ajustado a "Estado"
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Foto de Perfil",
                        name: "FotoPerfil",
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Rol",
                        name: "IdRol", // Nombre ajustado a "IdRol"
                        type: "text",
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
                        label: "Estado",
                        name: "Estado",
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Foto de Perfil",
                        name: "FotoPerfil",
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Rol",
                        name: "IdRol",
                        type: "text",
                        required: true,
                      },
                    ]}
                    onSubmit={handleActualizacionSubmit}
                    seleccionado={modalData.seleccionado}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
