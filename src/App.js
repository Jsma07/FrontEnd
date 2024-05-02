import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/consts/theme';
import './App.css'; // Importa tu archivo CSS con estilos globales

function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
      <Navbar />
      <div id="root" className="app-container"> {/* Agrega la clase 'app-container' como contenedor principal */}
        
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '80vh' }}
        >
          <Grid item xs={12} md={8}> {/* Ajusta el tamaño según tus necesidades */}
            <Outlet />
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default App;
