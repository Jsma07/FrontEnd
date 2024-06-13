import React, { useState } from "react";
import { Modal, Typography, Grid, Button } from "@mui/material";

const ModalInsumos = ({
  open,
  handleClose,
  title = "",
  insumos,
  setInsumosSeleccionados,
  insumosSeleccionados,
}) => {
  const [insumosAgregados, setInsumosAgregados] = useState([]);

  const handleAdd = (id) => {
    const insumoSeleccionado = insumos.find(
      (insumo) => insumo.IdInsumos === id
    );
    setInsumosSeleccionados([...insumosSeleccionados, insumoSeleccionado]);
    setInsumosAgregados([...insumosAgregados, id]); // Agregar el IdInsumos a la lista de insumos agregados
  };

  // Función para verificar si un insumo ya ha sido agregado
  const isInsumoAgregado = (id) => {
    return insumosAgregados.includes(id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "0.375rem",
          width: "80%",
          maxWidth: "50rem",
          maxHeight: "80%",
          overflow: "auto",
          padding: "1.5rem",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          {title}
        </Typography>
        <Grid container spacing={2}>
          {/* Renderizar las cards de insumos */}
          {insumos &&
            insumos.map((insumo) => (
              <Grid item xs={12} sm={6} key={insumo.IdInsumos}>
                <div
                  className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  style={{ marginBottom: "1rem" }}
                >
                  <a href="#">
                    <img
                      className="p-8 rounded-t-lg w-full"
                      src={insumo.Imagen}
                      alt="Imagen del insumo"
                    />
                  </a>
                  <div className="px-5 pb-5">
                    <a href="#">
                      <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {insumo.NombreInsumos}
                      </h5>
                    </a>
                    <p>Precio unitario: ${insumo.precio_unitario}</p>
                    <p>Usos disponibles: {insumo.UsosDisponibles}</p>
                    <p>Estado: {insumo.Estado}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1.5rem",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleAdd(insumo.IdInsumos)}
                      style={{ width: "50%", fontSize: "0.8rem" }}
                      disabled={isInsumoAgregado(insumo.IdInsumos)} // Deshabilitar el botón si el insumo ya ha sido agregado
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>
        {/* Botón de cancelar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
            style={{ width: "50%", fontSize: "0.8rem" }}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalInsumos;
