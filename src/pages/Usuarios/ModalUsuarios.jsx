// ModalUsuarios.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalDinamico from '../../components/consts/modal';

const ModalUsuarios = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    apellidoUsuario: '',
    correo: '',
    telefono: '',
    rolId: '', // Asegúrate de que el campo de rol esté inicializado como una cadena vacía
    contraseña: '',
    estado: 1
  });

  const [roles, setRoles] = useState([]); // Estado para almacenar los roles obtenidos del backend

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

  // Utiliza los roles obtenidos del backend para configurar las opciones del campo de selección
  const fields = [
    { name: 'nombreUsuario', label: 'Nombre', type: 'text' },
    { name: 'apellidoUsuario', label: 'Apellidos', type: 'text' },
    { name: 'correo', label: 'Correo', type: 'text' },
    { name: 'telefono', label: 'Teléfono', type: 'text' },
    { 
      name: 'rolId', 
      label: 'Rol', 
      type: 'select', 
      options: roles.map(role => ({ value: role.id, label: role.nombre })) // Mapea los roles obtenidos para crear las opciones
    },
    { name: 'contraseña', label: 'Contraseña', type: 'password' }
  ];
  const handleCrearUsuario = async () => {
    console.log('NUEVOOOOO:', formData); // Verifica los datos del nuevo usuario antes de enviar la solicitud
  
    try {
      const response = await axios.post('http://localhost:5000/api/crearUsuario', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Asegúrate de configurar correctamente el tipo de contenido si estás enviando FormData
        }
      }); // Envia la solicitud POST
      console.log('Respuesta del servidor:', response.data); // Imprime la respuesta del servidor
      handleClose(); // Cierra el modal después de enviar la solicitud
    } catch (error) {
      console.error('Error al crear usuario:', error); // Maneja cualquier error que ocurra durante la solicitud
    }
};

  

  return (
    <ModalDinamico
      open={open}
      handleClose={handleClose}
      handleSubmit={handleCrearUsuario}
      title="Crear Nuevo Usuario"
      fields={fields}
      formData={formData} // Pasa formData al componente ModalDinamico
      setFormData={setFormData} // Pasa setFormData al componente ModalDinamico
    />
  );
};

export default ModalUsuarios;
