import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

const ModalDinamico = ({ open, handleClose, title = '', fields, onSubmit, onChange }) => {
  const [formValues, setFormValues] = useState({});
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });
  const [extraFields, setExtraFields] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (fields && fields.length > 0) {
      const initialFormData = {};
      fields.forEach((field) => {
        if (!formValues[field.name]) {
          initialFormData[field.name] = field.value || '';
        }
      });
      setFormValues(prevFormValues => ({ ...prevFormValues, ...initialFormData }));
    }

    if (open) {
      const modalContainer = document.getElementById('modal-container');
      if (modalContainer) {
        setModalSize({
          width: modalContainer.offsetWidth,
          height: modalContainer.offsetHeight
        });
      }
    }
  }, [fields, open]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPosition({ 
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const maxX = window.innerWidth - modalSize.width;
      const maxY = window.innerHeight - modalSize.height;
      const newX = Math.max(0, Math.min(position.x + e.clientX - startPosition.x, maxX));
      const newY = Math.max(0, Math.min(position.y + e.clientY - startPosition.y, maxY));
      setPosition({ x: newX, y: newY });
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
  
    if (e.target.type === 'file' && e.target.accept.includes('image/*')) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        // Verificar el tamaño del archivo antes de enviarlo
        const maxSizeBytes = 1 * 20000 * 20000; // 1 MB en bytes
        if (file.size > maxSizeBytes) {
          setAlert(
            <Alert severity="warning" onClose={() => setAlert(null)}>
              El tamaño del archivo de imagen excede el límite permitido (1 MB).
            </Alert>
          );
          return;
        }
  
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          [name]: file,
          [`${name}_preview`]: reader.result,
          [`${name}_name`]: file.name,
          [`${name}_size`]: (file.size / 1024).toFixed(2) + ' KB'
        }));
  
        const extraFieldsData = [
          {
            name: `${name}_name`,
            label: "Nombre de la imagen",
            value: file.name,
            type: "text",
            disabled: true
          },
          {
            name: `${name}_size`,
            label: "Peso de la imagen",
            value: (file.size / 1024).toFixed(2) + ' KB',
            type: "text",
            disabled: true
          }
        ];
  
        setExtraFields((prevExtraFields) => [
          ...prevExtraFields,
          ...extraFieldsData
        ]);
      };
      reader.readAsDataURL(file);
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: e.target.type === 'file' ? files[0] : e.target.value,
      }));
    }
  
    if (onChange) {
      onChange(name, e.target.type === 'file' ? files[0] : e.target.value);
    }
  };

  const handleRemoveImage = (name) => {
    setFormValues((prevFormValues) => {
      const newFormValues = { ...prevFormValues };
      delete newFormValues[name];
      delete newFormValues[`${name}_preview`];
      delete newFormValues[`${name}_name`];
      delete newFormValues[`${name}_size`];
      return newFormValues;
    });

    setExtraFields((prevExtraFields) =>
      prevExtraFields.filter(
        (field) => field.name !== `${name}_name` && field.name !== `${name}_size`
      )
    );
  };

  const handleSubmit = async () => {
    try {
      if (typeof onSubmit === 'function') {
        await onSubmit(formValues);
        handleClose();
        setFormValues({});
        setExtraFields([]);
      } else {
        console.error("onSubmit is not a function");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const handleCancel = () => {
    handleClose();
    setFormValues({});
    setExtraFields([]);
  };

  const renderFields = () => {
    return fields.concat(extraFields).map((field, index) => (
      <Grid item xs={12} sm={field.type === 'file' ? 12 : 6} key={index}>
        {renderFieldByType(field)}
      </Grid>
    ));
  };

  const renderFieldByType = (field) => {
    const { name, label, type, options, disabled } = field;

    switch (type) {
      case "text":
      case "password":
      case "number":
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
            value={formValues[name] || ''}
            disabled={disabled}
          />
        );
      case "select":
        return (
          <div>
            <InputLabel id={`${name}-label`}>{label
            }</InputLabel>
            <Select
              labelId={`${name}-label`}
              id={name}
              name={name}
              variant="outlined"
              onChange={handleChange}
              fullWidth
              size="medium"
              value={formValues[name] || ''}
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
      case "file":
        return (
          <div className="flex items-center justify-center w-full relative">
            {formValues[`${name}_preview`] ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                  src={formValues[`${name}_preview`]} 
                  alt="Preview" 
                  style={{ 
                    width: '100%',  
                    maxWidth: '10000px', 
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
                  onClick={() => handleRemoveImage(name)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ) : (
              <label 
                htmlFor={`dropzone-file-${name}`} 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" 
                style={{ width: '500px', height: '150px' }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg 
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 20 16"
                  >
                    <path 
                      stroke="currentColor" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click Imagen</span> 
                  </p>
                </div>
                <input 
                  id={`dropzone-file-${name}`} 
                  type="file" 
                  name={name}
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {alert && (
        <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          {alert}
        </div>
      )}
      <Modal open={open} onClose={handleClose}>
        <div 
          id="modal-container"
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
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'grab' 
            }}
          >
            <Typography variant="h6">{title}</Typography>
            <DragIndicatorIcon />
          </div>
          <Grid container spacing={2} style={{ marginTop: '1rem' }}>
            {renderFields()}
          </Grid>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '1rem' 
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
    </>
  );
};

export default ModalDinamico;
