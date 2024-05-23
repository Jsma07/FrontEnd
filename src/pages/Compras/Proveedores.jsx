import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../components/consts/switch";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button as CommonButton } from '@mui/material';
import ModalAgregarProveedor from "../../components/consts/modal";
import ModalEditarProveedor from "../../components/consts/modalEditar";
import Table from "../../components/consts/Tabla";
import CamposObligatorios from "../../components/consts/camposVacios"
import SearchIcon from "@mui/icons-material/Search";

const Proveedores = () => {
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [buscar, setBuscar] = useState('')

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

  const filtrar = proveedores.filter(proveedor =>{
    const {nombre_proveedor, correo_proveedor, telefono_proveedor,direccion_proveedor, empresa_proveedor, IdProveedor} = proveedor
    const terminoABuscar = buscar.toLowerCase();
    const IdProveedorString = IdProveedor.toString(); 
    return(
      nombre_proveedor.toLowerCase().includes(terminoABuscar) ||
      correo_proveedor.toLowerCase().includes(terminoABuscar) ||
      telefono_proveedor.includes(terminoABuscar) ||
      direccion_proveedor.toLowerCase().includes(terminoABuscar)||
      empresa_proveedor.toLowerCase().includes(terminoABuscar) ||
      IdProveedorString.includes(terminoABuscar) 

    )
  })

  const handleAddProveedor = async (formData) => {
    try {
      const { correo_proveedor, telefono_proveedor, direccion_proveedor, empresa_proveedor } = formData;
      const response = await axios.get('http://localhost:5000/api/proveedores');
      const proveedores = response.data;
      const proveedorExistenteCorreo = proveedores.find(proveedor => proveedor.correo_proveedor === correo_proveedor);
      const proveedorExistenteTelefono = proveedores.find(proveedor => proveedor.telefono_proveedor === telefono_proveedor);
      const proveedorExistenteDireccion = proveedores.find(proveedor => proveedor.direccion_proveedor === direccion_proveedor);
      const proveedorExistenteEmpresa = proveedores.find(proveedor => proveedor.empresa_proveedor === empresa_proveedor);
  
      //Validacion de los campos vacios 
      const camposObligatorios = ['nombre_proveedor', 'correo_proveedor', 'telefono_proveedor', 'direccion_proveedor', 'empresa_proveedor'];

      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del proveedor.')) {
        return;
      }

       // Validación de nombre_proveedor: no debe contener números ni caracteres especiales
    const nombreProveedor = formData['nombre_proveedor'];
    if (!/^[a-zA-Z\s]+$/.test(nombreProveedor)) {
      window.Swal.fire({
        icon: 'error',
        title: 'Nombre de proveedor inválido',
        text: 'El nombre de proveedor no debe contener números ni caracteres especiales.',
      });
      return;
    }

    const correoProveedor = formData['correo_proveedor'];
    // Validación del correo electrónico: debe terminar en @gmail.com o @hotmail.com
    if (!/\b[A-Za-z0-9._%+-]+@(gmail|hotmail)\.com\b/.test(correoProveedor)) {
      window.Swal.fire({
        icon: 'error',
        title: 'Correo electrónico inválido',
        text: 'Por favor, ingresa un correo electrónico válido que termine en @gmail.com o @hotmail.com.',
      });
      return;
    }
     
      const telefono = formData['telefono_proveedor'];
      if (!/^\d+$/.test(telefono)) {
        window.Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: 'Por favor, ingresa solo números en el campo de teléfono.',
        });
        return;
      }

      // Validar longitud del número de teléfono
      if (telefono.length !== 10) {
        window.Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: 'Por favor, asegúrate de que el número de teléfono tenga 10 dígitos.',
        });
        return;
      }

      if (proveedorExistenteCorreo) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Correo ya registrado',
          text: 'El correo electrónico ingresado ya está registrado para otro proveedor.',
        });
        return;
      }
  
      if (proveedorExistenteTelefono) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Teléfono ya registrado',
          text: 'El número de teléfono ingresado ya está registrado para otro proveedor.',
        });
        return;
      }

      if (proveedorExistenteDireccion) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Direccion ya registrada',
          text: 'La direccion ingresada ya está registrado para otro proveedor.',
        });
        return;
      }

      if (proveedorExistenteEmpresa) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Empresa ya registrada',
          text: 'La empresa ingresada ya está registrado para otro proveedor.',
        });
        return;
      }

      //Confirmacion de registro
      const confirmation = await window.Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres agregar este proveedor?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmation.isConfirmed) {
        formData.estado_proveedor = 1;
        await axios.post('http://localhost:5000/api/proveedores/guardarProveedor', formData);
        handleCloseModalAgregar();
        fetchProveedores();
        window.Swal.fire('¡Proveedor agregado!', '', 'success');
      }
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }

  };

  const handleEditProveedor = async (formData) => {
    try {
        const { correo_proveedor, telefono_proveedor, direccion_proveedor, empresa_proveedor } = formData;
        const response = await axios.get('http://localhost:5000/api/proveedores');
        const proveedores = response.data;
        const proveedorExistenteCorreo = proveedores.find(proveedor => proveedor.correo_proveedor === correo_proveedor && proveedor.IdProveedor !== formData.IdProveedor);
        const proveedorExistenteTelefono = proveedores.find(proveedor => proveedor.telefono_proveedor === telefono_proveedor && proveedor.IdProveedor !== formData.IdProveedor);
        const proveedorExistenteDireccion = proveedores.find(proveedor => proveedor.direccion_proveedor === direccion_proveedor && proveedor.IdProveedor !== formData.IdProveedor);
        const proveedorExistenteEmpresa = proveedores.find(proveedor => proveedor.empresa_proveedor === empresa_proveedor && proveedor.IdProveedor !== formData.IdProveedor);
    
        //Validacion de los campos vacios 
        const camposObligatorios = ['nombre_proveedor', 'correo_proveedor', 'telefono_proveedor', 'direccion_proveedor', 'empresa_proveedor'];
  
        if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del proveedor.')) {
          return;
        }
  
        // Validación del nombre_proveedor no debe contener números ni caracteres especiales
        const nombreProveedor = formData['nombre_proveedor'];
        if (!/^[a-zA-Z\s]+$/.test(nombreProveedor)) {
          window.Swal.fire({
            icon: 'error',
            title: 'Nombre de proveedor inválido',
            text: 'El nombre de proveedor no debe contener números ni caracteres especiales.',
          });
          return;
        }
  
        const correoProveedor = formData['correo_proveedor'];
        // Validación del correo electrónico: debe terminar en @gmail.com o @hotmail.com
        if (!/\b[A-Za-z0-9._%+-]+@(gmail|hotmail)\.com\b/.test(correoProveedor)) {
          window.Swal.fire({
            icon: 'error',
            title: 'Correo electrónico inválido',
            text: 'Por favor, ingresa un correo electrónico válido que termine en @gmail.com o @hotmail.com.',
          });
          return;
        }
         
        const telefono = formData['telefono_proveedor'];
        if (!/^\d+$/.test(telefono)) {
          window.Swal.fire({
            icon: 'error',
            title: 'Teléfono inválido',
            text: 'Por favor, ingresa solo números en el campo de teléfono.',
          });
          return;
        }
  
        // Validar longitud del número de teléfono
        if (telefono.length !== 10) {
          window.Swal.fire({
            icon: 'error',
            title: 'Teléfono inválido',
            text: 'Por favor, asegúrate de que el número de teléfono tenga 10 dígitos.',
          });
          return;
        }
  
        if (proveedorExistenteCorreo) {
          window.Swal.fire({
            icon: 'warning',
            title: 'Correo ya registrado',
            text: 'El correo electrónico ingresado ya está registrado para otro proveedor.',
          });
          return;
        }
    
        if (proveedorExistenteTelefono) {
          window.Swal.fire({
            icon: 'warning',
            title: 'Teléfono ya registrado',
            text: 'El número de teléfono ingresado ya está registrado para otro proveedor.',
          });
          return;
        }
  
        if (proveedorExistenteDireccion) {
          window.Swal.fire({
            icon: 'warning',
            title: 'Dirección ya registrada',
            text: 'La dirección ingresada ya está registrada para otro proveedor.',
          });
          return;
        }
  
        if (proveedorExistenteEmpresa) {
          window.Swal.fire({
            icon: 'warning',
            title: 'Empresa ya registrada',
            text: 'La empresa ingresada ya está registrada para otro proveedor.',
          });
          return;
        }
  
        //Confirmacion de actualización
        const confirmation = await window.Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres actualizar este proveedor?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Cancelar'
        });
  
        if (confirmation.isConfirmed) {
          formData.estado_proveedor = 1;
          await axios.put('http://localhost:5000/api/proveedores/editar', formData);
          handleCloseModalEditar();
          fetchProveedores();
          window.Swal.fire('¡Proveedor actualizado!', '', 'success');
        }
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
      <center><h3 className="text-4xl mb-4" style={{ marginTop: '-20px' }}>Gestion Proveedores</h3></center>
      <div className="flex justify-between items-center">
        <div>
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
            <PersonAddIcon />
          </CommonButton>
        </div>
        <div className="mt-20 mr-10">
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
          onSubmit={handleEditProveedor}
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
          { field: 'nombre_proveedor', headerName: 'NOMBRE', width: 'w-36' },
          { field: 'correo_proveedor', headerName: 'CORREO', width: 'w-36' },
          { field: 'telefono_proveedor', headerName: 'TELEFONO', width: 'w-36' },
          { field: 'direccion_proveedor', headerName: 'DIRECCION', width: 'w-36' },
          { field: 'empresa_proveedor', headerName: 'EMPRESA', width: 'w-36' },
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
                  active={params.row.estado_proveedor === 1}
                  onToggle={() => handleToggleSwitch(params.row.IdProveedor)}
                />
              </div>
            ),
          },
        ]}
        data={filtrar}
      />
    </div>
  );
};

export default Proveedores;
