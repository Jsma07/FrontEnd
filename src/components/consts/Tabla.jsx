import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';

// Estilo personalizado para el DataGrid
const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-root': {
    backgroundColor: '#f9f9f9', // Color de fondo personalizado
  },
});

const Tabla = ({ rows, columns, pageSizeOptions = [5, 10] }) => {
  return (
    <StyledDataGrid
      rows={rows}
      columns={columns}
      autoHeight
      pageSize={7}
      disableSelectionOnClick
      initialState={{
        pagination: {
          paginationModel: { page: 0 },
        },
      }}
      pageSizeOptions={pageSizeOptions}
      checkboxSelection
    />
  );
};

export default Tabla;
