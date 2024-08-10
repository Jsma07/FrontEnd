import React, { useState } from "react";
import {
  Modal,
  Typography,
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Tooltip from "@mui/material/Tooltip";

const ModalAdiciones = ({
  open,
  handleClose,
  title = "",
  adiciones,
  setAdicionesSeleccionadas,
  adicionesSeleccionadas,
}) => {
  const [adicionesAgregadas, setAdicionesAgregadas] = useState([]);

  const handleAdd = (id) => {
    const adicionSeleccionada = adiciones.find(
      (adicion) => adicion.IdAdiciones === id
    );
    setAdicionesSeleccionadas([...adicionesSeleccionadas, adicionSeleccionada]);
    setAdicionesAgregadas([...adicionesAgregadas, id]);
  };

  // Función para verificar si una adición ya ha sido agregada
  const isAdicionAgregada = (id) => {
    return adicionesAgregadas.includes(id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-[80%] overflow-auto">
        <Typography variant="h5" gutterBottom className="text-center mb-6">
          {title}
        </Typography>
        <Grid container spacing={3}>
          {adiciones &&
            adiciones.map((adicion) => (
              <Grid item xs={12} sm={6} md={3} key={adicion.IdAdiciones}>
                <Card>
                  <CardHeader
                    title={adicion.NombreAdiciones}
                    subheader={adicion.Estado}
                    action={
                      <Tooltip title={`Precio: $${adicion.Precio}`} arrow>
                        <IconButton>
                          <RemoveRedEyeIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <CardContent>
                    <img
                      src={`http://localhost:5000${adicion.Img}`}
                      alt={adicion.NombreAdiciones}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        width: "100%",
                        borderRadius: "4px",
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mt-2"
                    >
                      Estado: {adicion.Estado}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      onClick={() => handleAdd(adicion.IdAdiciones)}
                      disabled={isAdicionAgregada(adicion.IdAdiciones)}
                      fullWidth
                    >
                      Agregar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
        <div className="flex justify-center mt-6">
          <Button variant="contained" onClick={handleClose} className="w-1/2">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAdiciones;
