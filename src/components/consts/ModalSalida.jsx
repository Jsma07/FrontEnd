import React from "react";
import {
  Modal,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ModalInsumos = ({
  open,
  handleClose,
  title,
  carrito,
  actualizarCarrito,
}) => {
  const handleCantidadChange = (index, event) => {
    const newCantidad = parseInt(event.target.value, 10) || 1;
    const newCarrito = [...carrito];
    newCarrito[index].cantidad = newCantidad;
    actualizarCarrito(newCarrito);
  };

  const handleEliminarInsumo = (index) => {
    const newCarrito = carrito.filter((_, i) => i !== index);
    actualizarCarrito(newCarrito);
  };

  const handleFinalizarCompra = () => {
    console.log("Insumos en el carrito:", carrito);
    actualizarCarrito([]);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-[65%] h-full max-h-[95%] flex flex-col relative ml-auto">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-2 text-white hover:text-gray-400"
          >
            <CloseIcon />
          </button>
          <Typography variant="h5" gutterBottom className="text-center mb-6">
            {title}
          </Typography>
          <Divider sx={{ mt: 2 }} />
          <Typography variant="h6" className="mt-4">
            Carrito de Insumos
          </Typography>
          <div className="flex-grow overflow-auto">
            {carrito.map((item, index) => (
              <div
                key={index}
                className="flex justify-between mt-4 items-center p-4"
                style={{ borderBottom: "1px solid #555" }}
              >
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid item xs={12} md={3}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100px",
                        padding: "0 1rem",
                      }}
                    >
                      <img
                        src={`http://localhost:5000${item.imagen}`}
                        alt={item.NombreInsumos}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          width: "3rem",
                          height: "3rem",
                          borderRadius: "20%",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                      {item.NombreInsumos}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Precio: ${item.PrecioUnitario.toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Cantidad:
                    </Typography>
                    <div className="flex items-center">
                      <IconButton
                        onClick={() =>
                          handleCantidadChange(index, {
                            target: { value: item.cantidad - 1 },
                          })
                        }
                        sx={{
                          backgroundColor: "white",
                          color: "black",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "lightgray",
                          },
                        }}
                      >
                        <i className="bx bx-minus"></i>
                      </IconButton>
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => handleCantidadChange(index, e)}
                        className="mx-2 w-16 text-center bg-transparent border-none text-white"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "4px",
                          color: "white",
                          padding: "4px 8px",
                          border: "none",
                          outline: "none",
                        }}
                      />
                      <IconButton
                        onClick={() =>
                          handleCantidadChange(index, {
                            target: { value: item.cantidad + 1 },
                          })
                        }
                        sx={{
                          backgroundColor: "white",
                          color: "black",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "lightgray",
                          },
                        }}
                      >
                        <i className="bx bx-plus"></i>
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={2} className="text-right">
                    <IconButton
                      onClick={() => handleEliminarInsumo(index)}
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "lightgray",
                        },
                      }}
                    >
                      <i className="bx bx-trash"></i>
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
            ))}
          </div>
          <Button
            onClick={handleFinalizarCompra}
            sx={{
              mt: 2,
              backgroundColor: "#EF5A6F",
              color: "#fff",
              "&:hover": { backgroundColor: "#e6455c" },
            }}
            fullWidth
          >
            Sacar insumos
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalInsumos;
