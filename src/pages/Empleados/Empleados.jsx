import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModalDinamico from "../../components/consts/modaled";
import CustomSwitch from "../../components/consts/switch";
import TablePrueba from "../../components/consts/Tabla";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleado, setEmpleado] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [roles, setRoles] = useState([]);

  const [modalData, setModalData] = useState(null);
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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Empleados"
        );
        setEmpleados(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de empleados:", error);
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
          <button
            onClick={() =>
              handleOpenModal({
                ...params.row,
                modo: "actualizacion",
                seleccionado: params.row,
              })
            }
          >
            <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>{" "}
          </button>
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
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Quieres registrar este empleado?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          const formDataNumerico = {
            ...formData,
            Telefono: parseInt(formData.Telefono),
            Estado: 1,
            IdRol: 3,
          };

          console.log("Datos del formulario numéricos:", formDataNumerico);

          await axios.post(
            "http://localhost:5000/Jackenail/RegistrarEmpleados",
            formDataNumerico
          );

          Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "El empleado se ha registrado correctamente.",
          });

          setModalData(null);

          setEmpleados([...empleados, formDataNumerico]);
        }
      }
    } catch (error) {
      console.error("Error al registrar el empleado:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al registrar el empleado.",
        footer: '<a href="#">Inténtelo nuevamente</a>',
      });
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
          `http://localhost:5000/Jackenail/CambiarEstadoEmpleado/${id}`,
          {
            Estado: updatedEmpleado.Estado,
          }
        );
        setEmpleados(updatedEmpleados);
        Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: "El estado del empleado ha sido actualizado correctamente.",
        });
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
      // Verificar si el correo o el documento están siendo utilizados por otro empleado
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

      // Convertir campos de texto a números si es necesario
      const formDataNumerico = {
        ...formData,
        Telefono: parseInt(formData.Telefono),
        IdRol: 2, // Rol por defecto
      };

      // Determinar la URL de la API para actualizar el empleado
      const url = `http://localhost:5000/Jackenail/ActualizarEmpleados/${formDataNumerico.IdEmpleado}`;

      // Realizar la solicitud de actualización a la API utilizando axios.put
      await axios.put(url, formDataNumerico);

      Swal.fire({
        icon: "success",
        title: "¡Actualización exitosa!",
        text: "El empleado se ha actualizado correctamente.",
      }).then((result) => {
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
          setModalData(null);
          window.location.reload(); // Recargar la página
        }
      });
    } catch (error) {
      console.error("Error al actualizar el empleado:", error);

      // Mostrar una alerta de error si ocurre algún problema durante la actualización
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al actualizar el empleado.",
        footer: '<a href="#">Inténtelo nuevamente</a>',
      });
    }
  };

  const empleadosFiltrados = empleados.filter((empleado) => {
    return (
      empleado.Nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      empleado.Apellido.toLowerCase().includes(filtro.toLowerCase()) ||
      empleado.Correo.toLowerCase().includes(filtro.toLowerCase()) ||
      empleado.Documento.toLowerCase().includes(filtro.toLowerCase()) ||
      empleado.Telefono.toString().includes(filtro) ||
      (empleado.Estado === 1 ? "Activo" : "Inactivo")
        .toLowerCase()
        .includes(filtro.toLowerCase())
    );
  });

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
      <TablePrueba columns={columns} data={empleadosFiltrados} />

      {modalData && modalData && (
        <ModalDinamico
          open={true}
          handleClose={() => setModalData(null)}
          title="Registrar empleados"
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

      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-xl hover:shadow-2xl"
        style={{
          right: "4rem",
          bottom: "4rem",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
        }}
        onClick={() => handleOpenModal(empleado)}
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
  );
};

export default Empleados;
