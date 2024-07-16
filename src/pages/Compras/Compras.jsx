import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import Table from "../../components/consts/Tabla";
import Fab from '@mui/material/Fab';
import CustomCard from '../../components/consts/cards';
import modalDetalle from '../../components/consts/modal'

const Compras = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [compras, setCompras] = useState([]);
  const [buscar, setBuscar] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/compras');
      setCompras(response.data);
    } catch (error) {
      console.error('Error fetching Compras:', error);
    }
  };

const handleEditClick = (id) => {
  console.log(`Editando compra con ID: ${id}`);
};

const detail = (id) => {
  console.log(`Editando compra con ID: ${id}`);
};


  const filtrar = compras.filter(compra => {
    return (
      (compra.fecha_compra && compra.fecha_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.descuento_compra && compra.descuento_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.iva_compra && compra.iva_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.subtotal_compra && compra.subtotal_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.estado_compra && compra.estado_compra.toLowerCase().includes(buscar.toLowerCase()))
    );
  });

  const handleClick = () => {
    navigate('/compras/crearCompra'); 
  };

  return (
    <div>
      <Table
        columns={[
          { field: 'fecha_compra', headerName: 'FECHA', width: 'w-36' },
          { field: 'descuento_compra', headerName: 'DESCUENTO', width: 'w-36' },
          { field: 'iva_compra', headerName: 'IVA', width: 'w-36' },
          { field: 'subtotal_compra', headerName: 'SUBTOTAL', width: 'w-36' },
          { field: 'estado_compra', headerName: 'ESTADO', width: 'w-36' },
          {
            field: 'Acciones',
            headerName: 'ACCIONES',
            width: 'w-48',
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                {params.row.estado_compra === 'Pendiente' && (
                  <button onClick={() => handleEditClick(params.row)} className="text-yellow-500">
                    <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
                  </button>
                )}
                <button onClick={() => detail(params.row)} className="text-yellow-500">
                  <i className="bx bx-ghost" style={{ fontSize: "24px" }}></i>
                </button>
              </div>
            ),
          }
          
        ]}
        data={filtrar}
        title={'Gestion de compras'}

      />
      <Fab
        aria-label="add"
        style={{
          border: '0.5px solid grey',
          backgroundColor: '#94CEF2',
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 1000, 
        }}
        onClick={() => handleClick(true)}
      >
        <i className='bx bx-plus' style={{ fontSize: '1.3rem' }}></i>
      </Fab>
    </div>
  );
};

export default Compras;
