import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/consts/theme';
import { toast, ToastContainer } from "react-toastify";

import LoadingScreen from './components/consts/pantallaCarga'; 

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  // Simula una carga falsa durante 3 segundos
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* Renderiza el LoadingScreen solo si isLoading es true */}
        {isLoading && <LoadingScreen />}
        {/* Renderiza el contenido normal solo si isLoading es false */}
        {!isLoading && (
          <>
            <Navbar />
            <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: '80vh', position: 'relative' }}
            >
              <Grid item xs={12} md={8}> {/* Ajusta el tamaño según tus necesidades */}
                <Outlet />
              </Grid>
              {/* Botón en la esquina inferior derecha */}
             
            </Grid>
          </>
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
