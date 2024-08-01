import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import ModalInsumos from "../../components/consts/ModalSalida";

const SalidaInsumos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [insumosAgregadosCount, setInsumosAgregadosCount] = useState(0);
  const [descripcion, setDescripcion] = useState(""); // Estado para la descripción

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Fetch de insumos desde la API
  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/insumos");
        console.log("Datos obtenidos de la API:", response.data); // Verifica los datos aquí
        setInsumos(response.data);
      } catch (error) {
        console.error("Error al obtener los insumos:", error);
      }
    };

    fetchInsumos();
  }, []);

  return (
    <div>
      <div
        style={{
          paddingTop: "10px",
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.3)",
          position: "fixed",
          left: "90px",
          top: "80px",
          width: "calc(40% - 100px)",
          padding: "20px",
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Salida de insumos
          </h2>

          <Button
            type="submit"
            color="blue"
            className="mr-4"
            onClick={handleOpenModal}
          >
            Registrar Salida
          </Button>

          {/* Textarea para la descripción */}
          <div className="mt-4">
            <Textarea
              placeholder="Descripción de la salida"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-md"
              rows={4} // Ajusta la altura del textarea
              style={{
                border: "1px solid #e2e8f0", // Añadir un borde gris claro
                outline: "none", // Quitar el subrayado
                resize: "none", // Desactivar el redimensionamiento
                padding: "8px", // Añadir un poco de padding
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal de Insumos */}
      <ModalInsumos
        open={openModal}
        handleClose={handleCloseModal}
        title="Seleccionar Insumos"
        insumos={insumos}
        setInsumosSeleccionados={setInsumosSeleccionados}
        insumosSeleccionados={insumosSeleccionados}
        setInsumosAgregadosCount={setInsumosAgregadosCount}
      />

      <div
        style={{
          paddingTop: "10px",
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.3)",
          position: "fixed",
          right: "20px",
          top: "80px",
          width: "calc(65% - 100px)",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h3
            style={{ textAlign: "left", fontSize: "23px", fontWeight: "bold" }}
          >
            Insumos Seleccionados
          </h3>
        </div>

        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <p>
            <i className="bx bx-cart-download"></i>{" "}
            <span className="text-lg font-bold">{insumosAgregadosCount}</span>
          </p>
        </div>
        {/* Tabla de Insumos Seleccionados */}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-200">Imagen</th>
              <th className="px-4 py-2 border-b border-gray-200">Nombre</th>
              <th className="px-4 py-2 border-b border-gray-200">Cantidad</th>
              <th className="px-4 py-2 border-b border-gray-200">Categoría</th>
            </tr>
          </thead>
          <tbody>
            {insumosSeleccionados.map((insumo) => (
              <tr key={insumo.IdInsumos}>
                <td className="px-4 py-2 border-b border-gray-200">
                  <img
                    src={`http://localhost:5000${insumo.Imagen}`}
                    alt={insumo.NombreInsumos}
                    className="w-20 h-20 object-cover"
                  />
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {insumo.NombreInsumos}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {insumo.Cantidad}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {insumo.nombre_categoria}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalidaInsumos;
