import React, { useState } from "react";
import { Modal, Typography, Button,  Divider } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

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
    const insumoSeleccionado = insumos.find((insumo) => insumo.IdInsumos === id);

    if (insumoSeleccionado) {
      const nuevoDetalleCompra = {
        ...insumoSeleccionado,
      };

      setInsumosSeleccionados([...insumosSeleccionados, nuevoDetalleCompra]);
      setInsumosAgregados([...insumosAgregados, id]);
    }
  };

  const handleRemove = (id) => {
    setInsumosSeleccionados(insumosSeleccionados.filter((insumo) => insumo.IdInsumos !== id));
    setInsumosAgregados(insumosAgregados.filter((insumoId) => insumoId !== id));
  };

  const isInsumoAgregado = (id) => {
    return insumosAgregados.includes(id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="bg-white text-black rounded-lg shadow-lg p-6 w-[90%] h-full max-h-[90%] flex flex-col relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-2 text-black hover:text-gray-600"
          >
            <CloseIcon />
          </button>
          <Typography variant="h5" gutterBottom className="text-center mb-6">
            {title}
          </Typography>
          <Divider sx={{ mt: 2 }} />
          <div className="flex-grow overflow-auto">
            <div className="flex flex-col space-y-4">
              {insumos &&
                insumos.map((insumo) => (
                  <div
                    key={insumo.IdInsumos}
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          className="w-20 h-20 rounded-full"
                          src={`http://localhost:5000${insumo.imagen}`}
                          alt={insumo.NombreInsumos}
                        />
                        <div className="flex-1 min-w-0 ms-4">
                          <p className="text-lg font-bold text-gray-900 truncate">
                            {insumo.NombreInsumos}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Cantidad: {insumo.Cantidad}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Precio: {insumo.PrecioUnitario}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {!isInsumoAgregado(insumo.IdInsumos) ? (
                          <Button
                            variant="contained"
                            onClick={() => handleAdd(insumo.IdInsumos)}
                            className="text-xs"
                            style={{
                              backgroundColor: "#87CEEB",
                              color: "#fff",
                              textTransform: "none",
                            }}
                          >
                            Agregar
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleRemove(insumo.IdInsumos)}
                            className="text-xs"
                            style={{
                              backgroundColor: "#EF5A6F",
                              color: "#fff",
                              textTransform: "none",
                            }}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button
              variant="contained"
              onClick={handleClose}
              className="w-1/2 text-sm"
              style={{
                backgroundColor: "#EF5A6F",
                color: "#fff",
                "&:hover": { backgroundColor: "#e6455c" },
              }}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
  
  
};

export default ModalInsumos;
