import * as React from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, List, ListItem, ListItemButton, ListItemText, Paper, Typography, CircularProgress } from '@mui/material';

export default function CustomTimeSelect({ selectedTime, setSelectedTime, selectedDate }) {
  const [occupiedTimes, setOccupiedTimes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchOccupiedTimes = async () => {
      if (selectedDate) {
        setLoading(true);
        try {
          console.log("Fetching hours for date:", selectedDate.format('YYYY-MM-DD')); // Log de la fecha
          const response = await axios.get('http://localhost:5000/api/agendas/horasOcupadas', {
            params: { fecha: selectedDate.format('YYYY-MM-DD') },
          });
          console.log("Response from backend:", response.data); // Log de la respuesta del backend
          setOccupiedTimes(response.data);
        } catch (error) {
          console.error("Error fetching occupied times", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOccupiedTimes();
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
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#3f51b5' }}>
          Hora del Servicio
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
            <CircularProgress color="primary" />
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
                    backgroundColor: occupiedTimes.includes(time) ? '#ffcccc' : 'transparent',
                    color: occupiedTimes.includes(time) ? '#ff0000' : '#3f51b5',
                    cursor: occupiedTimes.includes(time) ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      padding: '7px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: time === selectedTime ? '#bbdefb' : 'transparent',
                      border: time === selectedTime ? '2px solid #3f51b5' : '1px solid #ccc',
                      borderRadius: '12px',
                      boxShadow: time === selectedTime ? '0px 5px 12px rgba(0, 0, 0, 0.2)' : 'none',
                    }}
                  >
                    <ListItemText primary={time} sx={{ textAlign: 'center' }} />
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
