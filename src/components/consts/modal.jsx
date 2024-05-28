import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ModalDinamico = ({ open, handleClose, title = '', fields, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (fields && fields.length > 0) {
      const initialFormData = {};
      fields.forEach((field) => {
        initialFormData[field.name] = field.value || '';
      });
      setFormData(initialFormData);
    }
  }, [fields]);

  useEffect(() => {
    if (!open) {
      setFormData({});
      setErrors({});
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    let errorMessage = '';
  
    if (name === 'nombre' || name === 'apellido') {
      if (!/^[a-zA-Z\s]*$/.test(newValue)) {
        errorMessage = `El campo ${name.charAt(0).toUpperCase() + name.slice(1)} no puede contener caracteres especiales ni números.`;
      }
    } else if (name === 'telefono') {
      if (!/^[0-9]+$/.test(newValue)) {
        errorMessage = `El campo ${name.charAt(0).toUpperCase() + name.slice(1)} no puede contener letras ni caracteres especiales.`;
      } else if (newValue.length > 15) {
        errorMessage = `El campo ${name.charAt(0).toUpperCase() + name.slice(1)} no puede exceder 15 caracteres.`;
      }
    } else if (type === 'number') {
      if (/^-?\d*$/.test(newValue)) { 
        newValue = Math.abs(newValue); 
      } else {
        errorMessage = 'Ingrese un número entero positivo válido.';
        newValue = ''; 
      }
    }
  
    if (errorMessage) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  
    if (name === 'Cantidad' && type === 'number') {
      const cantidad = parseInt(newValue, 10);
      const estadoPorDefecto = cantidad > 0 ? 'Disponible' : 'Terminado';
      setFormData((prevData) => ({
        ...prevData,
        Estado: estadoPorDefecto,
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    fields.forEach((field) => {
      if (!formData[field.name] && field.required) {
        newErrors[field.name] = 'Este campo es obligatorio';
      }
    });

    if (typeof onSubmit === 'function') {
      onSubmit(formData);
      handleClose();
    } else {
      console.error('onSubmit is not a function');
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  const renderFields = () => {
    return fields.map((field, index) => (
      <Grid item xs={12} sm={6} key={index}>
        {renderFieldByType(field)}
      </Grid>
    ));
  };

  const renderFieldByType = (field) => {
    const { name, label, type, options, readOnly } = field;

    switch (type) {
      case 'text':
      case 'password':
      case 'number':
        return (
          <TextField
            id={name}
            name={name}
            label={label}
            variant="outlined"
            onChange={handleChange}
            fullWidth
            size="medium"
            type={type}
            style={{ marginBottom: '0.5rem', textAlign: 'center' }}
            value={formData[name] || ''}
            error={!!errors[name]}
            helperText={errors[name]}
          />
        );
      case 'select':
        return (
          <div>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              labelId={`${name}-label`}
              id={name}
              name={name}
              variant="outlined"
              onChange={handleChange}
              fullWidth
              size="medium"
              value={formData[name] || ''}
              label={label}
              style={{ marginBottom: '0.5rem', textAlign: 'center' }}
              disabled={readOnly}
              error={!!errors[name]}
            >
              {options &&
                options.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
            {!!errors[name] && (
              <Typography variant="caption" color="error" display="block" style={{ textAlign: 'center' }}>
                {errors[name]}
              </Typography>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '0.375rem', width: '80%', maxWidth: '50rem', maxHeight: '80%', overflow: 'auto', padding: '1.5rem' }}>
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{title}</Typography>
        <Grid container spacing={2}>
          {renderFields()}
        </Grid>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ width: '25%', marginRight: '0.5rem', fontSize: '0.8rem' }}>
            <span style={{ marginRight: '0.5rem' }}>Enviar</span>
            <SendIcon />
          </Button>
          <Button variant="contained" onClick={handleCancel} style={{ width: '25%', fontSize: '0.8rem' }}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDinamico;
