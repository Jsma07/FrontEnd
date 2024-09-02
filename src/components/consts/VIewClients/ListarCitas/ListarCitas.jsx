import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../../context/ContextoUsuario";
import { Typography, Box } from "@mui/material";
import NavbarClient from "../Navbarclient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import EventModal from "../components/EventModal";
import dayjs from "dayjs";

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/agendas/misCitas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCitas(response.data);
        setLoading(false);
      } catch (error) {
        setError("Hubo un problema al cargar las citas.");
        setLoading(false);
      }
    };

    if (user) {
      fetchCitas();
    }
  }, [user]);

  if (loading) {
    return <p>Cargando citas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const eventos = citas.map((cita) => ({
    title: `${cita.servicio.Nombre_Servicio} con ${cita.empleado.Nombre}`,
    start: `${cita.Fecha}T${cita.Hora}`,
    end: `${cita.Fecha}T${cita.HoraFin}`,
    extendedProps: {
      servicio: cita.servicio.Nombre_Servicio,
      empleado: `${cita.empleado.Nombre} ${cita.empleado.Apellido}`,
      imgServicio: `http://localhost:5000${cita.servicio.ImgServicio}`,
    },
  }));

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const truncateTitle = (title, maxLength = 20) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  const currentDate = new Date();
  const minDate = currentDate.toISOString().split("T")[0];
  const maxDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
    .toISOString()
    .split("T")[0];

  return (
    <div className="mis-citas-container">
      <NavbarClient />
      <Box
        sx={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "auto",
          marginTop: "60px",
        }}
      >
        {citas.length === 0 ? (
          <Typography variant="body1">No tienes citas programadas.</Typography>
        ) : (
          <Box
            sx={{
              marginTop: "40px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#fdf7ff",
            }}
          >
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={esLocale}
              events={eventos}
              eventContent={(eventInfo) => {
                const startTime = dayjs(eventInfo.event.start).format("HH:mm"); // Formato de 24 horas
                const endTime = dayjs(eventInfo.event.end).format("HH:mm");

                return (
                  <div style={{ position: "relative" }}>
                    {/* Emoji de uñas */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-35px",
                        left: "16%",
                        transform: "translateX(-50%)",
                        fontSize: "20px",
                      }}
                    >
                      💅✨
                    </div>
                    {/* Título del evento con hora de inicio y fin */}
                    <div>
                      <strong>{truncateTitle(eventInfo.event.title)}</strong>
                      <br />
                      {startTime} - {endTime}
                    </div>
                  </div>
                );
              }}
              eventClick={handleEventClick}
              height="auto"
              contentHeight="500px"
              aspectRatio={1.5}
              dayMaxEventRows={3}
              eventTextColor="white"
              eventBackgroundColor="#e0aaff"
              eventBorderColor="#d18bff"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              dayHeaderClassNames="fc-day-header"
              validRange={{
                start: minDate,
                end: maxDate,
              }}
              views={{
                dayGridMonth: {
                  titleFormat: { year: "numeric", month: "long" },
                },
              }}
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
              }}
              dayCellClassNames="day-cell"
            />
          </Box>
        )}

        {selectedEvent && (
          <EventModal
            open={!!selectedEvent}
            handleClose={handleCloseModal}
            event={selectedEvent}
          />
        )}
      </Box>
    </div>
  );
};

export default MisCitas;
