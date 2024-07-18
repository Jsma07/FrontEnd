import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tabla from "../../components/consts/Tabla";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaIdToDelete, setVentaIdToDelete] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/Jackenail/Listarventas"
        );
        const ventasConDetalles = response.data.map((venta) => ({
          id: venta.idVentas,
          idServicio: (
            <img
              src={`http://localhost:5000${venta.servicio.ImgServicio}`}
              alt={venta.servicio.Nombre_Servicio}
              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
            />
          ),
          IdCliente: `${venta.cliente.Nombre} ${venta.cliente.Apellido}`,
          idEmpleado: `${venta.empleado.Nombre} ${venta.empleado.Apellido}`,
          Fecha: venta.Fecha,
          Total: venta.Total,
          Subtotal: venta.Subtotal,
          Estado: (
            <div className="flex space-x-2">
              {renderEstadoButton(venta.Estado, venta.idVentas)}
            </div>
          ),
          Acciones: (
            <div className="flex space-x-2">
              {venta.Estado !== 3 && (
                <>
                  <Link
                    to={`/Detalleventa/${venta.idVentas}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
                  >
                    <RemoveRedEyeIcon />
                  </Link>

                  {venta.Estado === 2 && (
                    <Fab
                      size="small"
                      aria-label="edit"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-green-700 text-white"
                    >
                      <EditIcon />
                    </Fab>
                  )}

                  <Fab
                    size="small"
                    aria-label="delete"
                    onClick={() => handleOpenAlert(venta.idVentas)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white"
                  >
                    <DeleteIcon />
                  </Fab>
                </>
              )}
            </div>
          ),
          estiloFila: venta.Estado === "Anulado" ? "bg-gray-200" : "",
        }));
        setVentas(ventasConDetalles);
        toast.success("Ventas cargadas exitosamente");
      } catch (error) {
        console.error("Error al obtener los datos de ventas:", error);
        toast.error("Error al cargar las ventas");
      }
    };

    fetchVentas();
  }, []);

  const renderEstadoButton = (estado, ventaId) => {
    let buttonClass, estadoTexto;

    switch (estado) {
      case 1: // Vendido
        buttonClass = "bg-green-500";
        estadoTexto = "Vendido";
        break;
      case 2: // En Preparación
        buttonClass = "bg-purple-500";
        estadoTexto = "En Preparación";
        break;
      case 3: // Anulado
        buttonClass = "bg-red-500";
        estadoTexto = "Anulado";
        break;
      default:
        buttonClass = "bg-gray-500";
        estadoTexto = "Desconocido";
    }

    return (
      <button
        className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none ${buttonClass}`}
        onClick={() => handleEstadoClick(ventaId, estado)}
      >
        {estadoTexto}
      </button>
    );
  };

  const handleEstadoClick = async (ventaId, estadoActual) => {
    // Validaciones de cambio de estado
    if (estadoActual === 2) {
      // Desde En Preparación se puede cambiar a Vendido
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro de cambiar el estado a Vendido?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        cambiarEstadoVenta(ventaId, 1); // Cambiar a Vendido
      }
    } else if (estadoActual === 1) {
      // Desde Vendido no se puede cambiar a En Proceso
      toast.warn("la Venta  finalizada, no se permite cambiar el estado", {
        position: "top-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
    } else {
      // Otros casos (Anulado o Desconocido)
      toast.info("Venta anulada, no se permite cambiar su estado", {
        position: "top-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
    }
  };

  const cambiarEstadoVenta = async (ventaId, nuevoEstado) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/Jackenail/CambiarEstado/${ventaId}`,
        { Estado: nuevoEstado }
      );
      // Actualizar el estado local de la venta
      setVentas((prevVentas) =>
        prevVentas.map((venta) =>
          venta.id === ventaId ? { ...venta, Estado: nuevoEstado } : venta
        )
      );
      console.log("Estado cambiado con éxito:", response.data);
      toast.success("Estado cambiado con éxito", {
        position: "top-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast.error("Hubo un problema al cambiar el estado", {
        position: "top-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
    }
  };
  const handleOpenAlert = (ventaId) => {
    setVentaIdToDelete(ventaId);

    // Mostrar SweetAlert 2 para confirmar la anulación
    Swal.fire({
      title: "¿Estás seguro de anular esta venta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Anular Venta",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAnularVenta(ventaId);
      } else {
        setVentaIdToDelete(null);
      }
    });
  };

  const handleAnularVenta = async (ventaId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/Jackenail/CambiarEstado/${ventaId}`,
        { Estado: 3 }
      );

      // Actualizar el estado local de la venta
      setVentas((prevVentas) =>
        prevVentas.map((venta) =>
          venta.id === ventaId
            ? { ...venta, Estado: renderEstadoButton(3), Acciones: null } // Remover Acciones si el estado es Anulado
            : venta
        )
      );
      console.log("Venta anulada con éxito:", response.data);
      toast.success("Venta anulada con éxito");
    } catch (error) {
      console.error("Error al anular la venta:", error);
      toast.error("Hubo un problema al anular la venta");
    }
  };

  const columns = [
    { field: "idServicio", headerName: "Servicio" },
    { field: "IdCliente", headerName: "Cliente" },
    { field: "idEmpleado", headerName: "Empleado" },
    { field: "Fecha", headerName: "Fecha" },
    { field: "Total", headerName: "Total" },
    { field: "Subtotal", headerName: "Subtotal" },
    { field: "Estado", headerName: "Estado" },
    { field: "Acciones", headerName: "Acciones" },
  ];

  return (
    <div>
      <Tabla
        title="Gestion de ventas"
        columns={columns}
        data={ventas}
        rowClassName={(row) => row.estiloFila}
      />

      <Link to="/RegistrarVentas">
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
        >
          <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
        </Fab>
      </Link>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Ventas;
