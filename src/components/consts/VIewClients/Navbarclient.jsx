import React, { useState, useContext, useRef } from 'react';
import { Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserContext } from '../../../context/ContextoUsuario';
import { useNavigate } from 'react-router-dom';
import ModalPerfil from '../perfil';

function NavbarClient() {
  return (
    <nav className="bg-white shadow-md py-4 font-sans fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <NavigationMenu />
        <div className="flex items-center">
          <Auth />
        </div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex items-center ml-4 lg:ml-10">
      <img src="/jacke.png" alt="Logo" className="h-12 w-12 mr-2" />
      <span className="text-lg font-bold text-black">Jake Nails</span>
    </div>
  );
}

function NavigationMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = (event) => {
    // Cierra el menú si el cursor no está dentro del menú
    if (menuRef.current && !menuRef.current.contains(event.relatedTarget)) {
      setMenuOpen(false);
    }
  };

  return (
    <ul className="flex justify-end items-center space-x-10">
      <MenuItem href="/vistaInicio" text="Inicio" />
      <MenuItem href="/catalogo" text="Servicios" />
      <li
        className="relative"
        onMouseEnter={handleMenuOpen}
        onMouseLeave={handleMenuClose}
        ref={menuRef}
      >
        <a
          href="/solicitarCita"
          className="text-black hover:text-purple-900 transition duration-300 ease-in-out flex items-center"
        >
          <span className="uppercase">Agendamiento</span>
        </a>
        {menuOpen && (
          <div className="menu-dropdown">
            <MenuItem href="/solicitarCita" text="Agendar Cita" />
            <MenuItem href="/misCitas" text="Mis Citas" />
          </div>
        )}
      </li>
      <MenuItem href="/contacto" text="Contacto" />
    </ul>
  );
}

function MenuItem({ href, text }) {
  return (
    <li>
      <a
        href={href}
        className="text-black hover:text-purple-900 transition duration-300 ease-in-out block px-4 py-2"
      >
        <span className="uppercase">{text}</span>
      </a>
    </li>
  );
}

function Auth() {
  const { user, logout } = useContext(UserContext);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    if (user) {
      setAnchorEl(event.currentTarget);
    } else {
      navigate('/iniciarSesion');
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/iniciarSesion');
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
    setOpenProfileModal(false);
  };

  const handleProfileClick = () => {
    setOpenProfileModal(true);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-menu' : undefined;

  return (
    <div>
      <span
        onClick={handleMenuClick}
        className="text-black hover:text-purple-900 transition duration-300 ease-in-out flex items-center ml-4 lg:ml-2 cursor-pointer"
      >
        <span className="uppercase">
          {user ? `Bienvenid@, ${user.nombre || user.Nombre}` : 'Iniciar Sesión'}
        </span>
        <i className="bx bxs-user-circle text-4xl text-black-700 ml-2"></i>
      </span>
      {user && (
        <>
          <MuiMenu
            id={id}
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MuiMenuItem onClick={handleProfileClick}>
              <AccountCircleIcon sx={{ marginRight: '10px' }} /> Perfil
            </MuiMenuItem>
            <MuiMenuItem onClick={handleLogout}>
              <ExitToAppIcon sx={{ marginRight: '5px' }} /> Cerrar Sesión
            </MuiMenuItem>
          </MuiMenu>
          <ModalPerfil open={openProfileModal} handleClose={handleSettingsClose} />
        </>
      )}
    </div>
  );
}

export default NavbarClient;
