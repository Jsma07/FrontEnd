import React, { useState, useEffect } from 'react';
import ModalDinamico from './ModalDinamico';
import axios from 'axios'; // Importa axios u otra librería para hacer solicitudes HTTP

const CrearUsuarioModal = ({ open, handleClose }) => {
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contrasena: '',
    rolId: '', // Inicialmente no se selecciona ningún rol
  });

  const [roles, setRoles] = useState([]); // Almacena los roles disponibles

  // Obtiene los roles disponibles al cargar el componente
  useEffect(() => {
    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/roles'); 
            setRoles(response.data.roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    fetchRoles();
}, []);

  const handleInputChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleCrearUsuario = () => {
    // Aquí puedes enviar los datos del nuevo usuario al servidor
    console.log('Datos del nuevo usuario:', userData);
    // Luego puedes cerrar el modal
    handleClose();
  };

  return (
    <ModalDinamico
      open={open}
      handleClose={handleClose}
      handleSubmit={handleCrearUsuario}
      title="Crear Nuevo Usuario"
      fields={[
        { name: 'nombre', label: 'Nombre', type: 'text' },
        { name: 'apellido', label: 'Apellido', type: 'text' },
        { name: 'correo', label: 'Correo', type: 'text' },
        { name: 'telefono', label: 'Teléfono', type: 'text' },
        { name: 'contrasena', label: 'Contraseña', type: 'text' },
        {
          name: 'rolId',
          label: 'Rol',
          type: 'select',
          options: roles.map(rol => ({ value: rol.idRol, label: rol.nombre })),
        },
        // Agrega más campos según sea necesario, como el campo rolId
      ]}
    />
  );
};

export default CrearUsuarioModal;
