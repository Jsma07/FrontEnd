import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, IconButton, Select, MenuItem, InputLabel } from '@mui/material'; // Asegúrate de importar Select, MenuItem e InputLabel aquí
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

const ModalEditar = ({ open, handleClose, title = '', fields, onSubmit, entityData, onChange }) => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageSize, setImageSize] = useState('');

  // useEffect para manejar ImgServicio e Imagen
  useEffect(() => {
    if (entityData) {
      setFormData(entityData);
      
      // Manejo de ImgServicio
      if (entityData.ImgServicio) {
        setImagePreview(`http://localhost:5000${entityData.ImgServicio}`);
        setImageName('Imagen existente');
        setImageSize('');
      } else if (entityData.image_preview) {
        setImagePreview(entityData.image_preview);
      } else {
        setImagePreview(null);
        setImageName('');
        setImageSize('');
      }

      // Manejo de Imagen
      if (entityData.Imagen) {
        setImagePreview(`http://localhost:5000${entityData.Imagen}`);
        setImageName('Imagen existente');
        setImageSize('');
      }
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

  const renderFields = () => {
    return fields.map((field, index) => (
      <Grid item xs={12} sm={6} key={index}>
        {renderFieldByType(field)}
      </Grid>
    ));
  };

  const renderFieldByType = (field) => {
    const { name, label, type, readOnly, options } = field;

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
        case "select":
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
                value={formData[name] || ""}
                label={label}
                style={{ marginBottom: "0.5rem", textAlign: "center" }}
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
      case 'file':
        return (
          <div className="flex flex-col items-center justify-center w-full relative">
            {imagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%',  
                    maxWidth: '500px', 
                    height: 'auto', 
                    maxHeight: '200px', // Reducir la altura máxima de la imagen
                    objectFit: 'contain', 
                    borderRadius: '8px' 
                  }} 
                />
                <IconButton
                  size="small"
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                  onClick={() => handleImageRemoval(name)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ) : (
              <label 
                htmlFor={`file-input-${name}`} 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                style={{ width: '100%', height: '150px', maxWidth: '500px', textAlign: 'center' }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Click para seleccionar una imagen
                  </Typography>
                </div>
                <input 
                  id={`file-input-${name}`} 
                  type="file" 
                  name={name}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, name)}
                />
              </label>
            )}
            {imageName && (
              <Typography variant="body2" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                Nombre de la imagen: {imageName}
              </Typography>
            )}
            {imageSize && (
              <Typography variant="body2" style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                Tamaño de la imagen: {imageSize}
              </Typography>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleImageChange = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          [name]: file,
          [`${name}_preview`]: reader.result,
        }));
        setImagePreview(reader.result);
        setImageName(file.name);
        setImageSize((file.size / 1024).toFixed(2) + ' KB');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemoval = (name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: null,
      [`${name}_preview`]: null,
    }));
    setImagePreview(null);
    setImageName('');
    setImageSize('');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          width: '80%',
          maxWidth: '50rem',
          maxHeight: '80%',
          overflow: 'auto',
          padding: '1.5rem',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{ textAlign: 'center', marginBottom: '1.5rem' }}
        >
          {title}
        </Typography>
        <Grid container spacing={2}>
          {renderFields()}
        </Grid>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1.5rem',
          }}
        >
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

export default ModalEditar;
