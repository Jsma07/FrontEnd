import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const Tabla = ({ rows, columns, pageSizeOptions = [5, 10] }) => {
    const handleToggle = (id) => {
        // Implementa la lógica para cambiar el estado de isActive para la fila con el id dado
        //
    }
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        pageSize={7}
        initialState={{
          pagination: {
            paginationModel: { page: 0 },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection
        style={{ maxWidth: '600px', width: '100%' }}
      />
    </div>
  );
};

export default Tabla;
