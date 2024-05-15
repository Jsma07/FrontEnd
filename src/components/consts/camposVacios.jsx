// CamposObligatorios.js
import React from 'react';

const CamposObligatorios = (formData, campos, mensaje) => {
  const emptyFields = campos.filter(field => {
    const value = formData[field];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (emptyFields.length > 0) {
    window.Swal.fire({
      icon: 'error',
      title: 'Campos obligatorios vacíos',
      text: mensaje || 'Por favor, completa todos los campos obligatorios antes de continuar.',
    });
    return false;
  }
  return true;
};

export default CamposObligatorios;
