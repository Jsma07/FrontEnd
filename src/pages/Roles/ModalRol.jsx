import React, { useState, useEffect } from 'react';
import ModalDinamico from "../../components/consts/modalJ"; // Ajusta la ruta según la ubicación real de ModalDinamico
import axios from "axios";

const AddRoleModal = ({ open, handleClose }) => {
  const [rol, setRol] = useState(""); // Estado para el nombre del rol
  const [permisos, setPermisos] = useState([]);
  const [roles, setRoles] = useState([])
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/roles'); 
        if (response.data && Array.isArray(response.data)) {
          const rolesWithPermissions = response.data.map(role => ({
            ...role,
            permisos: role.permisos || [] // Asegurar que permisos siempre sea un array
          }));
          setRoles(rolesWithPermissions);
        } else {
          console.error('Data received is empty or malformed:', response.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);


  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        // se hace una peticion para traer los permisos 
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
    // se verifica que el nombre del rol no sea vacio
    if (!formData.nombre.trim()){
      console.log("campo nombre del rol vacio");
      window.Swal.fire({
        icon: "error",
        title: "Nombre del rol vacío",
        text: "Por favor, ingresa el nombre del rol.",
      });
        return;
    }
    const RolExiste = roles.some(
      (rol) =>
        rol.nombre === formData.nombre 
    );

    if (RolExiste) {
      window.Swal.fire({
        icon: "error",
        title: "Rol existente",
        text: "El Rol ingresado ya está creado. Por favor, utiliza otro nombre.",
      });
      return;
    }
    const permisosSeleccionados = Object.keys(formData)
    .filter(key => key !== "nombre" && formData[key])
    .map(Number);
    
  console.log("Permisos seleccionados antes de enviar:", permisosSeleccionados);
  console.log("Submitting form data:", {
    nombre: formData.nombre,
    permisos: permisosSeleccionados
  });
  // se verifica que al menos se seleccione un permiso antes de mandar la peticion
    if (permisosSeleccionados.length === 0) {
      console.log("Debes seleccionar al menos un permiso");
      window.Swal.fire({
        icon: "error",
        title: "Permiso sin seleccionar",
        text: "Por favor, selecciona al menos un permiso.",
      });      return;
    }
    try {
     
      
  
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
      onSubmit={handleAddRole} 
      title="Agregar Nuevo Rol"
      fields={fields}
    />
   
  );
};

export default AddRoleModal;
