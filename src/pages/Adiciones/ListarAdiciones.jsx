import React, { useEffect, useState } from "react";
import axios from "axios";
import TablePrueba from "../../components/consts/Tabla";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ListarAdiciones = () => {
  const [adiciones, setAdiciones] = useState([]);

  const [columns, setColumns] = useState([
    { field: "IdAdiciones", headerName: "ID" },
    { field: "NombreAdiciones", headerName: "Nombre" },
    {
      field: "Imagen",
      headerName: "Imagen",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            src={`http://localhost:5000${params.row.Img}`}
            alt={params.row.NombreAdiciones}
            style={{
              maxWidth: "100%",
              height: "auto",
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
            }}
          />
        </div>
      ),
    },
    {
      field: "Estado",
      headerName: "Estado",
      renderCell: (params) =>
        renderEstadoButton(params.row.Estado, params.row.IdAdiciones), // Usa params.row.Estado
    },
  ]);

  const renderEstadoButton = (estado, adicionId) => {
    let buttonClass, estadoTexto;

    switch (estado) {
      case 1: // Activo
        buttonClass = "bg-green-500"; // Verde para Activo
        estadoTexto = "Activo";
        break;
      case 2: // Inactivo
        buttonClass = "bg-red-500"; // Rojo para Inactivo
        estadoTexto = "Inactivo";
        break;
      default:
        buttonClass = "bg-gray-500"; // Gris para Desconocido
        estadoTexto = "Desconocido";
    }

    return (
      <button
        className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none ${buttonClass}`}
        onClick={() => handleEstadoClick(adicionId, estado)}
      >
        {estadoTexto}
      </button>
    );
  };

  const handleEstadoClick = (adicionId, estadoActual) => {
    // Cambia el estado a 2 si es 1, o a 1 si es 2
    const nuevoEstado = estadoActual === 1 ? 2 : 1;

    // Mostrar la ventana de confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas cambiar el estado de la adición a ${nuevoEstado}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, realizar la solicitud para actualizar el estado
        axios
          .put(`http://localhost:5000/Jackenail/CambiaEstado/${adicionId}`, {
            Estado: nuevoEstado,
          })
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            setAdiciones((prevAdiciones) =>
              prevAdiciones.map((adicion) =>
                adicion.IdAdiciones === adicionId
                  ? { ...adicion, Estado: nuevoEstado }
                  : adicion
              )
            );
            toast.success("Estado actualizado correctamente");
          })
          .catch((error) => {
            console.error("Error al actualizar el estado:", error);
            toast.error(
              `Error al actualizar el estado: ${
                error.response ? error.response.data.mensaje : error.message
              }`
            );
          });
      }
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/Jackenail/Listarventas/adiciones")
      .then((response) => {
        console.log(response.data);
        setAdiciones(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las adiciones:", error);
        toast.error("Error al obtener las adiciones");
      });
  }, []);

  return (
    <TablePrueba
      title="Gestión de Adiciones"
      columns={columns}
      data={adiciones}
    />
  );
};

export default ListarAdiciones;
