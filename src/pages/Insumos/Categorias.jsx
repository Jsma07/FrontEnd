import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../components/consts/switch";
import Table from "../../components/consts/Tabla";
import { Grid, Button as CommonButton } from '@mui/material';
import ModalAgregarCategoria from "../../components/consts/Modal";
import ModalEditarCategoria from "../../components/consts/modalEditar";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

const Categorias = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionado, setCategoriaSeleccionado] = useState(null);

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

  const handleAddCategoria = async (formData) => {
    try {
      formData.estado_categoria = 1;
      await axios.post('http://localhost:5000/api/categorias/guardarCategoria', formData);
      handleCloseModalAgregar();
      fetchCategorias();
    } catch (error) {
      console.error('Error al agregar categoria:', error);
    }
  };

  const handleEditCategoria = async (formData) => {
    try {
      await axios.put('http://localhost:5000/api/categorias/editar', formData);
      handleCloseModalEditar();
      fetchCategorias();
    } catch (error) {
      console.error('Error al editar categoria:', error);
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
      const updatedCategoria = { ...categoria, estado_categoria: categoria.estado_categoria === 1 ? 0 : 1 };
      await axios.put(`http://localhost:5000/api/categorias/editar`, updatedCategoria);
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
      <center><h1 style={{ marginTop: '-30px' }}>Gestion De Categorias De Insumos</h1></center>
      <CommonButton
        color="primary"
        variant="contained"
        onClick={() => setOpenModalAgregar(true)}
        sx={{
          color: 'black',
          minHeight: 40,
          px: 2.5,
          borderRadius: '10px',
          backgroundColor: '#EFD4F5',
          marginTop: '5px',
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
      <ModalAgregarCategoria
        open={openModalAgregar}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleAddCategoria}
        title="Crear Nueva Categoria De Insumos"
        fields={[
          { name: 'imagen_categoria', label: 'Imagen categoria', type: 'text' },
          { name: 'nombre_categoria', label: 'Nombre', type: 'text' },
        ]}
        onChange={handleChange}
      />

      <ModalEditarCategoria
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        handleEditCategoria={handleEditCategoria}
        title="Editar Categoria De Insumos"
        fields={[
          { name: 'IdCategoria', label: 'Identificador', type: 'text', readOnly: true }, 
          { name: 'imagen_categoria', label: 'Imagen categoria', type: 'text' },
          { name: 'nombre_categoria', label: 'Nombre', type: 'text' },
          { name: 'estado_categoria', label: 'Estado', type: 'number' },
        ]}
        onChange={handleChange}
        entityData={categoriaSeleccionado} 
      />

      <Table
        columns={[
          { field: 'IdCategoria', headerName: 'ID', width: 'w-16' },
          {
            field: "imagen_categoria",
            headerName: "Imagen",
            width: "w-32",
            renderCell: (params) => (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <img
                  src={params.row.imagen_categoria}
                  alt="Imagen"
                  style={{ maxWidth: "100%", height: "auto", width: "3rem", height: "3rem", borderRadius: "50%", objectFit: "cover" }}
                />
              </div>
            )
          },
          { field: 'nombre_categoria', headerName: 'Nombre', width: 'w-36' },
          {
            field: 'Acciones',
            headerName: 'Acciones',
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
        data={categorias}
      />
    </div>
  );
};

export default Categorias;
