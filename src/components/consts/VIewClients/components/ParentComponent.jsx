import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, List, ListItem,Button ,ListItemText, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import axios from 'axios';

const StyledListItem = styled(ListItem)(({ theme, occupied, selected }) => ({
  borderRadius: '12px',
  margin: '10px 0',
  padding: '15px',
  border: `2px solid ${selected ? '#6950f3' : occupied ? '#6e6e6e' : '#0D0D0D'}`, // Borde morado si está seleccionado
  cursor: 'pointer',
  backgroundColor: selected ? 'transparent' : occupied ? '#d3d3d3' : 'transparent', // Fondo transparente si está seleccionado
  color: selected ? '#6950f3' : occupied ? '#6e6e6e' : theme.palette.text.primary,
  pointerEvents: occupied ? 'none' : 'auto',
  fontSize: '20px',
  textAlign: 'center',
  width: '150%',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? 'transparent' : occupied ? '#d3d3d3' : theme.palette.action.hover,
    transform: 'scale(1.06)',
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));
const StyledDayButton = styled(Button)(({ theme, selected }) => ({
  borderRadius: '50%',
  fontSize: '25px',
  fontFamily: 'zantrokeregular',
  fontWeight: 'bold',
  minWidth: '70px',
  minHeight: '70px',
  margin: '10px',
  padding: 0,
  backgroundColor: selected ? '#6950f3' : 'transparent',
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  border: `2px solid ${selected ? '#f0eaff' : theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? '#5c4ace' : '#A6A6A6',
    transform: 'scale(1.06)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

const DayLabel = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#050000',
  fontFamily: 'Circular, sans-serif',
  textAlign: 'center',
  position: 'absolute',
  bottom: '-30px',
  width: '100%',
  fontWeight: 549, // Puedes cambiar esto a 700, 800 o 900 si lo prefieres
}));

const TimeSelect = ({ hours = [], occupiedHours = [], handleHourChange, loading }) => {
  const [selectedHour, setSelectedHour] = useState(null);

  const handleClick = (hour) => {
    setSelectedHour(hour);
    handleHourChange(hour);
  };

  return (

      <>
        {loading ? (
          <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <List>
          {hours.map((hour, index) => (
            <StyledListItem
              key={index}
              onClick={() => handleClick(hour)}
              selected={hour === selectedHour}
              occupied={occupiedHours.includes(hour)}
            >
                <ListItemText primary={hour} sx={{ textAlign: 'center'  }} />
              </StyledListItem>
            ))}
          </List>
        )}
      </>
    );
  };

  const DaySelect = ({ days = [], handleDayChange, selectedDay = null, inactiveDays = [] }) => {
    const [visibleDays, setVisibleDays] = useState(days.slice(0, 7));
    
  const handlePrev = () => {
    const firstVisibleDayIndex = days.indexOf(visibleDays[0]);
    if (firstVisibleDayIndex > 0) {
      setVisibleDays(days.slice(firstVisibleDayIndex - 7, firstVisibleDayIndex));
      handleDayChange(days[firstVisibleDayIndex - 7]);
    }
  };

  const handleNext = () => {
    const lastVisibleDayIndex = days.indexOf(visibleDays[visibleDays.length - 1]);
    if (lastVisibleDayIndex < days.length - 1) {
      setVisibleDays(days.slice(lastVisibleDayIndex + 1, lastVisibleDayIndex + 8));
      handleDayChange(days[lastVisibleDayIndex + 1]);
    }
  };
  const selectedDayDate = dayjs(selectedDay);

  return (
    <Paper
    elevation={3}
    className="p-4 mt-4"
    sx={{
      backgroundColor: "#f5f5f5",
      borderRadius: "25px",
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px, rgba(0, 0, 0, 0.1) 0px 7px 13px -3px',
      margin: '0 auto 14px',
      marginLeft: '69px',
      marginRight: '80px',
      width: '800px',
      height: '175px',
    }}
  >
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={2}>
        <IconButton aria-label="prev" onClick={handlePrev} disabled={visibleDays[0] === days[0]}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="h5" component="h2" align="center">
          {selectedDayDate.format('MMMM YYYY')}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <IconButton aria-label="next" onClick={handleNext} disabled={visibleDays[visibleDays.length - 1] === days[days.length - 1]}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
    <Grid container spacing={1} justifyContent="center">
      {visibleDays.map((day, index) => (
        <Grid key={index} item>
          <StyledDayButton
            selected={selectedDay === day}
            onClick={() => handleDayChange(day)}
            sx={{
              backgroundColor: inactiveDays.includes(day) ? '#d3d3d3' : undefined,
              color: inactiveDays.includes(day) ? '#6e6e6e' : undefined,
            }}
            disabled={inactiveDays.includes(day)}
          >
            <span>{dayjs(day).format('DD')}</span>
            <DayLabel>
              {dayjs(day).format('ddd')}
            </DayLabel>
          </StyledDayButton>
        </Grid>
      ))}
    </Grid>
  </Paper>
);
};

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 8; hour <= 11; hour++) {
    times.push(dayjs().hour(hour).minute(0).format('HH:mm'));
  }
  for (let hour = 13; hour <= 16; hour++) {
    times.push(dayjs().hour(hour).minute(0).format('HH:mm'));
  }
  return times;
};

const generateDaysOfWeek = () => {
  const days = [];
  const startDate = dayjs();
  const endDate = startDate.add(1, 'month').endOf('month');

  for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
    days.push(date.format('YYYY-MM-DD'));
  }

  return days;
};

const ParentComponent = ({ onDateSelect, onHourSelect }) => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedHour, setSelectedHour] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [inactiveDays, setInactiveDays] = useState([]);
  const [occupiedHours, setOccupiedHours] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const daysResponse = await axios.get('http://localhost:5000/api/horarios/listarFechasConHorasInactivas');
        setInactiveDays(daysResponse.data.map(item => item.fecha));

        const startDate = dayjs();
        const endDate = startDate.add(1, 'month').endOf('month');
        const days = [];

        for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
          days.push(date.format('YYYY-MM-DD'));
        }

        setDaysOfWeek(days);
      } catch (error) {
        console.error('Error al obtener los días inactivos:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchOccupiedHours = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/agendas/horasOcupadas', {
          params: { fecha: selectedDay }, // Cambia 'selectedDate' por 'selectedDay'
        });
        setOccupiedHours(response.data);
      } catch (error) {
        console.error('Error al obtener las horas ocupadas:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOccupiedHours();
  }, [selectedDay]);

  const handleDayChange = (day) => {
    setSelectedDay(day);
    setSelectedHour(null); // Reinicia la hora seleccionada cuando cambia el día
    onDateSelect(day); // Notifica al componente padre la fecha seleccionada
  };

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    onHourSelect(hour); // Notifica al componente padre la hora seleccionada
  };


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
      <DaySelect
          days={daysOfWeek}
          handleDayChange={handleDayChange}
          selectedDay={selectedDay}
          inactiveDays={inactiveDays}
        />
      </Grid>
      <Grid item xs={12} md={6} style={{ marginTop: '-19px', marginLeft: '118px' }}> {/* Ajusta este margen para bajar el TimeSelect */}
      <TimeSelect
          hours={generateTimeOptions()}
          occupiedHours={occupiedHours}
          handleHourChange={handleHourChange}
          loading={loading}
        />
  </Grid>
    </Grid>
  );
};

export default ParentComponent;
