import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModalDinamico from "../../components/consts/ModalDinamico";

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
      // Verificar si el correo electrónico ya existe en la lista de clientes
      const correoExistente = clientes.some(
        (cliente) => cliente.Correo === formData.Correo
      );

      if (correoExistente) {
        // Mostrar una alerta si el correo electrónico ya está registrado
        Swal.fire({
          icon: "error",
          title: "Correo electrónico duplicado",
          text: "El correo electrónico ingresado ya está registrado. Por favor, elija otro correo electrónico.",
        });
      } else {
        // Continuar con el registro del cliente si el correo electrónico no está duplicado
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Quieres registrar este cliente?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
        });

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

              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-pink-100 dark:bg-pink-700 dark:text-gray-400">
                    <tr>
                      {columns.map((column) => (
                        <th scope="col" class="px-6 py-3">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {room.map((row, index) => (
                      <tr
                        key={index}
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td class="py-4">
                          <div class="flex items-center">
                            <img
                              src={row.image}
                              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
                              alt={row.Nombres}
                            />
                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {row.Nombres}
                            </td>
                          </div>
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {row.apellido}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {row.Correo}
                        </td>

                        <td class="px-6 py-4">{row.telefono}</td>

                        <td class="px-6 py-4">{row.estado}</td>
                        <td class="px-6 py-4">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
