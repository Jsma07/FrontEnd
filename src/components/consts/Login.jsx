import React from 'react';

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica de inicio de sesión
    // Por ejemplo, enviar datos a un servidor
  };

  return (
    <div className="container mx-auto my-auto p-4 flex flex-col items-center justify-center">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img className="w-8 h-8 mr-2" src="Jacke.png" alt="logo" />
        Jacke Nail    
      </a>
      <div className="border border-gray-900 rounded-lg shadow-xl p-8 bg-red-100 max-w-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-8 space-y-4 md:space-y-6 sm:p-8 bg-red-100">
          <h1 className="mb-8 text-center text-lg font-semibold leading-tight text-gray-900 md:text-2xl dark:text-white">
            Iniciar sesión
          </h1>
          <form className="flex flex-col items-center space-y-6 md:space-y-8 p-1" onSubmit={handleLogin}>
            <div className="relative w-full">
              <input
                type="email"
                id="email"
                className="block w-full px-4 py-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-900 focus:outline-none focus:border-blue-600"
                placeholder="Correo electrónico"
              />
            </div>
            <div className="relative w-full">
              <input
                type="password"
                id="password"
                className="block w-full px-4 py-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-900 focus:outline-none focus:border-blue-600"
                placeholder="Contraseña"
              />
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
