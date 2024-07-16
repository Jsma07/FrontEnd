import React, { useState, useContext } from 'react';
import IconButton from '@mui/material/IconButton';

import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserContext } from '../../context/ContextoUsuario';

const SettingsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useContext(UserContext); // Obtenemos user y logout del contexto

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const menuStyle = {
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
          backgroundColor: anchorEl ? '#F291B5' : '#FFE0E3',
          padding: '8px',
          borderRadius: '10px',
          color: anchorEl ? 'white' : 'black',
          '&:hover': {
            backgroundColor: '#F291B5',
            color: 'white'
          }
        }}
      >
        <SettingsIcon sx={{ fontSize: 24 }} />
      </IconButton>
      <Menu
        sx={{ borderRadius: '20px' }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
      >
        <MenuItem disabled onClick={handleSettingsClose} sx={{ color: 'black' }}>
          Bienvenido, {user ? user.nombre : 'Usuario'}
        </MenuItem>

        <MenuItem sx={menuStyle} onClick={handleSettingsClose}>
          <AccountCircleIcon sx={{ marginRight: '10px' }} /> Perfil
        </MenuItem>
        <MenuItem sx={menuStyle} onClick={() => {
          logout(); // Cierra sesión
          handleSettingsClose(); // Cierra el menú
          window.location.href = '/iniciarSesion'; // Cierra el menú después de cerrar sesión
        }}>
          <ExitToAppIcon sx={{ marginRight: '5px' }} /> Cerrar Sesión
        </MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenu;
