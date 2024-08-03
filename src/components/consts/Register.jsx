import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Correo: '',
    Telefono: '',
    Documento: '',
    tipoDocumento: '',
    Contrasena: '',
    IdRol: 4,
    Estado: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { Nombre, Apellido, Correo, Telefono, Documento, tipoDocumento, Contrasena } = formData;
      if (!Nombre || !Apellido || !Correo || !Telefono || !Documento || !tipoDocumento || !Contrasena) {
        toast.error("Todos los campos son obligatorios.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return ;
      }
      const nameRegex = /^[a-zA-Z\s]+$/;
      const numeroRegex = /^[0-9]+$/;
      if (!nameRegex.test(Nombre)) {
        toast.error("El nombre solo puede contener letras y espacios.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return ;
      }
      if (!nameRegex.test(Apellido)) {
        toast.error("El Apellido solo puede contener letras y espacios.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return ;
      }
      if (!numeroRegex.test(Documento)) {
        toast.error("El Documento solo puede contener números.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return ;
      }
      if (!numeroRegex.test(Telefono)) {
        toast.error("El Teléfono solo puede contener números.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return ;
      }
      const validacionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!validacionCorreo.test(Correo)) {
        toast.error("El Correo no tiene un formato válido.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return
      }
      const validacionContrasena = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!validacionContrasena.test(Contrasena)) {
        toast.error("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número..", {
          position: "bottom-right",
          autoClose: 3000,
        });
      return
      }
      // Confirmación antes de registrar
      const CorreoResponse = await axios.get(
        `http://localhost:5000/api/verificarCorreo/${formData.Correo}`
        
      );
      const DocumentoResponse = await axios.get(
        `http://localhost:5000/api/verificarDocumento/${formData.Documento}`
        
      );

      if(CorreoResponse.status === 200 && DocumentoResponse === 200){
        const formDataNumerico = {
          Nombre: formData.Nombre,
          Apellido: formData.Apellido,
          Correo: formData.Correo,
          Telefono: formData.Telefono,
          Estado: 1,
          IdRol: 4,
          Documento: formData.Documento,
          tipoDocumento: formData.tipoDocumento,
          Contrasena: formData.Contrasena,
        };

        // console.log("Datos del formulario:", formDataNumerico);

        // Enviar datos al backend
        const response = await axios.post(
          "http://localhost:5000/Jackenail/RegistrarClientes",
          formDataNumerico
        );

        // Mostrar alerta de éxito
        toast.success("El cliente se ha registrado correctamente.", {
          position: "bottom-right",
          autoClose: 3000, // Cierra automáticamente después de 3 segundos
        });

        // Limpiar el formulario
        setFormData({
          Nombre: '',
          Apellido: '',
          Correo: '',
          Telefono: '',
          Documento: '',
          tipoDocumento: '',
          Contrasena: ''
        });
      }
    }
    catch (error) {
      if (error.response && error.response.status === 400) {
        // Mostrar alerta de error si el servidor responde con un error 400
        toast.error(`${error.response.data.mensaje}`, {
          position: "bottom-right",
          autoClose: 3000, // Cierra automáticamente después de 3 segundos
        });
      } else {
        console.error("Error al registrar el cliente:", error);
        // Mostrar alerta de error en caso de error interno
        toast.error("Ocurrió un error al registrar el cliente.", {
          position: "bottom-right",
          autoClose: 3000, // Cierra automáticamente después de 3 segundos
        });
      }
    }
  };

  return (
   
    <div className="bg-pink-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden">
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="absolute top-0 left-0 p-4">
          <img src="/jacke.png" alt="Logo" className="h-16 rounded-full" />
        </div>
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            <h1 className="my-7 font-semibold text-4xl">Jake Nails</h1>
            <p className="pr-3 text-sm opacity-75">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups</p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
            <div className="mb-7 text-center">
              <h3 className="font-semibold text-2xl text-gray-800">Regístrate</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              >
                <option value="" disabled>Tipo de documento</option>
                <option value="C.C">Cédula de ciudadania</option>
                <option value="C.E">Cédula de extranjeria</option>
                {/* Añade más opciones según tus necesidades */}
              </select>
              <input
                name="Documento"
                value={formData.Documento}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="text"
                placeholder="Número de documento: "
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleChange}
                  className="text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="text"
                  placeholder="Nombre:"
                />
                <input
                  name="Apellido"
                  value={formData.Apellido}
                  onChange={handleChange}
                  className="text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="text"
                  placeholder="Apellido:"
                />
              </div>
              <input
                name="Telefono"
                value={formData.Telefono}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="text"
                placeholder="Telefono: "
              />
              <input
                name="Correo"
                value={formData.Correo}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="email"
                placeholder="Correo Electrónico: "
              />
              <input
                name="Contrasena"
                value={formData.Contrasena}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="password"
                placeholder="Contraseña:"
              />
              <button
                type="submit"
                className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
              >
                Registrarse
              </button>
              <p className="text-gray-400 text-center">¿Ya tienes una cuenta? <a href="/iniciarSesion" className="text-sm text-purple-700 hover:text-purple-700">Inicia sesión</a></p>
            </form>
            <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Register;
