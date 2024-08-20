import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ServiceCard from "./components/ServiceCard";
import Sidebar from "./components/Sidebar";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { UserContext } from '../../../context/ContextoUsuario';


import { EmployeeCard, EmployeeSelection } from "./components/EmployeeCard";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import ParentComponent from "./components/ParentComponent";

const StepperContainer = styled(Box)(({ alignment }) => ({
  display: "flex",
  justifyContent: alignment || "center",
  alignItems: "center",
  margin: "20px 0",
}));

const StepperItem = styled(Box)(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  fontWeight: active ? "bold" : "normal",
  color: active ? "#000000" : "#888888",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  cursor: "pointer", // Cambia el cursor al pasar por encima
  "&:not(:last-child)": {
    marginRight: theme.spacing(1),
  },
}));

const Separator = styled(Box)({
  display: "flex",
  alignItems: "center",
  margin: "0 8px",
  color: "gray",
  fontSize: "18px",
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: "justifyContent",
  fontWeight: "bold",
  fontSize: "21px",
  marginTop: "20px",
  marginBottom: "20px",
}));

const SolicitarCita = () => {
  const { user } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [total, setTotal] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/servicios");
        setServices(response.data);
      } catch (error) {
        console.error("Error al obtener los servicios", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Empleados"
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error al obtener los empleados", error);
      }
    };

    fetchServices();
    fetchEmployees();
    setLoading(false);
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddToCart = (service) => {
    if (selectedServiceId === null) {
      setCart([service]);
      setTotal(service.Precio_Servicio);
      setSelectedServiceId(service.IdServicio);
    } else if (selectedServiceId === service.IdServicio) {
      setCart([]);
      setTotal(0);
      setSelectedServiceId(null);
    } else {
      Swal.fire({
        title: "Confirmar cambio",
        text: `¿Quieres cambiar el servicio seleccionado a ${service.Nombre_Servicio}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          setCart([service]);
          setTotal(service.Precio_Servicio);
          setSelectedServiceId(service.IdServicio);
        }
      });
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    const selectedEmp = employees.find((emp) => emp.IdEmpleado === employeeId);
    setSelectedEmployee(selectedEmp); // Actualiza el estado con el empleado seleccionado
  };

  const handleCancel = () => {
    setCart([]);
    setTotal(0);
    setSelectedServiceId(null);
  };

  const handleContinue = () => {
    if (activeStep === 2) {
      const selectedService = services.find(service => service.IdServicio === selectedServiceId);

      const appointmentData = {
        IdServicio: selectedServiceId,
        IdEmpleado: selectedEmployeeId,
        Fecha: selectedDay.format("YYYY-MM-DD"),
        Hora: selectedHour,
        EstadoAgenda: 1,
      };

      // Imprime los datos en la consola para verificar
      console.log("Datos de la cita que se enviarán:", appointmentData);

      // Verificar si alguno de los campos es null o undefined
      if (!appointmentData.IdServicio || !appointmentData.IdEmpleado || !appointmentData.Fecha || !appointmentData.Hora) {
        console.error("Hay datos faltantes en la solicitud:", appointmentData);
        Swal.fire({
          title: "Error",
          text: "Faltan datos en la solicitud. Verifica e intenta nuevamente.",
          icon: "error",
          confirmButtonText: "OK"
        });
        return;
      }

      axios.post("http://localhost:5000/api/agendas/crearAgenda", appointmentData)
        .then(response => {
          Swal.fire({
            title: "Cita Confirmada",
            text: "Tu cita ha sido confirmada con éxito.",
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            navigate("/vistaInicio");
          });
        })
        .catch(error => {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al confirmar tu cita. Inténtalo nuevamente.",
            icon: "error",
            confirmButtonText: "OK"
          });

          // Imprime más detalles del error
          console.error("Error al confirmar la cita:", error.response ? error.response.data : error);
        });
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  const handleDateSelect = (day) => {
    setSelectedDay(dayjs(day)); // Convertir a un objeto dayjs
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
  };

  const steps = ["Servicios", "Profesional", "Hora"];

  if (loading) {
    return (
      <Typography variant="h6" component="p">
        Cargando servicios...
      </Typography>
    );
  }

  return (
    <Box className="pt-17">
      <Paper
        elevation={3}
        className="flex items-center justify-start p-4 shadow-md"
        sx={{
          borderRadius: "100px",
          backgroundColor: "#f5f5f5",
          border: "1px solid #2626269",
        }}
      >
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-700 hover:text-black mr-5"
        >
          <ArrowBackIcon fontSize="small" className="mr-2" />
          Volver
        </button>
        <Typography
          variant="h5"
          component="h1"
          className="text-black font-bold"
          sx={{ fontWeight: "700", fontSize: "1.5rem" }}
        >
          {activeStep === 0
            ? "Seleccionar Servicio"
            : activeStep === 1
            ? "Seleccionar Profesional"
            : activeStep === 2
            ? "Seleccionar Hora"
            : "Confirmar Cita"}
        </Typography>
      </Paper>

      <Box sx={{ width: "70%", maxWidth: "510px", margin: "30px 0 20px 50px" }}>
        <StepperContainer alignment="flex-start">
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <StepperItem
                active={index === activeStep}
                onClick={() => handleStepClick(index)}
              >
                {label}
              </StepperItem>
              {index < steps.length - 1 && (
                <Separator>
                  <NavigateNextIcon fontSize="small" />
                </Separator>
              )}
            </React.Fragment>
          ))}
        </StepperContainer>

        <SectionTitle>
          {activeStep === 0
            ? "Seleccionar Servicio"
            : activeStep === 1
            ? "Seleccionar Profesional"
            : activeStep === 2
            ? "Seleccionar Hora"
            : "Confirmar Cita"}
        </SectionTitle>
      </Box>

      <Box className="p-4 mt-4 flex">
        <Box className="w-2/3">
          {activeStep === 0 &&
            services.map((service) => (
              <ServiceCard
                key={service.IdServicio}
                service={service}
                onAddToCart={() => handleAddToCart(service)}
                isSelected={selectedServiceId === service.IdServicio}
              />
            ))}
          {activeStep === 1 && (
            <Box className="p-20 mt-0 flex">
              <Grid container spacing={2}>
                {employees.map((employee) => (
                  <Grid item xs={12} sm={6} md={4} key={employee.IdEmpleado}>
                    <EmployeeCard
                      employee={employee}
                      isSelected={selectedEmployeeId === employee.IdEmpleado}
                      onSelect={() => handleEmployeeSelect(employee.IdEmpleado)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {activeStep === 2 && (
            <Box className="p-1 mt-1">
              <ParentComponent
                onDateSelect={handleDateSelect}
                onHourSelect={handleHourSelect}
              />
            </Box>
          )}
        </Box>
        <Box className="w-1/3">
          <Sidebar
            business={{
              name: "Spa de uñas | Jake Nail | Manicure en Bello oriente",
              address: "Laureles - Estadio, Laureles, Medellín",
              image:
                "https://i.pinimg.com/736x/af/95/86/af9586d44d0b3dcdf65b8056a66dc8a0.jpg",
            }}
            cart={cart}
            total={total}
            onCancel={handleCancel}
            onContinue={handleContinue}
            disabled={selectedServiceId === null || selectedEmployee === null}
            selectedEmployee={selectedEmployee} // Pasa el empleado seleccionado al Sidebar
            selectedDay={selectedDay}
            selectedHour={selectedHour}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SolicitarCita;
