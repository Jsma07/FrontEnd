import React from "react";
import {
  Modal,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ModalInsumos = ({ open, handleClose, title, insumos }) => {
  const [cantidad, setCantidad] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [carrito, setCarrito] = React.useState([]);

  React.useEffect(() => {
    if (insumos) {
      setTotal(insumos.PrecioUnitario * cantidad);
    }
  }, [insumos, cantidad]);

  const handleCantidadChange = (event) => {
    const newCantidad = parseInt(event.target.value) || 1;
    setCantidad(newCantidad);
    setTotal(newCantidad * insumos.PrecioUnitario);
  };

  const handleAgregar = () => {
    setCarrito([...carrito, { ...insumos, cantidad, total }]);
    setCantidad(1); // Resetear cantidad
    setTotal(insumos.PrecioUnitario); // Resetear total
  };

  if (!insumos) return null; // Asegúrate de que `insumos` esté definido

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
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100px",
                  padding: "0 1rem", // Ajusta según necesites
                }}
              >
                <img
                  src={`http://localhost:5000${insumos.imagen}`}
                  alt={insumos.NombreInsumos}
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
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                {insumos.NombreInsumos}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Precio: ${insumos.PrecioUnitario.toFixed(2)}
              </Typography>
              <Divider sx={{ mt: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Cantidad:
              </Typography>
              <TextField
                type="number"
                inputProps={{ min: 1 }}
                value={cantidad}
                onChange={handleCantidadChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalInsumos;
