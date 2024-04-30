import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CerrarSesion from '@mui/icons-material/ExitToApp';
import Cuenta from '@mui/icons-material/AccountCircle';

const SettingsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };
const Abierto = Boolean(anchorEl);

const EstiloMenu = {
  '&:hover': {
    backgroundColor: '#8C09FF',
    color: 'white',
    borderRadius: '10px'
  }
};
  return (
    <>
    
      <IconButton
        color="inherit"
        aria-label="settings"
        edge="end"
        onClick={handleSettingsClick}
        sx={{
          backgroundColor: Abierto ? '#F291B5' : '#FFE0E3',
          padding: '8px',
          borderRadius: '10px',
          color: Abierto ? 'white' : 'black' ,

          '&:hover': {
            backgroundColor: '#F291B5',
            color: 'white'
          },
          
        }}
      >
        <SettingsIcon sx={{fontSize: 24}} />
      </IconButton>
      <Menu sx={{borderRadius:'20px'}}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
      >
        {/* Aquí puedes agregar las opciones de configuración */}
        <MenuItem disabled
         onClick={handleSettingsClose}
         sx={{
          color:'black'
         }}
         >Johan Martinez</MenuItem>

        <MenuItem sx={EstiloMenu} onClick={handleSettingsClose}><Cuenta sx={{marginRight:'10px'}}/> Perfil</MenuItem>
        <MenuItem sx={EstiloMenu} onClick={handleSettingsClose}><CerrarSesion sx={{marginRight:'5px'}}/> Cerrar Sesion   </MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenu;
