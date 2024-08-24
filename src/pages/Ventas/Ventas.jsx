import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tabla from "../../components/consts/Tabla";
import ModalAdiciones from "../../components/consts/AggAdiciones";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [adicionesSeleccionadas, setAdicionesSeleccionadas] = useState([]);
  const [adiciones, setAdiciones] = useState([]);
  const [ventaIdToDelete, setVentaIdToDelete] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState({
    idVentas: null,
  });

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = (idVentas) => {
    console.log("ID de venta recibido:", idVentas);
    if (idVentas) {
      setVentaSeleccionada(idVentas);
      setOpenModal(true);
    } else {
      console.log("Venta no encontrada");
    }
  };

  const fetchVentas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/Jackenail/Listarventas"
      );
      const ventasConDetalles = response.data.map((venta) => {
        // Formatear la fecha a 'YYYY-MM-DD' solo para visualización
        const fechaFormateada = new Date(venta.Fecha)
          .toISOString()
          .split("T")[0];

        // Formatear el precio en pesos colombianos
        const precioFormateado = new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(venta.Total);

        return {
          id: venta.idVentas,
          idServicio: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`http://localhost:5000${venta.servicio.ImgServicio}`}
                alt={venta.servicio.Nombre_Servicio}
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  marginRight: "1rem",
                }}
              />
              <h1 style={{ margin: 0 }}>{venta.servicio.Nombre_Servicio}</h1>
            </div>
          ),
          IdCliente: `${venta.cliente.Nombre} ${venta.cliente.Apellido}`,
          idEmpleado: `${venta.empleado?.Nombre || ""} ${
            venta.empleado?.Apellido || ""
          }`,
          Fecha: fechaFormateada, // Usar la fecha formateada para mostrar
          FechaCompleta: new Date(venta.Fecha), // Guardar la fecha completa para ordenar
          Total: precioFormateado,
          Estado: (
            <div className="flex space-x-2">
              {renderEstadoButton(venta.Estado)}
            </div>
          ),
          Acciones: (
            <div className="flex space-x-2">
              <Link
                to={`/Detalleventa/${venta.idVentas}`}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
              >
                <RemoveRedEyeIcon />
              </Link>

              {venta.Estado === 2 && (
                <Fab
                  key={venta.idVentas}
                  size="small"
                  aria-label="edit"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-green-700 text-white"
                  onClick={() => handleOpenModal(venta.idVentas)}
                >
                  <EditIcon />
                </Fab>
              )}

              {venta.Estado !== 3 && (
                <Fab
                  size="small"
                  aria-label="delete"
                  onClick={() => handleOpenAlert(venta.idVentas)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white"
                >
                  <DeleteIcon />
                </Fab>
              )}
            </div>
          ),
          estiloFila: venta.Estado === 3 ? "bg-gray-200" : "",
        };
      });

      // Ordenar las ventas por la fecha completa, de más reciente a más antigua
      ventasConDetalles.sort((a, b) => b.FechaCompleta - a.FechaCompleta);

      setVentas(ventasConDetalles);
      toast.success("Ventas cargadas exitosamente");
    } catch (error) {
      console.error("Error al obtener los datos de ventas:", error);
      toast.error("Error al cargar las ventas");
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

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

  useEffect(() => {
    const fetchAdiciones = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/Jackenail/Listarventas/adiciones"
        );
        setAdiciones(response.data);
      } catch (error) {
        console.error("Error al obtener las adiciones:", error);
      }
    };

    fetchAdiciones();
  }, []);

  const cambiarEstadoVenta = async (ventaId, nuevoEstado) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/Jackenail/CambiarEstado/${ventaId}`,
        { Estado: nuevoEstado }
      );

      if (response.data.success) {
        setVentas((prevVentas) =>
          prevVentas.map((venta) =>
            venta.id === ventaId
              ? {
                  ...venta,
                  Estado: nuevoEstado,
                  Acciones: (
                    <div className="flex space-x-2">
                      <Link
                        to={`/Detalleventa/${venta.id}`}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
                      >
                        <RemoveRedEyeIcon />
                      </Link>

                      {nuevoEstado === 2 && (
                        <Fab
                          size="small"
                          aria-label="edit"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-green-700 text-white"
                          onClick={() => handleOpenModal(venta.id)}
                        >
                          <EditIcon />
                        </Fab>
                      )}

                      {nuevoEstado !== 3 && (
                        <Fab
                          size="small"
                          aria-label="delete"
                          onClick={() => handleOpenAlert(venta.id)}
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white"
                        >
                          <DeleteIcon />
                        </Fab>
                      )}
                    </div>
                  ),
                }
              : venta
          )
        );
        toast.success("Estado cambiado con éxito", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        toast.error(
          response.data.error || "Error desconocido al cambiar el estado"
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast.error(
        error.response?.data?.error || "Hubo un problema al cambiar el estado"
      );
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

      if (response.data.success) {
        setVentas((prevVentas) =>
          prevVentas.map((venta) =>
            venta.id === ventaId
              ? {
                  ...venta,
                  Estado: renderEstadoButton(3), // Actualiza el estado a 3 (anulado)
                  Acciones: (
                    <div className="flex space-x-2">
                      <Link
                        to={`/Detalleventa/${venta.id}`}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
                      >
                        <RemoveRedEyeIcon />
                      </Link>
                    </div>
                  ), // Mantiene solo el botón de visualizar
                }
              : venta
          )
        );
        toast.success("Venta anulada con éxito");
      } else {
        toast.error(
          response.data.error || "Error desconocido al anular la venta"
        );
      }
    } catch (error) {
      console.error("Error al anular la venta:", error);
      toast.error(
        error.response?.data?.error || "Hubo un problema al anular la venta"
      );
    }
  };

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

  const columns = [
    { field: "Fecha", headerName: "Fecha" },
    { field: "idEmpleado", headerName: "Empleado" },
    { field: "IdCliente", headerName: "Cliente" },
    { field: "idServicio", headerName: "Servicio" },
    { field: "Total", headerName: "Total" },
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

      {ventaSeleccionada && (
        <ModalAdiciones
          open={openModal}
          handleClose={handleCloseModal}
          title="Seleccionar Adiciones"
          adiciones={adiciones}
          setAdicionesSeleccionadas={setAdicionesSeleccionadas}
          adicionesSeleccionadas={adicionesSeleccionadas}
          idVentas={ventaSeleccionada}
          setVentas={setVentas}
        />
      )}
    </div>
  );
};

export default Ventas;
