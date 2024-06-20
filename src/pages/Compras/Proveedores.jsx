import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../components/consts/switch";
import ModalAgregarProveedor from "../../components/consts/modal";
import ModalEditarProveedor from "../../components/consts/modalEditar";
import Table from "../../components/consts/Tabla";
import CamposObligatorios from "../../components/consts/camposVacios";
import Fab from '@mui/material/Fab';

const Proveedores = () => {
  const [selectedRows, setSelectedRows] = useState([]);
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
      const { NIT, correo_proveedor, telefono_proveedor, direccion_proveedor, empresa_proveedor } = formData;
      const response = await axios.get('http://localhost:5000/api/proveedores');
      const proveedores = response.data;
      const proveedorExistenteNIT = proveedores.find(proveedor => proveedor.NIT === NIT);
      const proveedorExistenteCorreo = proveedores.find(proveedor => proveedor.correo_proveedor === correo_proveedor);
      const proveedorExistenteTelefono = proveedores.find(proveedor => proveedor.telefono_proveedor === telefono_proveedor);
      const proveedorExistenteDireccion = proveedores.find(proveedor => proveedor.direccion_proveedor === direccion_proveedor);
      const proveedorExistenteEmpresa = proveedores.find(proveedor => proveedor.empresa_proveedor === empresa_proveedor);
  
      const camposObligatorios = ['NIT','nombre_proveedor', 'correo_proveedor', 'telefono_proveedor', 'direccion_proveedor', 'empresa_proveedor'];

      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del proveedor.')) {
        return;
      }

      if (proveedorExistenteNIT) {
        window.Swal.fire({
          icon: 'warning',
          title: 'NIT ya registrado',
          text: 'El NIT de la empresa ingresado ya está registrado para otro proveedor.',
        });
        return;
      }
      
      const nit = formData['NIT'];
      if (!/^\d+$/.test(nit)) {
        window.Swal.fire({
          icon: 'error',
          title: 'NIT de la empresa inválido',
          text: 'Por favor, ingresa solo números en el campo del NIT de la empresa.',
        });
        return;
      }

      if (NIT.length !== 10) {
        window.Swal.fire({
          icon: 'error',
          title: 'NIT de la empresa inválido',
          text: 'Por favor, asegúrate de que el NIT de la empresa tenga 10 dígitos.',
        });
        return;
      }

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
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correoProveedor)) {
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
          await axios.put(`http://localhost:5000/api/proveedores/editar/${formData.IdProveedor}`, formData);
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
    const proveedor = proveedores.find((prov) => prov.IdProveedor === id);
    if (!proveedor) {
        console.error('Proveedor no encontrado');
        return;
    }

    const newEstado = proveedor.estado_proveedor === 1 ? 0 : 1;

    const result = await window.Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Quieres cambiar el estado del proveedor?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`http://localhost:5000/api/proveedores/editar/${id}`, { estado_proveedor: newEstado });
            await fetchProveedores(); // Actualiza la lista de proveedores después de la actualización
            window.Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: 'El estado del proveedor ha sido actualizado correctamente.',
            });
        } catch (error) {
            console.error('Error al cambiar el estado del proveedor:', error);
            window.Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cambiar el estado del proveedor. Por favor, inténtalo de nuevo más tarde.',
            });
        }
    }
};

  const handleEditClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setOpenModalEditar(true);
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setProveedorSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setProveedorSeleccionado(null);
  };

return (
<div>
<div className="container mx-auto p-4 relative">
      <center><h1 className="text-3xl font-bold mb-4">Gestion De Proveedores</h1></center>
      <div className="md:flex md:justify-between md:items-center mb-4">
        <div className="relative md:w-64 md:mr-4 mb-4 md:mb-0">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Buscar usuario</label>
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
        <div>
      </div>
    </div>
  </div>

      <ModalAgregarProveedor
          open={openModalAgregar}
          handleClose={handleCloseModalAgregar}
          onSubmit={(formData) => handleAddProveedor(formData)} 
          title="Crear Nuevo Proveedor"
          fields={[
            { name: 'NIT', label: 'NIT', type: 'number' },
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
            { name: 'NIT', label: 'NIT', type: 'number' },
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
          { field: 'NIT', headerName: 'NIT', width: 'w-36' },
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
                {params.row.estado_proveedor === 1 && (
                <button onClick={() => handleEditClick(params.row)} className="text-yellow-500">
                  <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
                </button>
              )}
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
  );
};

export default Proveedores;
