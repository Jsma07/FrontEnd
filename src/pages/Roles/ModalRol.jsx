import React, { useState } from "react";
import { Button, Modal } from "@mui/material";
import ModalDinamico from "../../components/consts/ModalDinamico";

const AddRoleModal = ({ open, handleClose }) => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({
    Dashboard: { Leer: false, Crear: false },
    Usuarios: { Leer: false, Crear: false },
    Configuracion: { Leer: false, Crear: false },
    Ventas: { Leer: false, Crear: false },
  });

  const fields = [
    { name: "roleName", label: "Nombre", type: "text" },
    { name: "Dashboard.Leer", label: "Leer Dashboard", type: "checkbox" },
    { name: "Dashboard.Crear", label: "Crear Dashboard", type: "checkbox" },
    { name: "Usuarios.Leer", label: "Leer Usuarios", type: "checkbox" },
    { name: "Usuarios.Crear", label: "Crear Usuarios", type: "checkbox" },
    {
      name: "Configuracion.Leer",
      label: "Leer Configuración",
      type: "checkbox",
    },
    {
      name: "Configuracion.Crear",
      label: "Crear Configuración",
      type: "checkbox",
    },
    { name: "Ventas.Leer", label: "Leer Ventas", type: "checkbox" },
    { name: "Ventas.Crear", label: "Crear Ventas", type: "checkbox" },
  ];

  const handleAddRole = () => {
    // Aquí puedes implementar la lógica para agregar el nuevo rol con los permisos seleccionados
    console.log("Nuevo rol y permisos:", { roleName, permissions });
    // Luego puedes cerrar el modal
    handleClose();
  };

  return (
    <ModalDinamico
      open={open}
      handleClose={handleClose}
      handleSubmit={handleAddRole}
      title="Agregar Nuevo Rol"
      fields={fields}
    />
  );
};

export default AddRoleModal;
