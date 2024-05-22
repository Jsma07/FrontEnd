import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../components/consts/switch";
import Table from "../../components/consts/Tabla";
import { Grid, Button as CommonButton } from '@mui/material';
import ModalAgregarCategoria from "../../components/consts/modal";
import ModalEditarCategoria from "../../components/consts/modalEditar";
import CamposObligatorios from "../../components/consts/camposVacios";
import SearchIcon from "@mui/icons-material/Search";
import Fab from '@mui/material/Fab';

const Categorias = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionado, setCategoriaSeleccionado] = useState(null);
  const [buscar, setBuscar] = useState('')

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const filtrar = categorias.filter(categoria =>{
    const {nombre_categoria, IdCategoria} = categoria
    const terminoABuscar = buscar.toLowerCase();
    const IdCategoriaString = IdCategoria.toString(); 
    return(
      nombre_categoria.toLowerCase().includes(terminoABuscar) ||
      IdCategoriaString.includes(terminoABuscar) 
    )
  })


  const handleAddCategoria = async (formData) => {
    try {
      const { nombre_categoria } = formData;
      const response = await axios.get('http://localhost:5000/api/categorias');
      const categorias = response.data;
      const categoriaExistente = categorias.find(categoria => categoria.nombre_categoria === nombre_categoria && categoria.IdCategoria !== formData.IdCategoria);

  
      // Validación de los campos obligatorios
      const camposObligatorios = ['nombre_categoria'];
      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos de la categoría.')) {
        return;
      }
  
      // Validación del nombre de la categoría: no debe contener números ni caracteres especiales
      const nombreCategoria = formData['nombre_categoria'];
      if (!/^[a-zA-Z\s]+$/.test(nombreCategoria)) {
        window.Swal.fire({
          icon: 'error',
          title: 'Nombre de categoría inválido',
          text: 'El nombre de la categoría no debe contener números ni caracteres especiales.',
        });
        return;
      }
  
      // Verificar si la categoría ya está registrada
      if (categoriaExistente) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Categoría ya registrada',
          text: 'La categoría ingresada ya está registrada.',
        });
        return;
      }
  
      // Confirmación antes de agregar la categoría
      const confirmation = await window.Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres agregar esta categoría?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      });
  
      if (confirmation.isConfirmed) {
        formData.estado_categoria = 1;
        await axios.post('http://localhost:5000/api/categorias/guardarCategoria', formData);
        handleCloseModalAgregar();
        fetchCategorias();
        window.Swal.fire('¡Categoría agregada!', '', 'success');
      }
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };
  
  
  const handleEditCategoria = async (formData) => {
    try {
        const camposObligatorios = ['nombre_categoria'];
  
        if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos de la categoría.')) {
          return;
        }
  
        const response = await axios.get('http://localhost:5000/api/categorias');
        const categorias = response.data;
        const categoriaExistente = categorias.find(categoria => categoria.nombre_categoria === formData.nombre_categoria && categoria.IdCategoria !== formData.IdCategoria);
  
        if (categoriaExistente) {
          window.Swal.fire({
            icon: 'warning',
            title: 'Categoría ya registrada',
            text: 'La categoría ingresada ya está registrada.',
          });
          return;
        }

        const confirmation = await window.Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres actualizar esta categoría?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Cancelar'
        });

        if (confirmation.isConfirmed) {
          await axios.put(`http://localhost:5000/api/categorias/editar/${formData.IdCategoria}`, formData);
          handleCloseModalEditar();
          fetchCategorias();
          window.Swal.fire('¡Categoría actualizada!', '', 'success');
        }
    } catch (error) {
        console.error('Error al editar categoría:', error);
    }
};

  const handleChange = (name, value) => {
    setCategoriaSeleccionado((prevCategoria) => ({
      ...prevCategoria,
      [name]: value,
    }));
  };

  const handleToggleSwitch = async (id) => {
    try {
      const categoria = categorias.find((prov) => prov.IdCategoria === id);
      const updateCategoria = { ...categoria, estado_categoria: categoria.estado_categoria === 1 ? 0 : 1 };
      await axios.put(`http://localhost:5000/api/categorias/editar/${id}`, updateCategoria);
      fetchCategorias(); // Actualiza la lista de proveedores después de la actualización
    } catch (error) {
      console.error('Error al cambiar estado de la categoria:', error);
    }
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setCategoriaSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setCategoriaSeleccionado(null);
  };

  const handleEditClick = (categoria) => {
    setCategoriaSeleccionado(categoria);
    setOpenModalEditar(true);
  };

return (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-4xl" style={{ marginTop: '-20px' }}>Gestion De Categorias</h3>
      <div className="mt-4">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <input
              type="search"
              id="search"
              className="block w-full p-2 pl-10 pr-10 text-sm border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              required
            />
            <span
              className="absolute inset-y-0 right-0 flex items-center px-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-r text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              style={{ cursor: 'default', height: '100%' }}
            >
              <SearchIcon className="text-base mr-3" />
            </span>
          </div>
        </form>
      </div>
    </div>

      <ModalAgregarCategoria
        open={openModalAgregar}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleAddCategoria}
        title="Crear Nueva Categoria De Insumos"
        fields={[
          { name: 'nombre_categoria', label: 'Nombre', type: 'text' },
        ]}
        onChange={handleChange}
      />

      <ModalEditarCategoria
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        onSubmit={handleEditCategoria}
        title="Editar Categoria De Insumos"
        fields={[
          { name: 'IdCategoria', label: 'Identificador', type: 'text', readOnly: true }, 
          { name: 'nombre_categoria', label: 'Nombre', type: 'text' },
          { name: 'estado_categoria', label: 'Estado', type: 'number' },
        ]}
        onChange={handleChange}
        entityData={categoriaSeleccionado} 
      />

      <Table
        columns={[
          { field: 'IdCategoria', headerName: 'ID', width: 'w-16' },
          { field: 'nombre_categoria', headerName: 'NOMBRE CATEGORIA', width: 'w-36' },
          {
            field: 'Acciones',
            headerName: 'ACCIONES',
            width: 'w-48',
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                <button onClick={() => handleEditClick(params.row)} className="text-yellow-500">
                  <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
                </button>
                <CustomSwitch
                  active={params.row.estado_categoria === 1}
                  onToggle={() => handleToggleSwitch(params.row.IdCategoria)}
                />
              </div>
            ),
          },
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
          zIndex: 1000, // Asegura que el botón flotante esté por encima de otros elementos
        }}
        onClick={() => setOpenModalAgregar(true)}
      >
        <i className='bx bx-plus' style={{ fontSize: '1.3rem' }}></i>
     </Fab>
    </div>
  );
};

export default Categorias;
