import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import * as Swal from 'sweetalert2';
import Table from "../../components/consts/Tabla";
import Fab from '@mui/material/Fab';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";

const Compras = () => {
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

const handleClick = () => {
  navigate('/compras/crearCompra'); 
};

const DetalleCompra = (id) => {
    console.log('Navigating to:', `/compras/DetalleCompra/${id}`);
    navigate(`/compras/DetalleCompra/${id}`);
};

const AnularCompra = async (IdCompra) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¿Quieres anular esta compra?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/compras/Anular/${IdCompra}`);
        fetchCompras(); 
        Swal.fire({
          icon: 'success',
          title: 'Compra anulada',
          text: 'La compra ha sido anulada correctamente.',
        });
      } catch (error) {
        console.error('Error al anular la compra:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al anular la compra. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    }
};

const canAnular = (fecha_compra) => {
    const [day, month, year] = fecha_compra.split('/').map(Number);
    const fechaCompra = new Date(year, month - 1, day);

    const hoy = new Date();
    const fechaActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const diffTime = fechaActual - fechaCompra;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log('Fecha de compra:', fechaCompra);
    console.log('Fecha actual:', fechaActual);
    console.log('Diferencia en días:', diffDays);

    return diffDays <= 7;
};

const filtrar = compras.filter(compra => {
    return (
      (compra.fecha_compra && compra.fecha_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.descuento_compra && compra.descuento_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.iva_compra && compra.iva_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.subtotal_compra && compra.subtotal_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.total_compra && compra.total_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.estado_compra && compra.estado_compra.toLowerCase().includes(buscar.toLowerCase()))
    );
  });

  return (
    <div>
      <Table
        columns={[
          { field: 'fecha_compra', headerName: 'FECHA', width: 'w-36' },
          { field: 'descuento_compra', headerName: 'DESCUENTO', width: 'w-36' },
          { field: 'iva_compra', headerName: 'IVA', width: 'w-36' },
          { field: 'subtotal_compra', headerName: 'SUBTOTAL', width: 'w-36' },
          { field: 'total_compra', headerName: 'TOTAL', width: 'w-36' },
          {
            field: 'estado_compra',
            headerName: "ESTADO",
            width: "w-36",
            readOnly: true,
            renderCell: (params) => (
              <div>
                {params.row.estado_compra === "Anulada" && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    Anulada
                  </span>
                )}
                {params.row.estado_compra === "Terminada" && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    Terminada
                  </span>
                )}
                {params.row.estado_compra === "Pendiente" && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    Pendiente
                  </span>
                )}
              </div>
            )
          },
          {
            field: 'Acciones',
            headerName: 'ACCIONES',
            width: 'w-48',
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                <button onClick={() => params && DetalleCompra(params.row.IdCompra)} className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                  <RemoveRedEyeIcon /> 
                </button>
                {params.row.estado_compra !== 'Anulada' && canAnular(params.row.fecha_compra) && (
                    <button onClick={() => AnularCompra(params.row.IdCompra)} className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white">
                        <DeleteIcon /> 
                    </button>
                )}
              </div>
            ),
          }
        ]}
        data={filtrar}
        title={'Gestion de Compras'}
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
