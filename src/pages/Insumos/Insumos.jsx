import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from "../../components/consts/Tabla";
import ModalAgregarInsumo from "../../components/consts/modal";
import ModalEditarInsumo from "../../components/consts/modalEditar";
import CamposObligatorios from "../../components/consts/camposVacios";
import Fab from '@mui/material/Fab';

const Insumos = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]); // Estado para categorías
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

  useEffect(() => {
    fetchInsumos();
    fetchCategorias(); // Obtener categorías al montar el componente
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Error fetching insumos:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const handleAddInsumo = async (formData) => {
    try {
      const { NombreInsumos, Cantidad, UsosDisponibles, Estado, IdCategoria } = formData;
  
      // Validación de los campos obligatorios
      const camposObligatorios = ['NombreInsumos', 'Imagen', 'Cantidad', 'UsosDisponibles', 'Estado', 'IdCategoria'];
      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del insumo.')) {
        return;
      }
  
      // Confirmación antes de agregar el insumo
      const confirmation = await window.Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres agregar este insumo?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      });
  
      if (confirmation.isConfirmed) {
        await axios.post('http://localhost:5000/api/insumos/guardarInsumo', {
          ...formData,
          // Convertir campos numéricos a números
          Cantidad: parseInt(Cantidad),
          UsosDisponibles: parseInt(UsosDisponibles),
        });
        handleCloseModalAgregar();
        fetchInsumos();
        window.Swal.fire('Insumo agregado!', '', 'success');
      }
    } catch (error) {
      console.error('Error al agregar insumo:', error);
    }
  };

  const handleEditInsumo = async (formData) => {
    try {
        const camposObligatorios = ['NombreInsumos', 'Imagen', 'Cantidad', 'UsosDisponibles', 'Estado', 'IdCategoria'];

        if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del insumo.')) {
          return;
        }

        const response = await axios.get('http://localhost:5000/api/insumos');
        const insumos = response.data;
        const insumoExistente = insumos.find(insumo => insumo.NombreInsumos === formData.NombreInsumos && insumo.IdInsumo !== formData.IdInsumo);

        if (insumoExistente) {
          window.Swal.fire({
            icon: 'warning',
            title: 'Insumo ya registrado',
            text: 'El insumo ingresado ya está registrado.',
          });
          return;
        }

        const confirmation = await window.Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres actualizar este insumo?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Cancelar'
        });

        if (confirmation.isConfirmed) {
          await axios.put(`http://localhost:5000/api/insumos/editar/${formData.IdInsumos}`, formData);
          handleCloseModalEditar();
          fetchInsumos();
          window.Swal.fire('¡Insumo actualizado!', '', 'success');
        }
    } catch (error) {
        console.error('Error al editar insumo:', error);
    }
};


  const handleChange = (name, value) => {
    setInsumoSeleccionado((prevInsumo) => ({
      ...prevInsumo,
      [name]: value,
    }));
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setInsumoSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setInsumoSeleccionado(null);
  };

  const handleEditClick = (insumo) => {
    setInsumoSeleccionado(insumo);
    setOpenModalEditar(true);
  };

  // Opciones predefinidas para el campo Estado
  const estadoOptions = [
    { value: 'Disponible', label: 'Disponible' },
    { value: 'Terminado', label: 'Terminado' },
  ];

  return (
    <div>
      <div className="container mx-auto p-4 relative">
        <center><h1 className="text-3xl font-bold mb-4">Gestion De Insumos</h1></center>
        <div className="md:flex md:justify-between md:items-center mb-4">
          <div className="relative md:w-64 md:mr-4 mb-4 md:mb-0">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Buscar usuario</label>
          </div>
        </div>
        <ModalAgregarInsumo
          open={openModalAgregar}
          handleClose={handleCloseModalAgregar}
          onSubmit={handleAddInsumo}
          title="Crear Nuevo Insumo"
          fields={[
            { name: 'NombreInsumos', label: 'Nombre insumo', type: 'text' },
            { name: 'Imagen', label: 'Imagen', type: 'text' },
            { name: 'Cantidad', label: 'Cantidad', type: 'number' },
            { name: 'UsosDisponibles', label: 'Usos Disponibles', type: 'number'  },
            { 
              name: 'Estado', 
              label: 'Estado', 
              type: 'select',
              options: estadoOptions,
              readOnly: true 
            },
            { 
              name: 'IdCategoria', 
              label: 'Categoria insumo', 
              type: 'select', 
              options: categorias.map(categoria => ({ value: categoria.IdCategoria, label: categoria.nombre_categoria })) 
            },
          ]}
          onChange={handleChange}
        />
        <ModalEditarInsumo
            open={openModalEditar}
            handleClose={handleCloseModalEditar}
            onSubmit={handleEditInsumo}
            title="Editar Insumo"
            fields={[
              { name: 'IdInsumos', label: 'Identificador', type: 'text', readOnly: true },
              { name: 'NombreInsumos', label: 'Nombre insumo', type: 'text' },
              { name: 'Imagen', label: 'Imagen', type: 'text' },
              { 
                name: 'IdCategoria', 
                label: 'Categoría insumo', 
                type: 'select', 
                options: categorias.map(categoria => ({ value: categoria.IdCategoria, label: categoria.nombre_categoria })) 
              },
            ]}
            onChange={handleChange}
            entityData={insumoSeleccionado} 
          />

        <Table
          columns={[
            { field: 'nombre_categoria', headerName: 'CATEGORIA', width: 'w-36' },
            {
              field: "ImgNombreInsumo",
              headerName: "INSUMO",
              width: "w-48",
              renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={params.row.Imagen}
                    alt="Imagen"
                    style={{ maxWidth: "100%", width: "3rem", height: "3rem", borderRadius: "50%", marginRight: "0.5rem" }}
                  />
                  <span>{params.row.NombreInsumos}</span>
                </div>
              )
            },
            { field: 'Cantidad', headerName: 'CANTIDAD', width: 'w-36' },
            { field: 'UsosDisponibles', headerName: 'USOS DISPONIBLES', width: 'w-36' },
            { field: 'Estado', headerName: 'ESTADO', width: 'w-36', readOnly: true },
            {
              field: 'Acciones',
              headerName: 'ACCIONES',
              width: 'w-48',
              renderCell: (params) => (
                <div className="flex justify-center space-x-4">
                  <button onClick={() => handleEditClick(params.row)} className="text-yellow-500">
                    <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
                  </button>
                </div>
              ),
            },
          ]}
          data={insumos} // Aquí pasamos los datos obtenidos
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
          onClick={() => setOpenModalAgregar(true)}
        >
          <i className='bx bx-plus' style={{ fontSize: '1.3rem' }}></i>
        </Fab>
      </div>
    </div>
  );
};

export default Insumos;
