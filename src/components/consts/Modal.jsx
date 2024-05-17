import React, { useState } from 'react';
import { Button, TextField, Grid, Modal, Typography, Select, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { blue, red } from '@mui/material/colors';

const CustomModal = ({ open, handleClose, title, fields, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '0.375rem', width: '80%', maxWidth: '50rem', maxHeight: '80%', overflow: 'auto', padding: '1.5rem' }}>
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{title}</Typography>
        <Grid container spacing={2}>
          {fields && fields.length > 0 && fields.map((field, index) => (
            <Grid item xs={6} key={index}>
              {field.type === 'select' ? (
                <Select
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  variant="outlined"
                  onChange={handleChange}
                  fullWidth
                  style={{ marginBottom: '1rem' }}
                  value={formData[field.name] || ''}
                >
                  {field.options.map((option, index) => (
                    <MenuItem key={index} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              ) : (
                <TextField
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  variant="outlined"
                  onChange={handleChange}
                  fullWidth
                  style={{ marginBottom: '1rem' }}
                  value={formData[field.name] || ''}
                />
              )}
            </Grid>
          ))}
        </Grid>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ backgroundColor: blue[300], width: '25%', marginRight: '0.5rem', fontSize: '0.8rem' }}
          >
            <span style={{marginRight: '0.5rem' }}>Enviar</span>
            <SendIcon />
          </Button>
          <Button
            variant="contained"
            onClick={handleCancel}
            style={{ backgroundColor: red[300], color: 'white', width: '25%', fontSize: '0.8rem' }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
