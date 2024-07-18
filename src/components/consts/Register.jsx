import React from 'react';

function Register() {
  return (
    <div className="bg-pink-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden">
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
              <h3 className="font-semibold text-2xl text-gray-800">Regístrate</h3>
            </div>
            
            <div className="space-y-6">
            <select className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400">
                <option value="" disabled selected>Tipo de documento</option>
                <option value="C.C">Cédula de ciudadania</option>
                <option value="C.E">Cédula de extranjeria</option>
                {/* Añade más opciones según tus necesidades */}
              </select>
              <input className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" type="text" placeholder="Número de documento" />

              <div className="grid grid-cols-2 gap-4">
                <input className="text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" type="text" placeholder="Nombre" />
                <input className="text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" type="text" placeholder="Apellido" />
              </div>
              <input className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" type="text" placeholder="Correo Electrónico" />
              <input className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" type="password" placeholder="Contraseña" />
            
              <div className="flex items-center justify-between">

              </div>
              <div>
                <button type="submit" className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500">
                  Registrarse
                </button>
              </div>
              <p className="text-gray-400">¿Ya tienes una cuenta? <a href="/iniciarSesion" className="text-sm text-purple-700 hover:text-purple-700">Inicia sesión</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
