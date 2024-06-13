import React, { useState, useEffect } from "react";
import ModalDinamico from "../../components/consts/modalJ";
import axios from "axios";

const ModalEditar = ({ open, handleClose, roleId }) => {
  const [rol, setRol] = useState("");
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [formValues, setFormValues] = useState({});
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
    if (open && roleId) {
      fetchRoleData();
      fetchPermisos();
    }
  }, [open, roleId]);

  const fetchRoleData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rol/${roleId}`);
      if (response.data && response.data.rol) {
        const { nombre, permisos: permisosRol } = response.data.rol;
        setRol(nombre);
        setPermisosSeleccionados(permisosRol.map((permiso) => permiso.idPermiso));
        setFormValues((prevValues) => ({
          ...prevValues,
          nombre: nombre,
          ...Object.fromEntries(permisosRol.map((permiso) => [permiso.idPermiso, true])),
        }));
      } else {
        console.error("Error: No se obtuvieron datos válidos del rol");
      }
    } catch (error) {
      console.error("Error al obtener datos del rol:", error);
    }
  };

  const fetchPermisos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/permisos");
      if (response.data) {
        setPermisos(response.data);
      } else {
        console.error("Error: No se obtuvieron datos de permisos");
      }
    } catch (error) {
      console.error("Error al obtener permisos:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "nombre") {
      setRol(value);
    } else {
      const idPermiso = Number(name);
      setPermisosSeleccionados((prevPermisos) =>
        value
          ? [...prevPermisos, idPermiso]
          : prevPermisos.filter((id) => id !== idPermiso)
      );
    }

    console.log(`Field ${name} changed to ${value}`); // Depuración
  };

  const handleEditRole = async (Data) => {
    if (!Data.nombre.trim()){
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
        rol.nombre === Data.nombre && rol.idRol !== roleId
    );

    if (RolExiste) {
      window.Swal.fire({
        icon: "error",
        title: "Rol existente",
        text: "El Rol ingresado ya está creado. Por favor, utiliza otro nombre.",
      });
      return;
    }
    const permisosSeleccionados = Object.keys(Data)
    .filter(key => key !== "nombre" && Data[key])
    .map(Number);
    
  console.log("Permisos seleccionados antes de enviar:", permisosSeleccionados);
  console.log("Submitting form data:", {
    nombre: Data.nombre,
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
    

      const response = await axios.put(
        `http://localhost:5000/api/editarRol/${roleId}`,
        {
          nombre: rol,
          permisos: permisosSeleccionados,
        }
      );

      console.log("Request body:", {
        nombre: rol,
        permisos: permisosSeleccionados,
      });

      if (
        response.data &&
        response.data.mensaje === "Rol actualizado correctamente"
      ) {
        console.log("Respuesta:", response.data);
        handleClose();
      } else {
        console.error("Error al editar el rol:", response.data);
      }
    } catch (error) {
      console.error("Error al editar el rol:", error);
    }
  };

  const fields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      value: formValues.nombre || "",
      onChange: handleChange,
    },
    ...(permisos || []).map((permiso) => ({
      name: permiso.idPermiso.toString(),
      label: permiso.nombre,
      type: "checkbox",
      checked: !!formValues[permiso.idPermiso],
      onChange: handleChange,
    })),
  ];

  return (
    <ModalDinamico
      open={open}
      handleClose={handleClose}
      onSubmit={handleEditRole}
      title="Editar Rol"
      fields={fields}
      onChange={handleChange}
    />
  );
};

export default ModalEditar;
