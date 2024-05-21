import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { TimePicker } from '@mui/lab';

const ModalDinamico = ({ open, handleClose, title = '', fields, onSubmit }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (fields && fields.length > 0) {
      const initialFormData = {};
      fields.forEach((field) => {
        initialFormData[field.name] = field.defaultValue || '';
      });
      setFormData(initialFormData);
    }
  }, [fields]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === 'checkbox' ? checked : value;
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
      case 'date':
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
            InputLabelProps={{ shrink: true }}
          />
        );
      case 'time': // Nuevo caso para campos de tipo hora
        return (
          <TimePicker
            id={name}
            name={name}
            label={label}
            variant="outlined"
            onChange={(newValue) => handleChange({ target: { name, value: newValue } })}
            fullWidth
            size="medium"
            value={formData[name] || null}
            style={{ marginBottom: '0.5rem', textAlign: 'center' }}
            renderInput={(params) => <TextField {...params} />}
          />
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
