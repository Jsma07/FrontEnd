import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ModalDinamico = ({ open, handleClose, title = '', fields, onSubmit, seleccionado }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
   
    if (fields && fields.length > 0) {
      const initialFormData = {};
      fields.forEach((field) => {
        initialFormData[field.name] = field.value || '';
      });
      setFormData(initialFormData); 
    }
  }, [fields]);
  

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
        window.Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: `El campo ${name.charAt(0).toUpperCase() + name.slice(1)} no puede contener letras ni caracteres especiales.`,
        });
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
  
  const handleSubmit = () => {
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
    const { name, label, type, options } = field;

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
            >
              {options &&
                options.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
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
