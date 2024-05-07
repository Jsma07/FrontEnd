import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../components/consts/switch";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { Button as CommonButton } from '@mui/material';
import ModalAgregarProveedor from "../../components/consts/Modal";
import ModalEditarProveedor from "../../components/consts/modalEditar";
import Table from "../../components/consts/Tabla";

const Proveedores = () => {
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error fetching Proveedores:', error);
    }
  };

  const handleAddProveedor = async (formData) => {
    try {
      formData.estado_proveedor = 1;
      await axios.post('http://localhost:5000/api/proveedores/guardarProveedor', formData);
      handleCloseModalAgregar();
      fetchProveedores();
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }
  };

  const handleEditProveedor = async (formData) => {
    try {
      formData.estado_proveedor = 1;
      await axios.put('http://localhost:5000/api/proveedores/editar', formData);
      handleCloseModalEditar();
      fetchProveedores();
    } catch (error) {
      console.error('Error al editar proveedor:', error);
    }
  };

  const handleChange = (name, value) => {
    setProveedorSeleccionado((prevProveedor) => ({
      ...prevProveedor,
      [name]: value,
    }));
  };

  const handleToggleSwitch = async (id) => {
    try {
      const proveedor = proveedores.find((prov) => prov.IdProveedor === id);
      const updatedProveedor = { ...proveedor, estado_proveedor: proveedor.estado_proveedor === 1 ? 0 : 1 };
      await axios.put(`http://localhost:5000/api/proveedores/editar`, updatedProveedor);
      fetchProveedores(); 
    } catch (error) {
      console.error('Error al cambiar estado del proveedor:', error);
    }
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setProveedorSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setProveedorSeleccionado(null);
  };

  const handleEditClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setOpenModalEditar(true);
  };

  return (
    <div>
      <center><h1 style={{ marginTop: '-30px' }}>Gestion De Proveedores</h1></center>
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
      <ModalAgregarProveedor
          open={openModalAgregar}
          handleClose={handleCloseModalAgregar}
          onSubmit={(formData) => handleAddProveedor(formData)} 
          title="Crear Nuevo Proveedor"
          fields={[
            { name: 'nombre_proveedor', label: 'Nombre', type: 'text' },
            { name: 'correo_proveedor', label: 'Correo', type: 'text' },
            { name: 'telefono_proveedor', label: 'Teléfono', type: 'text' },
            { name: 'direccion_proveedor', label: 'Direccion', type: 'text' },
            { name: 'empresa_proveedor', label: 'Empresa', type: 'text' },
          ]}
          onChange={handleChange}
        />

      <ModalEditarProveedor
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        handleEditProveedor={handleEditProveedor}
        title="Editar Proveedor"
        fields={[
          { name: 'IdProveedor', label: 'Identificador', type: 'text', readOnly: true }, 
          { name: 'nombre_proveedor', label: 'Nombre', type: 'text' },
          { name: 'correo_proveedor', label: 'Correo', type: 'text' },
          { name: 'telefono_proveedor', label: 'Teléfono', type: 'text' },
          { name: 'direccion_proveedor', label: 'Direccion', type: 'text' },
          { name: 'empresa_proveedor', label: 'Empresa', type: 'text' },
        ]}
        onChange={handleChange}
        entityData={proveedorSeleccionado} 
      />

      <Table
        columns={[
          { field: 'IdProveedor', headerName: 'ID', width: 'w-16' },
          { field: 'nombre_proveedor', headerName: 'Nombre', width: 'w-36' },
          { field: 'correo_proveedor', headerName: 'Correo', width: 'w-36' },
          { field: 'telefono_proveedor', headerName: 'Telefono', width: 'w-36' },
          { field: 'direccion_proveedor', headerName: 'Direccion', width: 'w-36' },
          { field: 'empresa_proveedor', headerName: 'Empresa', width: 'w-36' },
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
                  active={params.row.estado_proveedor === 1}
                  onToggle={() => handleToggleSwitch(params.row.IdProveedor)}
                />
              </div>
            ),
          },
        ]}
        data={proveedores}
      />
    </div>
  );
};

export default Proveedores;
