import React, { useState } from 'react';
import { Button, Modal, Typography, TextField } from '@mui/material';
import CustomSwitch from './switch'; // Asegúrate de importar CustomSwitch si lo has definido en otro archivo
import SendIcon from '@mui/icons-material/Send';

const ModalDinamico = ({ open, handleClose, handleSubmit, title, fields }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFormSubmit = () => {
    handleSubmit(formData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: 20, borderRadius: 8 }}>
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: 25 }}>{title}</Typography>
        {fields.map((field) => (
          <div key={field.name} style={{ marginBottom: 10 }}>
            <Typography variant="subtitle1">{field.label}</Typography>
            {field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 4 }}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <>
                {field.type === 'switch' ? (
                  <CustomSwitch
                    active={formData[field.name] || false}
                    onToggle={(value) => handleChange(field.name, value)}
                  />
                ) : (
                  <TextField
                    id={field.name}
                    label={field.label}
                    variant="standard"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    style={{ width: '100%', marginBottom: 10 }}
                  />
                )}
              </>
            )}
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={handleFormSubmit}
          style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto', display: 'block', justifyContent: 'space-between' }}
        >
          <span style={{ marginRight: '8px' }}>Enviar</span>
          {/* Asegúrate de importar correctamente SendIcon si lo estás utilizando */}
          <SendIcon />
        </Button>
      </div>
    </Modal>
  );
};

export default ModalDinamico;
