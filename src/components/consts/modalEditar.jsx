import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ModalEditar = ({ open, handleClose, title = '', fields, onSubmit, entityData, onChange }) => {
  const [formData, setFormData] = useState({});
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (entityData) {
      setFormData(entityData);
    }
  }, [entityData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    onChange(name, newValue);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPosition({ 
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newX = position.x + e.clientX - startPosition.x;
      const newY = position.y + e.clientY - startPosition.y;
      setPosition({ x: newX, y: newY });
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
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
            disabled={readOnly}
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
      <div 
        style={{ 
          position: 'absolute', 
          top: `${position.y}px`, 
          left: `${position.x}px`, 
          backgroundColor: 'white', 
          borderRadius: '0.375rem', 
          width: '80%', 
          maxWidth: '50rem', 
          maxHeight: '80%', 
          overflow: 'auto', 
          padding: '1.5rem', 
          cursor: dragging ? 'grabbing' : 'grab',
          zIndex: 9999
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
          <DragIndicatorIcon style={{ 
            position: 'absolute', 
            top: '-0.5rem', 
            left: '0', 
            fontSize: '2rem' 
          }} /> 
          {title}
        </Typography>
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

export default ModalEditar;
