import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, List, ListItem, ListItemButton, ListItemText, Paper, Typography, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';

export default function CustomTimeSelect({ selectedTime, setSelectedTime, selectedDate }) {
  const [occupiedTimes, setOccupiedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    const fetchOccupiedTimes = async () => {
      if (selectedDate) {
        setLoading(true);
        try {
          console.log("Fetching hours for date:", selectedDate.format('YYYY-MM-DD'));
          const response = await axios.get('http://localhost:5000/api/agendas/horasOcupadas', {
            params: { fecha: selectedDate.format('YYYY-MM-DD') },
          });
          console.log("Response from backend:", response.data);

          const formattedOccupiedTimes = response.data.map(time => dayjs(time, 'HH:mm:ss').format('HH:mm'));

          setOccupiedTimes(formattedOccupiedTimes);
          console.log("Occupied times set:", formattedOccupiedTimes);

          
        } catch (error) {
          console.error("Error fetching occupied times", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const checkInactiveDay = async () => {
      if (selectedDate) {
        try {
          const response = await axios.get('http://localhost:5000/api/horarios');
          const inactiveDays = response.data
            .filter(horario => horario.estado === 'inactivo')
            .map(horario => dayjs(horario.fecha));
          const isDayInactive = inactiveDays.some(inactiveDate => inactiveDate.isSame(selectedDate, 'day'));
          setIsInactive(isDayInactive);

          if (isDayInactive) {
            Swal.fire({
              title: 'Día Inactivo',
              text: 'La fecha seleccionada está inactiva. Por favor, elige otra fecha.',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
        } catch (error) {
          console.error("Error checking inactive days", error);
        }
      }
    };

    fetchOccupiedTimes();
    checkInactiveDay();
  }, [selectedDate]);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 13; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        times.push(dayjs().hour(hour).minute(minute).format('HH:mm'));
      }
    }
    return times;
  };

  const handleChange = (time) => {
    if (!occupiedTimes.includes(time)) {
      setSelectedTime(time);
    }
  };

  return (
    
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        sx={{
          maxHeight: 380,
          overflow: 'auto',
          padding: 1,
          borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#331bb1' }}>
          Hora del Servicio
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : isInactive ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
            <Typography variant="h6" color="error">
              Opps, no puedes crear citas en este día.
            </Typography>
          </Box>
        ) : (
          <List>
            {generateTimeOptions().map((time, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleChange(time)}
                  disabled={occupiedTimes.includes(time)}
                  sx={{
                    borderRadius: '18px',
                    margin: '1px 0',
                    backgroundColor: occupiedTimes.includes(time) ? 'transparent' : 'transparent',
                    color: occupiedTimes.includes(time) ? '#000000' : '#3f51b5',
                    cursor: occupiedTimes.includes(time) ? 'no-drop' : 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      width: '98%',
                      padding: '7px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: occupiedTimes.includes(time) ? '#ffcdd2' : (time === selectedTime ? '#bbdefb' : 'transparent'),
                      border: time === selectedTime ? '1px solid #3f51b5' : '1px solid #ccc',
                      borderRadius: '20px',
                      boxShadow: occupiedTimes.includes(time) ? '0px 5px 12px rgba(255, 0, 0, 0.5)' : (time === selectedTime ? '0px 5px 12px rgba(0, 0, 0, 0.2)' : 'none'),
                    }}
                  >
                    <ListItemText primary={time} sx={{ textAlign: 'center', color: occupiedTimes.includes(time) ? '#000000' : 'inherit' }} />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </LocalizationProvider>
  );
}
