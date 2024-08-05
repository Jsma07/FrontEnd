import React, { useState, useContext, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
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
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
      sx={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <Box
        sx={{
          width: 350,
          position: 'absolute',
          right: 0,
          top: 60,
          bgcolor: '#333',
          boxShadow: 24,
          p: 3,
          borderRadius: 4,
          color: 'white',
          maxHeight: '80vh', // Ajusta la altura máxima del modal
          overflow: 'auto', // Añade scroll si el contenido excede la altura
        }}
      >
        <Typography id="profile-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
        <i class='bx bx-user' style={{ fontSize: "24px" }}></i>  Perfil
        </Typography>
        <form onSubmit={handleUpdate}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'white' } }} // Etiqueta del campo
            InputProps={{ style: { color: 'white' } }} // Campo del input
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'pink' } } }}
          />
          <TextField
            label="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'pink' } } }}
          />
          <TextField
            label="Correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'pink' } } }}
          />
          <TextField
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'pink' } } }}
          />
          <TextField
            label="Documento"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'pink' } } }}
          />
          <TextField
            label="Contraseña"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'pink' } } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, backgroundColor: '#EF5A6F', '&:hover': { backgroundColor: 'pink' } }}
          >
            Actualizar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default PerfilUsuario;
