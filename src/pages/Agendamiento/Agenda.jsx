import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Tabla from "../../components/consts/Tabla";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import dayjs from 'dayjs';

const Agendamientos = () => {
  const [agendamientos, setAgendamientos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgendamientos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/agendas");
        const agendamientosConDetalles = response.data.map((agendamiento) => ({
          id: agendamiento.IdAgenda,
          cliente: `${agendamiento.cliente.Nombre} ${agendamiento.cliente.Apellido}`,
          nombreServicio: agendamiento.servicio.Nombre_Servicio,
          imagenServicio: (
            <img
              src={`http://localhost:5000${agendamiento.servicio.ImgServicio}`}
              alt={agendamiento.servicio.Nombre_Servicio}
              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
              style={{ display: 'block', margin: 'auto' }}
            />
          ),
          empleado: `${agendamiento.empleado.Nombre} ${agendamiento.empleado.Apellido}`,
          Fecha: dayjs(agendamiento.Fecha).format('DD/MM/YYYY'), // Formatear Fecha
          Hora: agendamiento.Hora, // Mostrar Hora directamente
          EstadoAgenda: renderEstadoButton(
            agendamiento.EstadoAgenda,
            agendamiento.IdAgenda
          ),
          Acciones: (
            <div className="flex space-x-2">
              <Link
                to={`/DetalleAgendamiento/${agendamiento.IdAgenda}`}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
              >
                <RemoveRedEyeIcon />
              </Link>
              <Fab
                size="small"
                aria-label="delete"
                onClick={() => handleOpenAlert(agendamiento.IdAgenda)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white"
              >
                <DeleteIcon />
              </Fab>
            </div>
          ),
          estiloFila: agendamiento.EstadoAgenda === 3 ? "bg-gray-200" : "",
        }));
        setAgendamientos(agendamientosConDetalles);
        toast.success("Agendamientos cargados exitosamente");
      } catch (error) {
        console.error("Error al obtener los datos de agendamientos:", error);
        toast.error("Error al cargar los agendamientos");
      }
    };

    fetchAgendamientos();
  }, []);

  const renderEstadoButton = (estado, agendamientoId) => {
    let buttonClass, estadoTexto;

    switch (estado) {
      case 1:
        buttonClass = "bg-green-500";
        estadoTexto = "En Proceso";
        break;
      case 2:
        buttonClass = "bg-gray-500";
        estadoTexto = "Inactivo";
        break;
      default:
        buttonClass = "bg-red-500";
        estadoTexto = "Desconocido";
    }

    return (
      <button
        className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none ${buttonClass}`}
        onClick={() => handleEstadoClick(agendamientoId, estado)}
      >
        {estadoTexto}
      </button>
    );
  };

  const handleEstadoClick = async (agendamientoId, estadoActual) => {
    if (estadoActual === 1) {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro de cambiar el estado a Inactivo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        cambiarEstadoAgendamiento(agendamientoId, 2);
      }
    } else {
      toast.info("Estado no permite cambios adicionales", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const cambiarEstadoAgendamiento = async (agendamientoId, nuevoEstado) => {
    try {
      await axios.put(
        `http://localhost:5000/api/agendas/editar/${agendamientoId}`,
        { EstadoAgenda: nuevoEstado }
      );

      setAgendamientos((prevAgendamientos) =>
        prevAgendamientos.map((agendamiento) =>
          agendamiento.id === agendamientoId
            ? {
                ...agendamiento,
                EstadoAgenda: renderEstadoButton(nuevoEstado, agendamientoId),
              }
            : agendamiento
        )
      );
      toast.success("Estado cambiado con éxito", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast.error("Hubo un problema al cambiar el estado", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleOpenAlert = (agendamientoId) => {
    Swal.fire({
      title: "¿Estás seguro de anular este agendamiento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Anular Agendamiento",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAnularAgendamiento(agendamientoId);
      }
    });
  };

  const handleAnularAgendamiento = async (agendamientoId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/agendas/editar/${agendamientoId}`,
        { EstadoAgenda: 3 }
      );

      setAgendamientos((prevAgendamientos) =>
        prevAgendamientos.map((agendamiento) =>
          agendamiento.id === agendamientoId
            ? {
                ...agendamiento,
                EstadoAgenda: renderEstadoButton(3, agendamientoId),
                Acciones: null,
              }
            : agendamiento
        )
      );
      toast.success("Agendamiento anulado con éxito");
    } catch (error) {
      console.error("Error al anular el agendamiento:", error);
      toast.error("Hubo un problema al anular el agendamiento");
    }
  };

  const columns = [
    { field: "imagenServicio", headerName: "Imagen", align: "center" },
    { field: "nombreServicio", headerName: "Servicio" },
    { field: "Fecha", headerName: "Fecha" },
    { field: "Hora", headerName: "Hora" },
    { field: "empleado", headerName: "Empleado" },
    { field: "cliente", headerName: "Cliente" },
    { field: "EstadoAgenda", headerName: "Estado" },
    { field: "Acciones", headerName: "Acciones" },
  ];

  return (
    <div>
      <Tabla
        title="Gestión de Agendamientos"
        columns={columns}
        data={agendamientos}
        rowClassName={(row) => row.estiloFila}
      />
      <Fab
        aria-label="add"
        style={{
          border: "0.9px solid grey",
          backgroundColor: "#94CEF2",
          position: "fixed",
          bottom: "50px",
          right: "50px",
          zIndex: 1000,
        }}
        onClick={() => navigate('/RegistrarAgendamiento')}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
    </div>
  );
};

export default Agendamientos;
