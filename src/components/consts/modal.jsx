import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Typography, Grid, TextField, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const ModalDinamico = ({ open, handleClose, title = '', fields, onSubmit, onChange, entityData }) => {
  const [formValues, setFormValues] = useState({});
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 350, y: 150 });
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });
  const [extraFields, setExtraFields] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [progressVisible, setProgressVisible] = useState(false); // Nuevo estado para la barra de progreso
  const [errors, setErrors] = useState({});
  const modalContainerRef = useRef(null);
  const startPositionRef = useRef({ x: 0, y: 0 });

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

    if (open && modalContainerRef.current) {
      setModalSize({
        width: modalContainerRef.current.offsetWidth,
        height: modalContainerRef.current.offsetHeight
      });
    }
  }, [fields, open]);

  useEffect(() => {
    if (entityData) {
      setFormValues(entityData);
    }
  }, [entityData]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('modal-header')) {
      setDragging(true);
      startPositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      requestAnimationFrame(() => {
        const maxX = window.innerWidth - modalSize.width;
        const maxY = window.innerHeight - modalSize.height;
        const newX = Math.max(0, Math.min(position.x + e.clientX - startPositionRef.current.x, maxX));
        const newY = Math.max(0, Math.min(position.y + e.clientY - startPositionRef.current.y, maxY));
        setPosition({ x: newX, y: newY });
        startPositionRef.current = {
          x: e.clientX,
          y: e.clientY
        };
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleChange = (e) => {
    const { name, files, value, type } = e.target;
    
    if (type === 'text' && value.includes('  ')) {
      const trimmedValue = value.replace(/ {2,}/g, ' ');
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: trimmedValue,
      }));
      return; // Salir de la función después de corregir el valor
    }

    if (type === 'file' && e.target.accept.includes('image/*')) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const maxSizeBytes = 1 * 1024 * 1024; // 1 MB
        if (file.size > maxSizeBytes) {
          setAlertOpen(true);
          setAlertMessage("El tamaño del archivo excede el límite permitido (1 MB).");
          setTimeout(() => {
            setAlertOpen(false);
            setAlertMessage('');
          }, 3000);
          return;
        }
        if (type === 'text' && value.includes('  ')) {
    const trimmedValue = value.replace(/ {2,}/g, ' ');
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: trimmedValue,
    }));
    return; // Salir de la función después de corregir el valor
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
        [name]: type === 'file' ? files[0] : value,
      }));
    }

    if (onChange) {
      onChange(name, type === 'file' ? files[0] : value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
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
      setProgressVisible(true); // Mostrar la barra de progreso al enviar el formulario
      if (typeof onSubmit === 'function') {
        let hasErrors = false;

        const newErrors = {};
        fields.forEach((field) => {
          const error = validateField(field.name, formValues[field.name], field.type);
          if (error) {
            hasErrors = true;
            newErrors[field.name] = error;
          }
        });

        if (hasErrors) {
          setErrors(newErrors);
          setProgressVisible(false);
          return;
        }

        await onSubmit(formValues);
      } else {
        console.error("onSubmit is not a function");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setAlertOpen(true);
      setAlertMessage("Error al enviar el formulario. Por favor, inténtelo de nuevo.");
      setTimeout(() => {
        setAlertOpen(false);
        setAlertMessage('');
      }, 3000);
    } finally {
      setProgressVisible(false); // Ocultar la barra de progreso al finalizar
    }
  };

  const handleCancel = () => {
    // Limpiar formValues
    const clearedFormValues = {};
    Object.keys(formValues).forEach(key => {
      clearedFormValues[key] = '';
    });
    setFormValues(clearedFormValues);

    setExtraFields([]);

    handleClose();
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
            onBlur={handleBlur}
            fullWidth
            size="medium"
            type={type}
            style={{ marginBottom: '0.5rem', textAlign: 'center' }}
            value={formValues[name] || ''}
            error={!!errors[name]}
            helperText={errors[name]}
            disabled={disabled}
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
                  onClick={() => handleRemoveImage(name)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ) : (
              <label
                htmlFor={`dropzone-file-${name}`}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
                style={{ width: '100%', height: '150px' }}
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
                    <span className="font-semibold">Click para elegir imagen</span>
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
    <Modal open={open} onClose={handleClose}>
      <div
        ref={modalContainerRef}
        className="modal-container"
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
          zIndex: 9999,
          boxShadow: dragging ? '0 8px 16px rgba(0,0,0,0.5)' : 'none', 
          transition: 'box-shadow 0.3s'
        }}
      >
        <Stack
          sx={{
            position: 'fixed',
            top: '1rem',
            width: '100%',
            display: alertOpen ? 'flex' : 'none',
            justifyContent: 'center',
            zIndex: 10000
          }}
          spacing={2}
        >
          <Alert severity="warning">{alertMessage}</Alert>
        </Stack>

        {progressVisible && (
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '2px',
              backgroundColor: '#29D',
              zIndex: '99999'
            }}
          />
        )}

        <div
          className="modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: dragging ? 'grabbing' : 'grab',  // Cambio de cursor aquí
            padding: '1rem',
            backgroundColor: dragging ? '#f0f0f0' : 'transparent',  // Cambio de color de fondo cuando se arrastra
            boxShadow: dragging ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',  // Sombra cuando se arrastra
            transition: 'background-color 0.3s, box-shadow 0.3s, cursor 0.3s' // Transiciones ajustadas
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
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
  );
};

export default ModalDinamico;
