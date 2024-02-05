import { Grid } from "@mui/material";
import React, { useState } from "react";
import CommonButton from "../../components/common/commonButton/commonButon";
import Tabla from "../../components/consts/Tabla";
import CustomSwitch from "../../components/consts/switch";


const Roles = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  
  const handleToggle = (id) => {
    const updatedRows = rows.map(row =>
      row.id === id ? { ...row, isActive: !row.isActive } : row
    );
    setRows(updatedRows);
  };

  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'Nombre', headerName: 'Nombre', width: 130 },
    { field: 'Permisos', headerName: 'Permisos', width: 130 },
    {
      field: 'Acciones',
      headerName: 'Acciones',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <CustomSwitch
          active={params.row.isActive}
          onToggle={() => handleToggle(params.row.id)}
        />
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
    <Grid item xs={12} md={8} sx={{ marginTop: { md: 15 }, marginLeft: { md: 'auto' }, width: '100%' }}>
      <Tabla
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 20]}
        onSelectionModelChange={handleSelectionModelChange}
        selectionModel={selectedRows}
      />
    </Grid>
  );
};

export default Roles;
