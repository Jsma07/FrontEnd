import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, IconButton, Select, MenuItem, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2'; // Asegúrate de importar SweetAlert2

const ModalEditar = ({ open, handleClose, title = '', fields, onSubmit, entityData, onChange }) => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageSize, setImageSize] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entityData) {
      setFormData(entityData);

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

      if (entityData.Imagen) {
        setImagePreview(`http://localhost:5000${entityData.Imagen}`);
        setImageName('Imagen existente en la base de datos');
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

    if (onChange) {
      onChange(name, newValue);
    }

    const error = validateField(name, newValue, type);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;
    const error = validateField(name, value, type);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = () => {
    let hasErrors = false;
    const newErrors = {};
    fields.forEach((field) => {
      const error = validateField(field.name, formData[field.name], field.type);
      if (error) {
        hasErrors = true;
        newErrors[field.name] = error;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  const validateField = (name, value, type) => {
    let error = '';

    if (name === 'correo_proveedor') {
      if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
        error = 'El correo electrónico no es válido.';
      }
    } else if (name === 'telefono_proveedor') {
      if (!/^[0-9+\s]*$/.test(value)) {
        error = 'El número de teléfono solo puede contener números y el signo +.';
      }
    } else if (name === 'direccion_proveedor') {
      if (!/^[a-zA-ZñÑ0-9\s#-]*$/.test(value)) {
        error = 'La dirección solo puede contener letras, números, espacios, # y -.';
      }
    } else if (name === 'NIT') {
        if (!/^[a-zA-ZñÑ0-9\s#-]*$/.test(value)) {
          error = 'El NIT de la empresa solo puede contener números.';
      }
    } else if (name === 'Precio_Servicio') {
          if (value <= 20000) {
            error = 'El precio debe ser minimo de $20.000.';
          }
      }else {
      switch (type) {
        case 'text':
          if (!/^[a-zA-ZñÑ\s]*$/.test(value)) {
            error = 'El campo solo puede contener letras y espacios.';
          }
          break;
        case 'number':
          if (isNaN(value) || Number(value) <= 0) {
            error = 'El campo debe ser un número positivo.';
          }
          break;
        default:
          break;
      }
    }
    return error;
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
            onBlur={handleBlur}
            fullWidth
            size="medium"
            type={type}
            style={{ marginBottom: '0.5rem', textAlign: 'center' }}
            value={formData[name] || ''}
            error={!!errors[name]}
            helperText={errors[name]}
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
              value={formData[name] || ""}
              label={label}
              style={{ marginBottom: "0.5rem", textAlign: "center" }}
              error={!!errors[name]}
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
          <div className="flex flex-col items-center justify-center w-full">
            {imagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%',  
                    maxWidth: '500px', 
                    height: 'auto', 
                    maxHeight: '200px', 
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
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={imageName}
                  disabled
                  style={{ marginTop: '0.5rem' }}
                  InputProps={{
                    style: { textAlign: 'center' },
                  }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={imageSize}
                  disabled
                  style={{ marginTop: '0.5rem' }}
                  InputProps={{
                    style: { textAlign: 'center' },
                  }}
                />
              </div>
            ) : (
              <label 
                htmlFor={`file-input-${name}`} 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                style={{ width: '100%', height: '150px', maxWidth: '500px', textAlign: 'center', marginBottom: '0.5rem' }}
              >
                <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Click para seleccionar una imagen
                </Typography>
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
            justifyContent: 'flex-end',
            marginTop: '1.5rem',
          }}
        >
         <Button
            onClick={handleCancel}
            color="secondary"
            variant="contained"
            style={{ marginRight: '1rem' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            endIcon={<SendIcon />}
          >
            Enviar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditar;
