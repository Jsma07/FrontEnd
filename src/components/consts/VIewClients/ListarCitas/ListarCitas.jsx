import { Box, Typography } from "@mui/material";
import NavbarClient from '../Navbarclient'; // Ajusta la ruta según tu estructura de archivos

const ListarCliente = () => {
  return (
    <>
      <NavbarClient />
      <Box sx={{ mt: 10, p: 2 }}> {/* mt: 10 para dejar espacio para el Navbar */}
        <Typography variant="h4" component="h1" gutterBottom>
          Citas
        </Typography>
        {/* Aquí puedes agregar el contenido de tu vista ListarCliente */}
      </Box>
    </>
  );
}

export default ListarCliente;
