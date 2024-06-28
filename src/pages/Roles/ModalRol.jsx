import React, { useState, useEffect } from 'react';
import ModalDinamico from "../../components/consts/modalJ";
import axios from "axios";

const AddRoleModal = ({ open, handleClose, setRoles }) => {
  const [rol, setRol] = useState(""); // Estado para el nombre del rol
  const [permisos, setPermisos] = useState([]);
  const [rolesLocal, setRolesLocal] = useState([]); // Utiliza rolesLocal para mantener una copia local actualizada

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchPermisos();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/roles');
      if (response.data && Array.isArray(response.data)) {
        const rolesWithPermissions = response.data.map(role => ({
          ...role,
          permisos: role.permisos || [] // Asegurar que permisos siempre sea un array
        }));
        setRolesLocal(rolesWithPermissions); // Actualiza rolesLocal con la lista de roles desde el servidor
        setRoles(rolesWithPermissions); // También actualiza setRoles con la lista de roles desde el servidor
      } else {
        console.error('Data received is empty or malformed:', response.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

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

    if (formData.nombre.trim() !== formData.nombre) {
      window.Swal.fire({
        icon: "error",
        title: "Nombre del rol con espacios",
        text: "El nombre del rol no puede contener espacios al inicio ni al final.",
      });
      return;
    }

    // Verificar si el rol ya existe en la lista actual de roles
    const rolExiste = rolesLocal.some((rol) => rol.nombre === formData.nombre);

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
        permisos: permisosSeleccionados,
        EstadoRol: 1 // Siempre crear el rol con EstadoRol activo (1)
      });

      // Manejar la respuesta del backend
      if (response.data && response.data.mensaje === "Rol creado exitosamente") {
        window.Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "El rol ha sido creado correctamente.",
        });

        // Actualiza rolesLocal con el nuevo rol creado
        const nuevoRol = { idRol: response.data.id, nombre: formData.nombre, permisos: permisosSeleccionados, EstadoRol: 1 };
        setRolesLocal((prevRoles) => [...prevRoles, nuevoRol]);
        setRoles((prevRoles) => [...prevRoles, nuevoRol]);

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
