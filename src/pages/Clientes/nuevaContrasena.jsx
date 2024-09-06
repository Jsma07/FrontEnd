import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const correo = location.state?.correo;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/actualizarContrasena', {
        correo,
        nuevaContrasena: newPassword
      });

      if (response.data.mensaje === 'Contraseña actualizada correctamente') {
        navigate('/iniciarSesion'); // Redirigir al inicio de sesión después de cambiar la contraseña
      } else {
        setError(response.data.mensaje || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setError('Error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="new-password-container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Actualizar Contraseña</button>
      </form>
    </div>
  );
};

export default NewPassword;
