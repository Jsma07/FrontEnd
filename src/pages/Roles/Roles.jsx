import React, { useState } from "react";
import { Grid, IconButton } from "@mui/material";
import Tabla from "../../components/consts/Tabla";
import CustomSwitch from "../../components/consts/switch";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add'; // Importa el icono de agregar
import { yellow } from "@mui/material/colors";
import AddRoleModal from "./ModalRol";
import Modal from '@mui/material/Modal';

const Roles = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Estado para controlar la apertura y cierre del modal
  const [originalSize, setOriginalSize] = useState('1');

  const handleMouseEnter = (event) => {
    const iconSize = event.target.getBoundingClientRect().width;
    setOriginalSize(iconSize + 'px');
    event.target.style.transform = 'scale(1.2)';
  };

  const handleMouseLeave = (event) => {
    event.target.style.transform = 'scale(1)';
  };
  const handleToggle = (id) => {
    // Implementa la lógica para cambiar el estado de isActive para la fila con el id dado
  };

  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleEditClick = (event, id) => {
    // Implementa la lógica para manejar el clic en el botón de editar
  };

  const handleViewDetailsClick = (event, id) => {
    // Implementa la lógica para manejar el clic en el botón de ver detalles
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'Nombre', headerName: 'Nombre', width: 130 },
    { field: 'Permisos', headerName: 'Permisos', width: 130 },
    {
      field: 'Acciones',
      headerName: 'Acciones',
      width: 200, // Ajusta el ancho según sea necesario
      sortable: false,
      renderCell: (params) => (
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <IconButton
              style={{ color: yellow[500] }}
              size="small"
              onClick={() => handleOpenModal(params.row.id)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}            >
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewDetailsClick(params.row.id)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}            >
              <VisibilityIcon />
            </IconButton>
          </Grid>
          {/* Agrega el icono de agregar */}
          <Grid item>
          <CustomSwitch
              active={params.row.isActive}
              onToggle={() => handleToggle(params.row.id)}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      field: 'Agregar',
      headerName: '', // Puedes dejarlo vacío para que no haya texto en la cabecera
      width: 100,
      sortable: false,
      renderHeader: () => (
        <IconButton
          size="small"
          onClick={handleOpenModal}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <AddIcon />
        </IconButton>
      ),
    },
  ];

  const [rows, setRows] = useState([
    { id: 1, Nombre: 'Administrador', Permisos: 'CRUD', isActive: false },
    { id: 2, Nombre: 'Empleado', Permisos: 'RU', isActive: false },
    { id: 3, Nombre: 'Cliente', Permisos: 'RU', isActive: false },
    { id: 4, Nombre: 'Cajero', Permisos: 'RU', isActive: false },
    { id: 5, Nombre: 'A', Permisos: 'RU', isActive: true },
  ]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        position: 'relative',
        top: '-100px',
        marginLeft: { md: 'auto' },
        marginRight: { md: 'auto' },
        width: '100%',
        overflow: 'hidden',
        maxWidth: '100%' // Ocultar el desplazamiento
      }}
    >
      <Grid item xs={12} md={8}>
        <Tabla
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 20]}
          onSelectionModelChange={handleSelectionModelChange}
          selectionModel={selectedRows}
        />
      </Grid>
      {/* Renderiza el modal */}
      <AddRoleModal open={openModal} handleClose={handleCloseModal} />
    </Grid>
  );
};

export default Roles;
