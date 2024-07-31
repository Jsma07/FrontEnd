import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tabla from "../../components/consts/Tabla";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Swal from "sweetalert2";

const Salida = () => {
  const [salidas, setSalidas] = useState([]);
  const [salidaIdToDelete, setSalidaIdToDelete] = useState(null);

  useEffect(() => {
    const fetchSalidas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/ListarSalidas" // URL para obtener salidas
        );
        const salidasConDetalles = response.data.map((salida) => ({
          id: salida.IdSalida,
          idInsumo: (
            <img
              src={`http://localhost:5000${salida.insumo.Imagen}`}
              alt={salida.insumo.NombreInsumos}
              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
            />
          ),
          NombreInsumo: salida.insumo.NombreInsumos,
          Fecha: salida.Fecha_salida,
          Cantidad: salida.Cantidad,
          Estado:
            salida.Estado === "1"
              ? "Pendiente"
              : salida.Estado === "Completado"
              ? "Completado"
              : "Desconocido",
          Acciones: (
            <div className="flex space-x-2">
              {salida.Estado !== "Completado" && (
                <>
                  <Link
                    to={`/DetalleSalida/${salida.IdSalida}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
                  >
                    <RemoveRedEyeIcon />
                  </Link>
                  <Fab
                    size="small"
                    aria-label="delete"
                    onClick={() => handleOpenAlert(salida.IdSalida)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white"
                  >
                    <DeleteIcon />
                  </Fab>
                </>
              )}
            </div>
          ),
          estiloFila: salida.Estado === "Completado" ? "bg-gray-200" : "", // Aplicar estilo gris si el estado es "Completado"
        }));
        setSalidas(salidasConDetalles);
      } catch (error) {
        console.error("Error al obtener los datos de salidas:", error);
      }
    };

    fetchSalidas();
  }, []);

  const handleOpenAlert = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás recuperar esta salida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/salidas/${id}`);
          setSalidas(salidas.filter((salida) => salida.id !== id));
          Swal.fire("Eliminado!", "La salida ha sido eliminada.", "success");
        } catch (error) {
          console.error("Error al eliminar la salida:", error);
          Swal.fire("Error!", "No se pudo eliminar la salida.", "error");
        }
      }
    });
  };

  const columns = [
    { field: "idInsumo", headerName: "Insumo" },
    { field: "NombreInsumo", headerName: "Nombre Insumo" },
    { field: "Fecha", headerName: "Fecha" },
    { field: "Cantidad", headerName: "Cantidad" },
    { field: "Estado", headerName: "Estado" },
    { field: "Acciones", headerName: "Acciones" },
  ];

  return (
    <div>
      <Tabla
        title="Gestión de Salidas de Insumos"
        columns={columns}
        data={salidas}
        rowClassName={(row) => row.estiloFila}
      />

      <Link to="/RegistrarSalida">
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

export default Salida;
