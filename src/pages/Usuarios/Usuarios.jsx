import React, { useEffect, useState } from "react";
import CustomSwitch from "../../components/consts/switch";
import ModalDinamico from "../../components/consts/modal";
import Table from "../../components/consts/Tabla";
import axios from 'axios';
import LoadingScreen from "../../components/consts/pantallaCarga"; 

const Usuarios = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [seleccionado , setSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga de la página

  useEffect(() => {
    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/roles'); 
            setRoles(response.data.roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/users');
        setUsers(respuesta.data.usuarios);
        setIsLoading(false); // Una vez que se cargan los usuarios, cambia isLoading a false
      } catch(error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleSwitch = async (id) => {
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        const newEstado = user.estado === 1 ? 0 : 1; // Cambia el estado
        return { ...user, estado: newEstado };
      }
      return user;
    });
    
    try {
      const updatedUser = updatedUsers.find(user => user.id === id);
      if (!updatedUser) {
        console.error('No se encontró el usuario actualizado');
        return;
      }
      
      await axios.put(`http://localhost:5000/api/editarUsuario/${id}`, { estado: updatedUser.estado });
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
    }
  };
  

  const handleEditClick = (id) => {
    if (users.length === 0) {
      // Aún no se han cargado los usuarios, manejar esto según tu caso
      return;
    }
  
    const usuarioEditar = users.find(user => user.id === id);
    if (!usuarioEditar) {
      console.log("no encontrado")
      return;
    }
  
    setOpenModal(true);
    setSeleccionado(usuarioEditar);
  };
  

  const handleViewDetailsClick = (id) => {
    console.log(`Viendo detalles del usuario con ID: ${id}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSeleccionado(null)
  };

  const handleCrearUsuarioClick = () => {
    handleOpenModal();
  };

  const handleSubmit = async(formData) => {
    try {
        let response;
        if(seleccionado){
          response = await axios.put(
            `http://localhost:5000/api/editarUsuario/${seleccionado.id}`, formData,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
        }else{
          response = await axios.post(
            'http://localhost:5000/api/crearUsuario',
            formData,
            {
                headers: {
                    'Content-Type': 'application/json' // Configura el tipo de contenido como JSON
                }
            }
        );
        
        }
        console.log('Respuesta del servidor:', response.data);
        handleCloseModal();
        // setIsLoading(true); 
        setTimeout(() => {
          window.location.reload(); // Recargar la página para mostrar el nuevo usuario
        }, 100);
        
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 'w-16' },
    { field: 'nombre', headerName: 'Nombre', width: 'w-36' },
    { field: 'apellido', headerName: 'Apellido', width: 'w-36' },
    { field: 'correo', headerName: 'Correo', width: 'w-36' },
    { field: 'telefono', headerName: 'Teléfono', width: 'w-36' },
    { 
      field: 'rolId', 
      headerName: 'Rol', 
      width: 'w-36',
      renderCell: (params) => {
        const rol = roles.find(role => role.id === params.value);
        return rol ? rol.nombre : 'Desconocido';
      }
    },
    
    {
      field: 'Acciones',
      headerName: 'Acciones',
      width: 'w-48',
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          <button onClick={() => handleEditClick(params.row.id)} className="text-yellow-500">
            <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
          </button>
          
          {/* CustomSwitch que cambia su estado cuando se hace clic */}
          <CustomSwitch
  active={params.row.estado === 1} // Usar el estado del usuario para determinar si el switch está activo
  onToggle={() => handleToggleSwitch(params.row.id)}
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingScreen />; // Muestra la pantalla de carga mientras isLoading es verdadero
  }

  return (
    <div>
      <h1>Usuarios</h1>
      
      <button onClick={handleCrearUsuarioClick} className="text-blue-500"><i class='bx bx-user-plus'></i></button>
      <ModalDinamico
      seleccionado={seleccionado}
  open={openModal}
  handleClose={handleCloseModal}
  onSubmit={handleSubmit}
  title={seleccionado ? "Editar Usuario" : "Crear nuevo usuario"}
  fields={[
    { name: 'nombre', label: 'Nombre', type: 'text', value: seleccionado ? seleccionado.nombre : '' },
    { name: 'apellido', label: 'Apellido', type: 'text', value: seleccionado ? seleccionado.apellido : '' },
    { name: 'correo', label: 'Correo', type: 'text', value: seleccionado ? seleccionado.correo : '' },
    { name: 'telefono', label: 'Teléfono', type: 'text', value: seleccionado ? seleccionado.telefono : '' },
    { 
      name: 'rolId', 
      label: 'Rol', 
      type: 'select',
      options: roles.map(role => ({ value: role.id, label: role.nombre })),
      value: seleccionado ? seleccionado.rolId : '' // Preselecciona el rol del usuario si existe
    },
    { name: 'contrasena', label: 'Contraseña', type: 'password', value: seleccionado ? seleccionado.contrasena : '' }
  ]}
/>

      <Table columns={columns} data={users} roles={roles} />
    </div>
  );
};

export default Usuarios;
