import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/ContextoUsuario';
const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  const { login } = useContext(UserContext);

const validacionContrasena = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validacionContrasena.test(contrasena)) {
      setError('La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.');
      return;
    }


    try {
      const response = await axios.post('http://localhost:5000/api/iniciarSesion', {
        correo,
        contrasena,
      });
      console.log('Respuesta del login:', response.data);


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
  const validatePassword = (password) => {
    const conditions = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
    };

    return conditions;
  };

  const handleCorreoChange = (e) => {
    const correo = e.target.value.toLowerCase().trim(); // Convertir a minúsculas y eliminar espacios
    setCorreo(correo);
  };
  
  const handleContrasenaChange = (e) => {
    const contrasena = e.target.value.trim(); // Eliminar espacios
    setContrasena(contrasena);
  };
  const condicionesContrasena = validatePassword(contrasena);
  const todasCondicionesCumplidas = Object.values(condicionesContrasena).every(Boolean);


  return (
    <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden">
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
      <div className="absolute top-0 left-0 p-4">
          <img src="/jacke.png" alt="Logo" className="h-16 rounded-full"  />
        </div>
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            {/* Burbuja 1 */}
           <img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-20 animate-bounce"
  style={{
    position: 'absolute',
    top: '10%',
    left: '10%',
    animationDelay: '0.5s' // comienza a animarse después de 0.5 segundos
  }}
/>
{/* Burbuja 2 */}
<img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-16 animate-bounce"
  style={{
    position: 'absolute',
    top: '50%',
    left: '5%',
    animationDelay: '1s' // comienza a animarse después de 1 segundo
  }}
/>

<img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-20 animate-bounce"
  style={{
    position: 'absolute',
    top: '80%',
    left: '20%',
    animationDelay: '1s' // comienza a animarse después de 1 segundo
  }}
/>
{/* Burbuja 3 */}
<img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-12 animate-bounce"
  style={{
    position: 'absolute',
    top: '30%',
    left: '30%',
    animationDelay: '1.5s' // comienza a animarse después de 1.5 segundos
  }}
/>
{/* Burbuja 4 */}
<img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-24 animate-bounce"
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    animationDelay: '2s' // comienza a animarse después de 2 segundos
  }}
/>
{/* Burbuja 5 */}
<img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-12 animate-bounce"
  style={{
    position: 'absolute',
    top: '70%',
    left: '70%',
    animationDelay: '2.5s' // comienza a animarse después de 2.5 segundos
  }}
/>
{/* Burbuja 6 */}
<img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-20 animate-bounce"
  style={{
    position: 'absolute',
    top: '20%',
    left: '80%',
    animationDelay: '3s' // comienza a animarse después de 3 segundos
  }}
/>
<img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-20 animate-bounce"
  style={{
    position: 'absolute',
    top: '90%',
    left: '50%',
    animationDelay: '3.5s' // comienza a animarse después de 3.5 segundos
  }}
/>
<img
  src="/burbuja.png"
  alt="Burbuja"
  className="h-16 animate-bounce"
  style={{
    position: 'absolute',
    top: '90%',
    left: '90%',
    
    animationDelay: '4s' // comienza a animarse después de 4 segundos
  }}
/>

          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
          <div className="mb-7 text-center">
  <h3 className="font-semibold text-2xl text-gray-800">Iniciar sesión</h3>
</div>
            <form onSubmit={handleLogin}>
            <div className="space-y-6">


              <input className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" 
              type="text" 
              placeholder="Correo Electrónico"
              value={correo}
              onChange={handleCorreoChange}
              required
               />
              <input className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
               type="password"
                placeholder="Contraseña" 
                value={contrasena}
                onChange={handleContrasenaChange}
                onFocus={() => setPasswordTouched(true)}
                required

                />
                 {passwordTouched && !todasCondicionesCumplidas && (
            <div>
              <p style={{ color: condicionesContrasena.length ? 'green' : 'red' }}>
                Mínimo 8 caracteres
              </p>
              <p style={{ color: condicionesContrasena.uppercase ? 'green' : 'red' }}>
                Al menos una mayúscula
              </p>
              <p style={{ color: condicionesContrasena.number ? 'green' : 'red' }}>
                Al menos un número
              </p>
            </div>
          )}
                          <div className="mb-7 text-center">
                          {error && <p className="text-red-500">{error}</p>}

</div>

              <div className="flex items-center justify-between">

              </div>
              <div>
                <button type="submit" className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500">
                  Iniciar
                </button>
              </div>
              
              <p className="text-gray-400 text-center">¿No tienes una cuenta? <a href="/registrar" className="text-sm text-purple-700 hover:text-purple-700"> Registrate</a></p>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
