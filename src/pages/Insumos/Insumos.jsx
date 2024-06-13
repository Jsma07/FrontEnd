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
  const [categorias, setCategorias] = useState([]); 
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

  useEffect(() => {
    fetchInsumos();
    fetchCategorias();
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
      const newErrors = {};
  
      camposObligatorios.forEach((campo) => {
        if (!formData[campo]) {
          newErrors[campo] = 'Este campo es obligatorio';
        }
      });
  
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
        await axios.post('http://localhost:5000/api/insumos/guardarInsumo', formData, {
          headers:{
            'Content-Type': 'multipart/form-data'
          },
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
      const camposObligatorios = ['NombreInsumos', 'Imagen', 'PrecioUnitario', 'Estado', 'IdCategoria'];
  
      // Validar campos obligatorios excluyendo IdCategoria
      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del insumo.')) {
        return;
      }
  
      // Validar si el nombre del insumo ya existe
      const response = await axios.get('http://localhost:5000/api/insumos');
      const insumos = response.data;
      const insumoExistente = insumos.find(insumo => insumo.NombreInsumos === formData.NombreInsumos && insumo.IdInsumos !== formData.IdInsumos);
  
      if (insumoExistente) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Insumo ya registrado',
          text: 'El insumo ingresado ya está registrado.',
        });
        return;
      }
  
      // Confirmación antes de actualizar el insumo
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
        // Convertir campos numéricos a números si es necesario
        const formDataWithNumbers = {
          ...formData,
          Cantidad: parseInt(formData.Cantidad),
          UsosDisponibles: parseInt(formData.UsosDisponibles),
        };
  
        // Realizar la solicitud PUT para actualizar el insumo
        const response = await axios.put(`http://localhost:5000/api/insumos/editar/${formData.IdInsumos}`, formDataWithNumbers, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        // Cerrar el modal y actualizar la lista de insumos
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
            { name: 'Cantidad', label: 'Cantidad', type: 'number' },
            { name: 'PrecioUnitario', label: 'Precio Unitario', type: 'number' },
            { name: 'usos_unitarios', label: 'Usos Unitarios', type: 'number'},
            { name: 'UsosDisponibles', label: 'Usos Disponibles', type: 'number'},
            { 
              name: 'IdCategoria', 
              label: 'Categoria insumo', 
              type: 'select', 
              options: categorias.filter(categoria => categoria.estado_categoria === 1).map(categoria => ({ value: categoria.IdCategoria, label: categoria.nombre_categoria })) 
            },
            { name: 'Imagen', label: 'Imagen', type: 'file' },
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
              { 
                name: 'IdCategoria', 
                label: 'Categoria insumo', 
                type: 'select', 
                options: categorias.filter(categoria => categoria.estado_categoria === 1).map(categoria => ({ value: categoria.IdCategoria, label: categoria.nombre_categoria })) 
              },
              { name: 'PrecioUnitario', label: 'Precio Unitario', type: 'number' },
              { name: 'Imagen', label: 'Imagen', type: 'file' },
            ]}
            onChange={handleChange}
            entityData={insumoSeleccionado} 
          />

        <Table
          columns={[
            { field: 'nombre_categoria', headerName: 'CATEGORIA', width: 'w-36' },
            {
              field: "Imagen",
              headerName: "IMAGEN",
              width: "w-32",
              renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <img
                    src={`http://localhost:5000${params.row.Imagen}`} // Asegúrate de usar la URL completa
                    alt="Imagen"
                    style={{ maxWidth: "100%", height: "auto", width: "3rem", height: "3rem", borderRadius: "50%" }}
                  />
                </div>
              )
            },
            { field: 'NombreInsumos', headerName: 'NOMBRE', width: 'w-36' },
            { field: 'Cantidad', headerName: 'CANTIDAD', width: 'w-36' },
            { field: 'usos_unitarios', headerName: 'USOS UNITARIOS', width: 'w-36' },
            { field: 'UsosDisponibles', headerName: 'USOS DISPONIBLES', width: 'w-36' },
            { field: 'PrecioUnitario', headerName: 'PRECIO UNITARIO', width: 'w-36' },
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
          data={insumos} 
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