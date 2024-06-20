import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tabla from "../../components/consts/Tabla";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
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
              src={venta.servicio.ImgServicio}
              alt={venta.servicio.Nombre_Servicio}
              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
            />
          ),
          IdCliente: `${venta.cliente.Nombre} ${venta.cliente.Apellido}`,
          idEmpleado: `${venta.empleado.Nombre} ${venta.empleado.Apellido}`,
          Fecha: venta.Fecha,
          Total: venta.Total,
          Subtotal: venta.Subtotal,
          Estado: convertirEstado(venta.Estado),
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
          estiloFila: venta.Estado === 3 ? "bg-gray-200" : "", // Aplicar estilo gris si el estado es "Anulado"
        }));
        setVentas(ventasConDetalles);
      } catch (error) {
        console.error("Error al obtener los datos de ventas:", error);
      }
    };

    fetchVentas();
  }, []);

  const convertirEstado = (estado) => {
    switch (estado) {
      case 1:
        return "Vendido";
      case 2:
        return "En proceso";
      case 3:
        return "Anulado";
      default:
        return "Desconocido";
    }
  };

  const handleOpenAlert = (ventaId) => {
    setVentaIdToDelete(ventaId);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, anular venta!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAnularVenta(ventaId);
      }
    });
  };

  const handleAnularVenta = async (ventaId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/Jackenail/CambiarEstado/${ventaId}`,
        { Estado: 3 }
      );
      console.log("Venta anulada con éxito:", response.data);
      Swal.fire("Anulada!", "La venta ha sido anulada.", "success");

      // Actualizar el estado local de la venta
      setVentas((prevVentas) =>
        prevVentas.map((venta) =>
          venta.id === ventaId
            ? { ...venta, Estado: convertirEstado(3), Acciones: null } // Remover Acciones si el estado es Anulado
            : venta
        )
      );
    } catch (error) {
      console.error("Error al anular la venta:", error);
      Swal.fire("Error!", "Hubo un problema al anular la venta.", "error");
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
    </div>
  );
};

export default Ventas;
