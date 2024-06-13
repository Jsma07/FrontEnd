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
      <div className="container mx-auto p-4 relative">
        <center><h1 className="text-3xl font-bold mb-4">Gestion De Compras</h1></center>
        <div className="md:flex md:justify-between md:items-center mb-4">
          <div className="relative md:w-64 md:mr-4 mb-4 md:mb-0">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Buscar proveedor</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="bx bx-search w-4 h-4 text-gray-500 dark:text-gray-400"></i>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 pl-8 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Buscar proveedor..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>
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
