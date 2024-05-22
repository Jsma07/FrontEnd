import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../../components/consts/switch";
import Table from "../../../components/consts/Tabla";
import ModalAgregarServicio from "../../../components/consts/modal";
import ModalEditarServicio from "../../../components/consts/modalEditar";
import CamposObligatorios from "../../../components/consts/camposVacios";
import SearchIcon from "@mui/icons-material/Search";
import Fab from '@mui/material/Fab';

const Servicios = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [buscar, setBuscar] = useState('')

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error fetching servicios:', error);
    }
  };

  const filtrar = servicios.filter(servicio =>{
    const {Nombre_Servicio, IdServicio} = servicio
    const terminoABuscar = buscar.toLowerCase();
    const IdServicioString = IdServicio.toString(); 
     return(
      Nombre_Servicio.toLowerCase().includes(terminoABuscar) ||
      IdServicioString.includes(terminoABuscar) 
     )
  })

  const handleAddServicio = async (formData) => {
    try {
      const { Nombre_Servicio } = formData;
      const response = await axios.get('http://localhost:5000/api/servicios');
      const servicios = response.data;
      const servicioExistente = servicios.find(servicio => servicio.Nombre_Servicio === Nombre_Servicio && servicio.IdServicio !== formData.IdServicio);
  
      // Validación de los campos obligatorios
      const camposObligatorios = ['ImgServicio','Nombre_Servicio','Tiempo_Servicio','Precio_Servicio'];
      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del servicio.')) {
        return;
      }
  
      const precio = formData['Precio_Servicio'];
      if (!/^\d+$/.test(precio)) {
        window.Swal.fire({
          icon: 'error',
          title: 'Precio inválido',
          text: 'Por favor, ingresa solo números en el campo del precio.',
        });
        return;
      }

      // Verificar si el servicio ya está registrada
      if (servicioExistente) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Servicio ya registrada',
          text: 'El servicio ingresada ya está registrada.',
        });
        return;
      }
  
      // Confirmación antes de agregar el servicio
      const confirmation = await window.Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres agregar este servicio?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      });
  
      if (confirmation.isConfirmed) {
        formData.EstadoServicio = 1;
        await axios.post('http://localhost:5000/api/servicios/guardarServicio', formData);
        handleCloseModalAgregar();
        fetchServicios();
        window.Swal.fire('¡Servicio agregado!', '', 'success');
      }
    } catch (error) {
      console.error('Error al agregar el servicio:', error);
    }
};
  
  
const handleEditServicio = async (formData) => {
  try {
    const { Nombre_Servicio, IdServicio } = formData;
    // Validación de los campos obligatorios
    const camposObligatorios = ['ImgServicio','Nombre_Servicio','Tiempo_Servicio','Precio_Servicio'];
    if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del servicio.')) {
      return;
    }
    
    const response = await axios.get('http://localhost:5000/api/servicios');
    const servicios = response.data;
    const servicioExistente = servicios.find(servicio => servicio.Nombre_Servicio === Nombre_Servicio && servicio.IdServicio !== formData.IdServicio);

    
    if (servicioExistente) {
      window.Swal.fire({
        icon: 'warning',
        title: 'Servicio ya registrada',
        text: 'El servicio ingresada ya está registrada.',
      });
      return;
    }

    const precio = formData['Precio_Servicio'];
      if (!/^\d+$/.test(precio)) {
        window.Swal.fire({
        icon: 'error',
        title: 'Precio inválido',
        text: 'Por favor, ingresa solo números en el campo del precio.',
      });
      return;
    }    

    const confirmation = await window.Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres actualizar esta servicio?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmation.isConfirmed) {
      await axios.put(`http://localhost:5000/api/servicios/editar/${formData.IdServicio}`, formData);
      handleCloseModalEditar();
      fetchServicios();
      window.Swal.fire('¡Servicios actualizada!', '', 'success');
    }
  } catch (error) {
    console.error('Error al editar el servicio:', error);
  }
};

  const handleChange = (name, value) => {
    setServicioSeleccionado((prevServicio) => ({
     ...prevServicio,
       [name]: value,
     }));
  };

  const handleToggleSwitch = async (id) => {
    try {
      const servicio = servicios.find((prov) => prov.IdServicio === id);
      const updateServicio = { ...servicio, EstadoServicio: servicio.EstadoServicio === 1 ? 0 : 1 };
      await axios.put(`http://localhost:5000/api/servicios/editar/${id}`, updateServicio);
      fetchServicios(); // Actualiza la lista de proveedores después de la actualización
    } catch (error) {
      console.error('Error al cambiar estado de los servicios:', error);
    }
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setServicioSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setServicioSeleccionado(null);
  };

  const handleEditClick = (servicio) => {
    setServicioSeleccionado(servicio);
    setOpenModalEditar(true);
  };

return (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-4xl" style={{ marginTop: '-20px' }}>Gestion De Servicios</h3>
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

      <ModalAgregarServicio
        open={openModalAgregar}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleAddServicio}
        title="Crear Nuevo Servicio"
        fields={[
          { name: 'ImgServicio', label: 'Imagen', type: 'text' },
          { name: 'Nombre_Servicio', label: 'Nombre', type: 'text' },
          { name: 'Tiempo_Servicio', label: 'Tiempo', type: 'text' },
          { name: 'Precio_Servicio', label: 'Precio', type: 'number' },
        ]}
        onChange={handleChange}
      />

      <ModalEditarServicio
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        onSubmit={handleEditServicio}
        title="Editar Servicio"
        fields={[
          { name: 'IdServicio', label: 'Identificador', type: 'text', readOnly: true }, 
          { name: 'ImgServicio', label: 'Imagen', type: 'text' },
          { name: 'Nombre_Servicio', label: 'Nombre', type: 'text' },
          { name: 'Tiempo_Servicio', label: 'Tiempo', type: 'text' },
          { name: 'Precio_Servicio', label: 'Precio', type: 'number' },
        ]}
        onChange={handleChange}
        entityData={servicioSeleccionado} 
      />  

      <Table
        columns={[
          { field: 'IdServicio', headerName: 'ID', width: 'w-16' },
          {
            field: "ImgServicio",
            headerName: "IMAGEN",
            width: "w-32",
            renderCell: (params) => (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img
                  src={params.row.ImgServicio}
                  alt="ImgServicio"
                  style={{ maxWidth: "100%", height: "auto", width: "3rem", height: "3rem", borderRadius: "50%" }}
                />
              </div>
            )
          },
          { field: 'Nombre_Servicio', headerName: 'NOMBRE', width: 'w-36' },
          { field: 'Tiempo_Servicio', headerName: 'TIEMPO', width: 'w-36' },
          { field: 'Precio_Servicio', headerName: 'PRECIO', width: 'w-36' },

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
                  active={params.row.EstadoServicio === 1}
                  onToggle={() => handleToggleSwitch(params.row.IdServicio)}
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

export default Servicios;
