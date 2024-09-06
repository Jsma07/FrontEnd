import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Flag from "react-flagkit";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import { Box } from "@mui/system";
import { useDropzone } from "react-dropzone";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Icono para la cámara
import { toast } from "react-toastify";

const ModalDinamico = ({
  open,
  handleClose,
  title = "",
  fields,
  onSubmit,
  seleccionado,
}) => {
  
  const [formData, setFormData] = useState({});
const [showPassword, setShowPassword] = useState({});
const [avatar, setAvatar] = useState(null);
const [avatarFile, setAvatarFile] = useState(null); // Almacena el archivo de imagen

  useEffect(() => {
    if (seleccionado) {
      setFormData(seleccionado);
      setAvatar(seleccionado.avatar || null);
      setAvatarFile(seleccionado.avatarFile || null); // Configura el archivo si está disponible
    } else {
      setFormData({});
      setAvatar(null);
      setAvatarFile(null); // Limpia el archivo si no hay imagen seleccionada
    }
  }, [seleccionado]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

 

  const handleCancel = () => {
    handleClose();
  };

  const handleClickShowPassword = (name) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'documento':
        return <i className='bx bx-id-card' style={{ fontSize: '24px', marginRight: '8px' }}></i>;
      case 'nombre':
      case 'apellido':
        return <i className='bx bx-user' style={{ fontSize: '24px', marginRight: '8px' }}></i>;
      case 'correo':
        return <i className='bx bx-envelope' style={{ fontSize: '24px', marginRight: '8px' }}></i>;
      case 'teléfono':
      case 'telefono':
        return <PhoneIcon style={{ fontSize: '24px', marginRight: '8px' }} />;
      case 'dirección':
      case 'direccion':
        return <HomeIcon style={{ fontSize: '24px', marginRight: '8px' }} />;
      case 'contraseña':
      case 'contrasena':
        return <i className='bx bx-key' style={{ fontSize: '24px', marginRight: '8px' }}></i>;
      case 'rol':
        return <i className='bx bx-briefcase' style={{ fontSize: '24px', marginRight: '8px' }}></i>;
      default:
        return <i className='bx bx-question-mark' style={{ fontSize: '24px', marginRight: '8px' }}></i>;
    }
  };

  const handleSubmit = () => {
    onSubmit({ ...formData, Img: avatarFile });
    handleClose();
  };
  
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(URL.createObjectURL(file)); // Usa URL.createObjectURL para mostrar la imagen
    };
    reader.readAsDataURL(file);
  };
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5242880, // 5 MB
    onDropRejected: () => {
      toast.error("El archivo es demasiado grande o no es una imagen válida.");
    },
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{
        style: {
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          width: "70%",
          maxWidth: "40rem",
          maxHeight: "80%",
          overflow: "auto",
          padding: "2rem",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          zIndex: 1300,
          border: "none",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{ textAlign: "center", marginBottom: "1.5rem", color: "#000000", fontWeight: "bold" }}
        >
          {title}
        </Typography>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <div
  {...getRootProps()}
  style={{
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "2px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    backgroundImage: avatar ? `url(${avatar})` : `none`, // Solo muestra la imagen si hay una cargada
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <input {...getInputProps()} />
  {!avatar && <CameraAltIcon style={{ fontSize: "48px", color: "#aaa" }} />}
</div>

        </div>

        <Grid container spacing={2}>
          {fields &&
            fields.length > 0 &&
            fields.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {getIcon(field.label)}
                  </span>
                  <div style={{ flex: 1 }}>
                    {field.type === "text" && (
                      <TextField
                        id={field.name}
                        name={field.name}
                        label={field.label}
                        variant="standard"
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        type="text"
                        value={formData[field.name] || ""}
                        style={{
                          marginBottom: "0.5rem",
                          borderRadius: "8px",
                          padding: "8px",
                          fontSize: "14px",
                        }}
                        InputProps={{
                          style: {
                            borderRadius: "8px",
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "14px",
                          },
                        }}
                      />
                    )}
                    {field.type === "password" && (
                      <TextField
                        id={field.name}
                        name={field.name}
                        label={field.label}
                        variant="standard"
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        type={showPassword[field.name] ? "text" : "password"}
                        value={formData[field.name] || ""}
                        style={{
                          marginBottom: "0.5rem",
                          borderRadius: "8px",
                          padding: "8px",
                          fontSize: "14px",
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleClickShowPassword(field.name)}
                                edge="end"
                              >
                                {showPassword[field.name] ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          style: {
                            borderRadius: "8px",
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "14px",
                          },
                        }}
                      />
                    )}
                    {field.type === "select" && (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id={`${field.name}-label`}>
                          {field.label}
                        </InputLabel>
                        <Select
                          labelId={`${field.name}-label`}
                          id={field.name}
                          name={field.name}
                          variant="standard"
                          onChange={handleChange}
                          value={formData[field.name] || ""}
                          size="small"
                          renderValue={(selected) => {
                            switch (selected) {
                              case "C.C":
                                return (
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <Flag country="CO" style={{ marginRight: "8px" }} /> Cédula de Ciudadanía (C.C)
                                  </div>
                                );
                              case "C.E":
                                return (
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <span role="img" aria-label="Globe" style={{ marginRight: "8px" }}>🌍</span> Cédula de extranjería (C.E)
                                  </div>
                                );
                              default:
                                return selected;
                            }
                          }}
                          style={{
                            marginBottom: "0.5rem",
                            borderRadius: "8px",
                            padding: "4px 8px",
                            fontSize: "14px",
                          }}
                        >
                          {field.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                {option.value === "C.C" && <Flag country="CO" style={{ marginRight: "8px" }} />}
                                {option.value === "C.E" && <span role="img" aria-label="Globe" style={{ marginRight: "8px" }}>🌍</span>}
                                {option.label}
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {field.type === "switch" && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData[field.name] || false}
                            onChange={handleChange}
                            name={field.name}
                            color="primary"
                          />
                        }
                        label={field.label}
                      />
                    )}
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button
            onClick={handleCancel}
            variant="contained"
            sx={{
              marginRight: "1rem",
              backgroundColor: "#000000",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            endIcon={<SendIcon />}
            sx={{
              backgroundColor: "#9c27b0",
              color: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#7b1fa2",
                boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            Enviar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDinamico;
