import React from 'react';
import { Box, Typography, TextField, Button, Grid, Link } from '@mui/material';
// import { WhatsApp, Instagram } from '@mui/icons-material';
// import Footer from './Footer';


const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica de inicio de sesión
    // Por ejemplo, enviar datos a un servidor
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        component="form"
        sx={{
          bgcolor: '#FFE0E3',
          border: '1px solid black',
          padding: 3,
          borderRadius: 7,
          boxShadow: '0px 3px 15px rgba(0,0,0,0.2)',
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Alinea el contenido al centro horizontalmente
        }}
        onSubmit={handleLogin}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar sesión
        </Typography>

        <Box width="80%" mt={3} mb={3}>
          <TextField 
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type="email"
            InputProps={{
              sx: {
                borderRadius: 3,
                bgcolor: 'white',
                '&:hover': {
                  bgcolor: 'white',
                },
              },
            }}
          />
        </Box>

        <Box width="80%" mb={3}>
          <TextField 
            label="Contraseña"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type="password"
            InputProps={{
              sx: {
                borderRadius: 3,
                bgcolor: 'white',
                '&:hover': {
                  bgcolor: 'white',
                },
              },
            }}
          />
        </Box>

        <Box width="40%">
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '45px', borderRadius: 4 }}>
            Iniciar sesión
          </Button>
        </Box>
        
      </Box>
      
    </Box>
    
  );
};
 

export default Login;
