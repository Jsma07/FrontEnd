import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Grid } from '@mui/material';

function App() {
  return (
    <Grid container>
      <Navbar />
      <Outlet />
    </Grid>
  );
}

export default App;
