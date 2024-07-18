import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/ContextoUsuario';
const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/iniciarSesion', {
        correo,
        contrasena,
      });

      const token = response.data.token;
      const userData = {
        ...response.data.user, 
        token
      };
      login(userData);

      // Configurar el token en los headers de Axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redireccionar a la página principal después del inicio de sesión
      window.location.href = '/';
    } catch (error) {
      if (error.response){
        setError(error.response.data.mensaje);
      }
      else{
      console.error('Error en el inicio de sesión:', error.response?.data?.mensaje || 'Error en el servidor');
      setError(error.response?.data?.mensaje || 'Error en el servidor');
      }
    }
  };

  return (
    <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden">
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
      <div className="absolute top-0 left-0 p-4">
          <img src="/jacke.png" alt="Logo" className="h-16 rounded-full"  />
        </div>
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            <h1 className="my-7 font-semibold text-4xl">Jake Nails</h1>
            <p className="pr-3 text-sm opacity-75">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups</p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">Iniciar sesión</h3>
            </div>
            <form onSubmit={handleLogin}>
            <div className="space-y-6">


              <input className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" 
              type="text" 
              placeholder="Correo Electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
               />
              <input className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
               type="password"
                placeholder="Contraseña" 
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}

                />
                {error && <p className="text-red-500">{error}</p>}

              <div className="flex items-center justify-between">

              </div>
              <div>
                <button type="submit" className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500">
                  Iniciar
                </button>
              </div>
              
              <p className="text-gray-400">¿No tienes una cuenta? <a href="/registrar" className="text-sm text-purple-700 hover:text-purple-700"> Registrate</a></p>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
