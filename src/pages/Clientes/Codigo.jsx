// src/pages/VerificarCodigo.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const NUMBER_OF_BOXES = 6;

const VerificarCodigo = () => {
  const [code, setCode] = useState(Array(NUMBER_OF_BOXES).fill(''));
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae el correo de los parámetros de la URL
  const query = new URLSearchParams(location.search);
  const correo = query.get('correo');

  const handleChange = (index, event) => {
    const value = event.target.value;
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Solo toma un carácter

    setCode(newCode);

    // Mueve el foco al siguiente campo si se ingresa un valor
    if (value && index < NUMBER_OF_BOXES - 1) {
      inputsRef.current[index + 1].focus();
    }

    // Mueve el foco al campo anterior si se borra el valor
    if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeString = code.join('');
  
    // Validar longitud del código antes de enviar
    if (codeString.length !== NUMBER_OF_BOXES) {
      setError('Por favor, ingrese un código de verificación válido.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/verificar-codigo', {
        correo,
        codigo: codeString
      });
  
      if (response.data.mensaje === 'Código verificado correctamente') {
        navigate('/nuevaContrasena', { state: { correo } });
      } else {
        setError('Código incorrecto. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setError('Error al verificar el código. Por favor, inténtalo de nuevo.');
    }
  };
  

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Verificar Código</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2 mb-4">
          {Array(NUMBER_OF_BOXES).fill('').map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={code[index]}
              onChange={(e) => handleChange(index, e)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md shadow-sm"
            />
          ))}
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md py-2 px-4"
        >
          Verificar Código
        </button>
      </form>
    </div>
  );
};

export default VerificarCodigo;
