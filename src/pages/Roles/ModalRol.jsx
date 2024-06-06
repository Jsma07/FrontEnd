import React, { useState, useEffect } from 'react';
import ModalDinamico from "../../components/consts/modal"; // Ajusta la ruta según la ubicación real de ModalDinamico
import axios from "axios";

const AddRoleModal = ({ open, handleClose }) => {
  const [rol, setRol] = useState(""); // Estado para el nombre del rol
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/permisos");
        if (response.data) {
          const permisosFromApi = response.data.map(permiso => ({
            ...permiso,
            selected: false
          }));
          console.log("Permisos fetched from API:", permisosFromApi); // Depuración
          setPermisos(permisosFromApi);
        } else {
          console.error("Error: No se obtuvieron datos de permisos");
        }
      } catch (error) {
        console.error("Error al obtener permisos:", error);
      }
    };
  
    fetchPermisos();
  }, []);
  
  const handleChange = (e) => {
    const { value } = e.target;
    setRol(value.trim()); // Actualizar el estado del nombre del rol
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedPermisos = permisos.map((permiso) =>
      permiso.idPermiso.toString() === name ? { ...permiso, selected: checked } : permiso
    );
    console.log("Checkbox state updated:", updatedPermisos); // Depuración
    setPermisos(updatedPermisos);
  };
  
  const handleAddRole = async (formData) => {
    try {
      const permisosSeleccionados = Object.keys(formData)
        .filter(key => key !== "nombre" && formData[key])
        .map(Number);
        
      console.log("Permisos seleccionados antes de enviar:", permisosSeleccionados);
      console.log("Submitting form data:", {
        nombre: formData.nombre,
        permisos: permisosSeleccionados
      });
  
      // Aquí se realiza la petición POST al backend
      const response = await axios.post("http://localhost:5000/api/roles/crearRol", {
        nombre: formData.nombre,
        permisos: permisosSeleccionados
      });
  
      // Manejo de la respuesta del backend
      if (response.data && response.data.mensaje === 'Rol creado exitosamente') {
        console.log('Rol creado exitosamente:', response.data);
        handleClose();
      } else {
        console.error('Error al crear el rol:', response.data);
      }
    } catch (error) {
      console.error("Error al crear el rol:", error);
    }
  };

  // Definir los campos dinámicos para el formulario modal
  const fields = [
    { name: "nombre", label: "Nombre", type: "text", value: rol, onChange: handleChange }, // Campo para el nombre del rol
    ...permisos.map(permiso => ({
      name: permiso.idPermiso.toString(),
      label: permiso.nombre,
      type: "checkbox",
      checked: permiso.selected || false,
      onChange: handleCheckboxChange,
    })),
  ];

  // Renderizar el componente ModalDinamico con los campos dinámicos y funciones correspondientes
  return (
    <ModalDinamico
      open={open}
      handleClose={handleClose}
      onSubmit={handleAddRole} // Pasar la función handleAddRole como onSubmit
      title="Agregar Nuevo Rol"
      fields={fields}
    />
  );
};

export default AddRoleModal;
