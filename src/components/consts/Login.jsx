import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/iniciarSesion', {
        correo,
        contrasena,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      // Configurar el token en los headers de Axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redireccionar a la página principal después del inicio de sesión
      window.location.href = '/';
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response?.data?.mensaje || 'Error en el servidor');
      setError(error.response?.data?.mensaje || 'Error en el servidor');
    }
  };
  return (
    <div className="container mx-auto my-auto p-4 flex flex-col items-center justify-center">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img className="w-20 h-20 mr-2" src="Jacke.png" alt="logo" />
        Jake Nails
      </a>
      <div className="border border-gray-900 rounded-lg shadow-xl p-8 bg-red-100 max-w-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-8 space-y-4 md:space-y-6 sm:p-8 bg-red-100">
          <h1 style={{
            fontSize: '30px'
          }}
          className="mb-8 text-center text-lg font-semibold leading-tight text-gray-900 md:text-2xl dark:text-white">
            Iniciar sesión
          </h1>
          <form className="flex flex-col items-center space-y-6 md:space-y-8 p-1" onSubmit={handleLogin}>
          <div className="relative w-full">
                <input type="email" id="small_outlined" className="block px-4 py-2 w-full text-sm text-grwhite rounded-lg border border-gray-700 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                />
                <label for="small_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                   Correo: </label>
            </div>
            <div className="relative w-full">
                <input
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                 type="password" id="small_outlined" className="block px-4 py-2 w-full text-sm text-grwhite rounded-lg border border-gray-700 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                <label for="small_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                   Contraseña: </label>
            </div>
            <div className="w-full flex justify-between">
              <a href="#" className="text-sm font-medium text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Iniciar sesión
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-3 text-sm">
              ¿No tienes una cuenta? <a href="/Registrar" className="font-medium text-blue-600 hover:underline">¡Regístrate!</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
