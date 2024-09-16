import React, { useState } from "react";
import { Modal, Typography, TextField, Button, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LockIcon from "@mui/icons-material/Lock";

const ModalContrasena = ({ open, handleClose, handleSubmit }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(newPassword, confirmPassword);
    setNewPassword(""); // Vacía el estado de nueva contraseña
    setConfirmPassword("");
  };

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      style={{ backdropFilter: 'blur(8px)' }} // Mejora el desenfoque de fondo
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "24px",
          minWidth: "300px",
          maxWidth: "400px",
          boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
          outline: "none", // Elimina el borde por defecto
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          style={{ textAlign: "center", marginBottom: "2rem", fontWeight: 'bold' }}
        >
          <LockIcon
            fontSize="medium"
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          Cambiar Contraseña
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="newPassword"
                name="newPassword"
                label="Nueva Contraseña"
                variant="outlined"
                fullWidth
                type="password"
                value={newPassword}
                onChange={handleChangeNewPassword}
                required
                InputProps={{
                  style: {
                    borderRadius: "8px",
                    height: "50px", // Ajusta la altura del campo de entrada
                    fontSize: "12px", // Tamaño del texto dentro del campo
                    borderRadius: "20px",
                  },
                  inputProps: {
                    style: {
                      padding: "8px", // Ajusta el padding interno del campo
                    }
                  }
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño de la etiqueta
                    top: "8px", // Ajusta la posición vertical de la etiqueta
                  },
                }}
                style={{ marginBottom: "1.5rem" }} // Espacio entre campos
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar Contraseña"
                variant="outlined"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
                required
                InputProps={{
                  style: {
                    borderRadius: "8px",
                    height: "50px", // Ajusta la altura del campo de entrada
                    fontSize: "12px", // Tamaño del texto dentro del campo
                    borderRadius: "20px",
                    textAlign: "center"
                  },
                  inputProps: {
                    style: {
                      padding: "8px", // Ajusta el padding interno del campo
                    }
                  }
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Tamaño de la etiqueta
                    top: "8px", // Ajusta la posición vertical de la etiqueta
                  },
                }}
              />
            </Grid>
          </Grid>
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
              style={{
                width: "45%",
                marginRight: "10px",
                borderRadius: "20px",
                textTransform: "none",
                padding: "8px 12px", // Padding del botón
                fontWeight: "bold",
                fontSize: "14px", // Tamaño del texto del botón
                backgroundColor: "#000000", // Color negro
                color: "#FFFFFF",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                '&:hover': {
                  backgroundColor: "#333333", // Color negro oscuro al pasar el cursor
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              style={{
                width: "45%",
                borderRadius: "20px",
                textTransform: "none",
                padding: "8px 12px", // Padding del botón
                fontWeight: "bold",
                fontSize: "14px", // Tamaño del texto del botón
                backgroundColor: "#6A1B9A", // Color morado
                color: "#FFFFFF",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                '&:hover': {
                  backgroundColor: "#4A148C", // Color morado oscuro al pasar el cursor
                }
              }}
              startIcon={<SendIcon />}
            >
              Enviar
            </Button>
          </div>
        </form>


      </div>
    </Modal>
  );
};

export default ModalContrasena;
