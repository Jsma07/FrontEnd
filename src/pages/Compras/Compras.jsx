import React, { useState } from "react";
import CustomSwitch from "../../components/consts/switch";
import Table from "../../components/consts/Tabla";
import { Grid, Button as CommonButton } from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CustomModal from "../../components/consts/Modal";

const Compras = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleToggleSwitch = (id) => {
    // Encuentra la fila correspondiente al ID
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        // Invierte el estado isActive
        return { ...row, isActive: !row.isActive };
      }
      return row;
    });

    // Actualiza el estado de las filas
    setRows(updatedRows);
  };

  const handleEditClick = (id) => {
    console.log(`Editando rol con ID: ${id}`);
    handleOpenModal();
  };

  const handleViewDetailsClick = (id) => {
    console.log(`Viendo detalles del rol con ID: ${id}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClick = () => {
    handleOpenModal();
  };

  const handleAddCompra = (formData) => {
    console.log('Datos del nuevo proveedor:', formData);
    handleCloseModal();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 'w-16' },
    { field: 'Fecha', headerName: 'Fecha', width: 'w-36' },
    { field: 'IVA', headerName: 'IVA', width: 'w-36' },
    { field: 'Descuento', headerName: 'Descuento', width: 'w-36' },
    { field: 'Subtotal', headerName: 'Subtotal', width: 'w-36' },
    { field: 'Estado', headerName: 'Estado', width: 'w-36' },

    {
      field: 'Acciones',
      headerName: 'Acciones',
      width: 'w-48',
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          <button onClick={() => handleEditClick(params.row.id)} className="text-yellow-500">
            <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
          </button>
          <button onClick={() => handleViewDetailsClick(params.row.id)} className="text-blue-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a2 2 0 110-4 2 2 0 010 4z"
                clipRule="evenodd"
              />
            </svg>|
          </button>
          <CustomSwitch
            active={params.row.isActive}
            onToggle={() => handleToggleSwitch(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const [rows, setRows] = useState([
    { id: 1, Fecha: '10/11/2023', IVA: 2300, Descuento: 10000, Subtotal: 760000, Estado: 'Terminada' },
    { id: 2, Fecha: '31/12/2023', IVA: 2300, Descuento: 45000, Subtotal: 1060000, Estado: 'Pendiente'},
    { id: 3, Fecha: '06/01/2024', IVA: 2500, Descuento: 23000, Subtotal: 940000, Estado: 'Cancelada' },
    { id: 4, Fecha: '20/02/2024', IVA: 2500, Descuento: 20000, Subtotal: 900000, Estado: 'Terminado' },
    { id: 5, Fecha: '29/03/2024', IVA: 2500, Descuento: 5000, Subtotal: 250000, Estado: 'Terminada' },
  ]);


  const fields = [
    { name: 'Fecha compra', label: 'Fecha compra', icon: null },
    { name: 'Estado', label: 'Estado', icon: null },


  ];
  return (
    <Grid item xs={0} md={0} sx={{width: '100%'}}>
      <div>
        <center><h1 style={{ marginTop: '-30px' }}>Gestion De Compras</h1></center>
        <CommonButton
          color="primary"
          variant="contained"
          onClick={handleClick} 
          sx={{
            color: 'black',
            minHeight: 40,
            px: 2.5,
            borderRadius: '10px',
            backgroundColor: '#EFD4F5',
            marginTop:'5px',
            '&:hover': {
              backgroundColor: '#8C09FF',
              color: 'white',
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
            },
          }}>
          <AddBusinessIcon />
        </CommonButton>
        <Table columns={columns} data={rows} />
        <CustomModal open={openModal} handleClose={handleCloseModal} title="Actualizar Compra" fields={fields} onSubmit={handleAddCompra} /> {/* Renderiza el modal */}
      </div>
    </Grid>
  );
};

export default Compras;
