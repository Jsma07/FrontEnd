import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"; // Importa el ícono de arrastre

const Modal = ({
  open,
  handleClose,
  title = "",
  fields,
  onSubmit,
  onChange,
}) => {
  const [formValues, setFormValues] = useState({});
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (fields && fields.length > 0) {
      const initialFormData = {};
      fields.forEach((field) => {
        if (!formValues[field.name]) {
          initialFormData[field.name] = field.value || "";
        }
      });
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        ...initialFormData,
      }));
    }
    // Set the size of the modal when it opens
    if (open) {
      const modalContainer = document.getElementById("modal-container");
      if (modalContainer) {
        setModalSize({
          width: modalContainer.offsetWidth,
          height: modalContainer.offsetHeight,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, open]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const maxX = window.innerWidth - modalSize.width;
      const maxY = window.innerHeight - modalSize.height;
      const newX = Math.max(
        0,
        Math.min(position.x + e.clientX - startPosition.x, maxX)
      );
      const newY = Math.max(
        0,
        Math.min(position.y + e.clientY - startPosition.y, maxY)
      );
      setPosition({ x: newX, y: newY });
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === "checkbox" ? checked : value;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: newValue,
    }));
    onChange && onChange(name, newValue);
  };

  const handleSubmit = () => {
    if (typeof onSubmit === "function") {
      onSubmit(formValues);
      handleClose();
    } else {
      console.error("onSubmit is not a function");
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
            style={{ marginBottom: "0.5rem", textAlign: "center" }}
            value={formValues[name] || ""}
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
              value={formValues[name] || ""}
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
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        id="modal-container"
        style={{
          position: "absolute",
          top: `${position.y}px`,
          left: `${position.x}px`,
          backgroundColor: "white",
          borderRadius: "0.375rem",
          width: "80%",
          maxWidth: "50rem",
          maxHeight: "80%",
          overflow: "auto",
          padding: "1.5rem",
          cursor: dragging ? "grabbing" : "grab",
          zIndex: 9999,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            position: "relative",
          }}
        >
          <DragIndicatorIcon
            style={{
              position: "absolute",
              top: "-0.5rem",
              left: "0",
              fontSize: "2rem", // Ajusta el tamaño del ícono aquí
            }}
          />
          {title}
        </Typography>
        <Grid container spacing={2}>
          {renderFields()}
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ width: "25%", marginRight: "0.5rem", fontSize: "0.8rem" }}
          >
            <span style={{ marginRight: "0.5rem" }}>Enviar</span>
            <SendIcon />
          </Button>
          <Button
            variant="contained"
            onClick={handleCancel}
            style={{ width: "25%", fontSize: "0.8rem" }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
