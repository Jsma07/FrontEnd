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
    total: 0, // Añadir el campo total
  });

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = (venta) => {
    console.log("Venta recibida:", venta);
    if (venta) {
      setVentaSeleccionada({
        idVentas: venta.idVentas,
        total: venta.Total, // Asegúrate de pasar el total también
      });
      setOpenModal(true);
    } else {
      console.log("Venta no encontrada");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };
  

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get("https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/Listarventas");
  
        // Función para formatear la fecha para mostrar
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };
  
        // Función para formatear el precio a pesos colombianos sin decimales
        const formatCurrency = (amount) => {
          // Redondear el monto al número entero más cercano
          const roundedAmount = Math.round(amount);
          
          // Formatear el monto redondeado como moneda en pesos colombianos
          return roundedAmount.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0, // Asegura que no se muestren decimales
            maximumFractionDigits: 0  // Asegura que no se muestren decimales
          });
        };
  
        // Crear una copia de las ventas y agregar el formato de fecha y moneda para mostrar
        const ventasConDetalles = response.data.map((venta) => ({
          id: venta.idVentas,
          idServicio: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev${venta.servicio.ImgServicio}`}
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
          idEmpleado: `${venta.empleado?.Nombre || ""} ${venta.empleado?.Apellido || ""}`,
          Fecha: formatDate(venta.Fecha),
          FechaOriginal: new Date(venta.Fecha),
          Total: formatCurrency(venta.Total),
          Estado: (
            <div className="flex space-x-2">
              {renderEstadoButton(venta.Estado, venta.idVentas)}
            </div>
          ),
          Acciones: (
            <div className="flex space-x-2">
              <Fab
                style={{
                  fontSize: '16px',
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#F0F0F0',
                }}
                className="text-black-500"
              >
                <Link
                  to={`/Detalleventa/${venta.idVentas}`}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
                >
                  <RemoveRedEyeIcon />
                </Link>
              </Fab>
              {venta.Estado !== 3 && (
                <>
                  {venta.Estado === 2 && (
                    <Fab
                      size="small"
                      aria-label="edit"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-green-700 text-white"
                      onClick={() => handleOpenModal(venta)}
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
          estiloFila: venta.Estado === 3 ? "bg-gray-200" : "",
        }));
  
        ventasConDetalles.sort((a, b) => b.FechaOriginal - a.FechaOriginal);
  
        const ventasFinales = ventasConDetalles.map(({ FechaOriginal, ...rest }) => rest);
  
        setVentas(ventasFinales);
        toast.success("Ventas cargadas exitosamente");
      } catch (error) {
        console.error("Error al obtener los datos de ventas:", error);
        toast.error("Error al cargar las ventas");
      }
    };

    // Inicializar la carga de ventas
    fetchVentas();

    // Configurar el polling para cada 30 segundos
    const intervalId = setInterval(fetchVentas, 30000); // Cada 30 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  
  
  

  const renderEstadoButton = (estado) => {
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
      <span
        className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md ${buttonClass}`}
      >
        {estadoTexto}
      </span>
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

  useEffect(() => {
    const fetchAdiciones = async () => {
      try {
        const response = await axios.get(
          "https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/Listarventas/adiciones"
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
        `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/CambiarEstado/${ventaId}`,
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
        position: "bottom-right",
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
        `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Jackenail/CambiarEstado/${ventaId}`,
        { Estado: 3 }
      );

      if (response.data.success) {
        const updatedVenta = response.data.venta;
        setVentas((prevVentas) =>
          prevVentas.map((venta) =>
            venta.id === ventaId
              ? {
                  ...venta,
                  Estado: updatedVenta.Estado,
                  Acciones: (
                    <div className="flex space-x-2">
                      <Link
                        to={`/Detalleventa/${ventaId}`}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
                      >
                        <RemoveRedEyeIcon />
                      </Link>
                      {/* Aquí agregamos el ícono de eliminar solo si el estado no es Anulado */}
                      {updatedVenta.Estado !== 3 && (
                        <Fab
                          size="small"
                          aria-label="delete"
                          onClick={() => handleOpenAlert(ventaId)}
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
          idVentas={ventaSeleccionada.idVentas}
          totalVenta={ventaSeleccionada.total} // Pasar el total de la venta
          setVentas={setVentas}
        />
      )}
    </div>
  );
};

export default Ventas;
