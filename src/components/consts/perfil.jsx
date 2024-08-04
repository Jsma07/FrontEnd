import React from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/ContextoUsuario';
import axios from 'axios';
import { toast } from 'react-toastify';
const PerfilUsuario = ({ open, handleClose }) => {
  const { user } = useContext(UserContext);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [documento, setDocumento] = useState('');
  useEffect(() => {
    if (user) {
      console.log('User:', user);
      setNombre(user.nombre);
      setApellido(user.apellido);
      setCorreo(user.correo);
      setTelefono(user.Telefono || user.telefono);
      setDocumento(user.Documento || user.documento);
      setContrasena(user.Contrasena || user.contrasena);
    }
  }, [user]);
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('http://localhost:5000/api/editarPerfil', {
        nombre,
        apellido,
        telefono,
        correo,
        contrasena,
        documento,
        tipo: 'usuario' // o 'empleado' o 'cliente' según sea el caso
      });
      console.log('Respuesta de actualización de perfil:', response.data);
      // setUser(response.data.user);
      toast.success('Datos actualizados correctamente', {
        position: "bottom-right",
        autoClose: 3000,
      });
      handleClose();
    } catch (error) {
      toast.error('Error al actualizar los datos', {
        position: "bottom-right",
        autoClose: 3000,
      });
      console.error('Error al actualizar los datos del usuario:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
      sx={{ display: 'flex', justifyContent: 'flex-end' }} // Positioning the modal to the right
    >
      <Box
        sx={{
          width: 250, // Adjust width as needed
          position: 'absolute',
          right: 0,
          top: 60, // Adjust top position to align with the menu item
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 1,
        }}
      >
        <Typography id="profile-modal-title" variant="h6" component="h2">
          Perfil
        </Typography>
        <form onSubmit={handleUpdate}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Documento"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Actualizar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default PerfilUsuario;
