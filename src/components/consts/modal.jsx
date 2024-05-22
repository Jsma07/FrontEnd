import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ModalDinamico = ({ open, handleClose, title = '', fields, onSubmit, seleccionado }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (seleccionado) {
      setFormData(seleccionado);
    } else {
      // Limpiar el formulario cuando no hay un usuario seleccionado
      setFormData({});
    }
  }, [seleccionado]);

  const handleEmailValidation = (e) => {
    const { name, value } = e.target;
    const validacionCorreo = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail)\.(com|net|org)$/i;

    if (name === 'correo' && !validacionCorreo.test(value)) {
      window.Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: `El campo ${name.charAt(0).toUpperCase() + name.slice(1)} tiene un formato inválido.`,
      });
    }
  };
  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === 'checkbox' ? checked : value;
    const maxNumeros = 15;
    const CaracteresEspeciales = /^[a-zA-Z\s]*$/;

    if (name === 'nombre' || name === 'apellido') {
      if (!CaracteresEspeciales.test(newValue)) {
        window.Swal.fire({
          icon: 'error',
          title: `${name.charAt(0).toUpperCase() + name.slice(1)} inválido`,
          text:`El campo ${name.charAt(0).toUpperCase() + name.slice(1)} no puede contener caracteres especiales ni números.`,
        });
        return; // No actualizar el estado si el valor no es válido
      }
    }
    if(name == 'telefono'){
      const validacionNumeros= /^[0-9]+$/;
      if(!validacionNumeros.test(newValue)){
        return;
      }
      if(newValue.length > maxNumeros){
        window.Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: `El campo ${name.charAt(0).toUpperCase() + name.slice(1)} no puede exceder ${maxNumeros} caracteres.`,
        });
        return;
      }
     
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };
  
  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };
  
  // Función para cancelar y cerrar el modal
  const handleCancel = () => {
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '0.375rem', width: '80%', maxWidth: '50rem', maxHeight: '80%', overflow: 'auto', padding: '1.5rem' }}>
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{title}</Typography>
        <Grid container spacing={2}>
          {/* Renderizar los campos */}
          {fields && fields.length > 0 && fields.map((field, index) => (
            <Grid item xs={12} key={index}>
              {/* Manejar los diferentes tipos de campos */}
              {field.type === 'text' && (
                <TextField
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleEmailValidation}
                  fullWidth
                  size="small"
                  type="text"
                  style={{
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    maxWidth: '300px',
                  }}
                  value={formData[field.name] || ''}
                />
              )}
              {field.type === 'password' && (
                <TextField
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  variant="outlined"
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type="password"
                  style={{
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    maxWidth: '300px',
                  }}
                  value={formData[field.name] || ''} 
                />
              )}
              {field.type === 'select' && (
                <div>
                  <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                  <Select
                    labelId={`${field.name}-label`}
                    id={field.name}
                    name={field.name}
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    value={formData[field.name] || ''}
                    label={field.label}
                    style={{
                      marginBottom: '0.5rem',
                      textAlign: 'center',
                      maxWidth: '300px',
                    }}
                  >
                    {field.options.map((option, index) => (
                      <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </div>
              )}
            </Grid>
          ))}
        </Grid>
        {/* Botones de enviar y cancelar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ width: '25%', marginRight: '0.5rem', fontSize: '0.8rem' }}
          >
            <span style={{ marginRight: '0.5rem' }}>Enviar</span>
            <SendIcon />
          </Button>
          <Button
            variant="contained"
            onClick={handleCancel}
            style={{ width: '25%', fontSize: '0.8rem' }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDinamico;