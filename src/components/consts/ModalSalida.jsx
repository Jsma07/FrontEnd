import React, { useState } from "react";
import {
  Modal,
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ModalInsumos = ({
  open,
  handleClose,
  title = "",
  insumos,
  setInsumosSeleccionados,
  insumosSeleccionados,
  setInsumosAgregadosCount,
}) => {
  const [insumosAgregados, setInsumosAgregados] = useState([]);

  const handleAdd = (id) => {
    const insumoSeleccionado = insumos.find(
      (insumo) => insumo.IdInsumos === id
    );
    setInsumosSeleccionados([...insumosSeleccionados, insumoSeleccionado]);
    setInsumosAgregados([...insumosAgregados, id]);
    setInsumosAgregadosCount(insumosAgregados.length + 1);
  };

  const isInsumoAgregado = (id) => {
    return insumosAgregados.includes(id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-[80%] h-full max-h-[90%] flex flex-col relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-2 text-white hover:text-gray-400"
          >
            <CloseIcon />
          </button>
          <Typography variant="h5" gutterBottom className="text-center mb-6">
            {title}
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {insumos.map((insumo) => (
              <Grid item key={insumo.IdInsumos} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    maxWidth: 345,
                    bgcolor: "black",
                    color: "white",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:5000${insumo.Imagen}`}
                    alt={insumo.NombreInsumos}
                    style={{
                      borderRadius: "12px",
                      objectFit: "cover",
                      width: "100%",
                      marginBottom: "16px",
                    }}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {insumo.NombreInsumos}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Cantidad: {insumo.Cantidad}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Precio Unitario: {insumo.PrecioUnitario}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ mt: "auto", mb: "16px" }}>
                    <Button
                      variant="contained"
                      disabled={isInsumoAgregado(insumo.IdInsumos)}
                      onClick={() => handleAdd(insumo.IdInsumos)}
                      sx={{
                        backgroundColor: "#1976D2",
                        color: "#FFFFFF",
                        "&:hover": {
                          backgroundColor: "#1565C0",
                        },
                      }}
                    >
                      Agregar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <div className="flex justify-center mt-6">
            <Button
              variant="contained"
              onClick={handleClose}
              className="w-1/2 text-sm bg-blue-500 hover:bg-blue-600"
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
