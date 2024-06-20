import React, { useState, useEffect } from 'react';
import ModalDinamico from "../../components/consts/modalJ"; // Ajusta la ruta según la ubicación real de ModalDinamico
import axios from "axios";

const AddRoleModal = ({ open, handleClose }) => {
  const [rol, setRol] = useState(""); // Estado para el nombre del rol
  const [permisos, setPermisos] = useState([]);
  const [roles, setRoles] = useState([]);

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
    // Verificar que el nombre del rol no sea vacío
    if (!formData.nombre.trim()) {
      console.log("campo nombre del rol vacío");
      window.Swal.fire({
        icon: "error",
        title: "Nombre del rol vacío",
        text: "Por favor, ingresa el nombre del rol.",
      });
      return;
    }

    // Verificar si el rol ya existe en la lista actual de roles
    const rolExiste = roles.some((rol) => rol.nombre === formData.nombre);

    if (rolExiste) {
      window.Swal.fire({
        icon: "error",
        title: "Rol existente",
        text: "El Rol ingresado ya está creado. Por favor, utiliza otro nombre.",
      });
      return;
    }

    // Obtener los IDs de los permisos seleccionados
    const permisosSeleccionados = Object.keys(formData)
      .filter((key) => key !== "nombre" && formData[key])
      .map(Number);

    // Verificar que se haya seleccionado al menos un permiso antes de enviar la petición
    if (permisosSeleccionados.length === 0) {
      console.log("Debes seleccionar al menos un permiso");
      window.Swal.fire({
        icon: "error",
        title: "Permiso sin seleccionar",
        text: "Por favor, selecciona al menos un permiso.",
      });
      return;
    }

    try {
      // Realizar la petición POST al backend para crear el rol
      const response = await axios.post("http://localhost:5000/api/roles/crearRol", {
        nombre: formData.nombre,
        permisos: permisosSeleccionados
      });

      // Manejar la respuesta del backend
      if (response.data && response.data.mensaje === 'Rol creado exitosamente') {
        console.log('Rol creado exitosamente:', response.data);

        // Actualizar la lista de roles en el estado local
        const newRole = {
          idRol: response.data.idRol, // Asegúrate de tener el ID del rol desde la respuesta del servidor
          nombre: formData.nombre,
          permisos: permisos.filter(permiso => permisosSeleccionados.includes(permiso.idPermiso))
        };

        setRoles([...roles, newRole]); // Agregar el nuevo rol al estado local de roles
        handleClose(); // Cerrar el modal después de agregar el rol
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
