import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, Fab, Tooltip, Box, Avatar, Input, Pagination, CardActionArea, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { motion, Reorder } from 'framer-motion';
import ModalInactivarFecha from '../../components/consts/ModalInactivarFecha'; 
import UpdateDisabledIcon from '@mui/icons-material/UpdateDisabled';
import DeleteIcon from '@mui/icons-material/Delete';

dayjs.locale('es');

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const FechasTrabajo = () => {
  const [horarios, setHorarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [page, setPage] = useState(1);
  const [cardsPerPage] = useState(6); // Ajusta el número de tarjetas por página

  const fetchHorarios = () => {
    axios.get('http://localhost:5000/api/horarios')
      .then(response => {
        const horariosWithColors = response.data.map(horario => ({
          ...horario,
          color: getRandomColor()
        }));
        setHorarios(horariosWithColors);
      })
      .catch(error => {
        console.error('Error al obtener los horarios:', error);
      });
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFechaInactivada = () => {
    fetchHorarios();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEstadoFilterChange = (event) => {
    setSelectedEstado(event.target.value);
  };

  const handleEliminarHorario = (id) => {
    axios.delete(`http://localhost:5000/api/eliminarHorarios/${id}`)
      .then(() => {
        setHorarios(horarios.filter(horario => horario.id !== id));
      })
      .catch(error => {
        console.error('Error al eliminar el horario:', error);
      });
  };

  const filteredHorarios = horarios.filter(horario => {
    const matchesSearchTerm = dayjs(horario.fecha).format('DD/MM/YYYY').includes(searchTerm);
    const matchesEstado = selectedEstado ? horario.estado === selectedEstado : true;
    return matchesSearchTerm && matchesEstado;
  });

  const indexOfLastCard = page * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredHorarios.slice(indexOfFirstCard, indexOfLastCard);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <section>
      <div
        style={{
          paddingTop: "5px",
          margin: "0 auto",
          borderRadius: "40px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.1)",
          position: "fixed",
          left: "90px",
          top: "80px",
          width: "calc(100% - 100px)",
        }}
      >
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-4">
            <h4
              style={{
                textAlign: "left",
                fontSize: "23px",
                fontWeight: "bold",
              }}
              className="text-3xl"
            >
              Fechas de Trabajo
            </h4>
            <div className="relative w-80">
              <Input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por fecha (DD/MM/YYYY)"
                fullWidth
              />
            </div>
          </div>

          <Reorder.Group 
            axis="x" 
            values={currentCards} 
            onReorder={setHorarios}
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '16px', 
              marginBottom: '16px', 
              overflowX: 'auto',
              maxWidth: '100%',
              justifyContent: 'start'
            }}
          >
            {currentCards.map(horario => (
              <Reorder.Item 
                key={horario.id} 
                value={horario} 
                whileHover={{ scale: 1.09 }} 
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ 
                  flex: '0 0 calc(33.333% - 16px)', // 3 items per row with gap adjustment
                  maxWidth: 'calc(33.333% - 16px)',
                  minWidth: '250px' // Ensure minimum width
                }} 
              >
                <motion.div>
                  <Card sx={{ backgroundColor: '#E3F2FD', borderRadius: 2 }}>
                    <CardActionArea>
                      <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Avatar sx={{ backgroundColor: horario.color, marginRight: 2 }}>
                            {dayjs(horario.fecha).format('DD')}
                          </Avatar>
                          <Box textAlign="center" flexGrow={1}>
                            <Typography variant="h6" component="div">
                              {dayjs(horario.fecha).format('DD/MM/YYYY')}
                            </Typography>
                            <Typography variant="body2">
                              Estado: {horario.estado}
                            </Typography>
                          </Box>
                          <IconButton 
                            aria-label="delete" 
                            onClick={() => handleEliminarHorario(horario.id)} 
                            sx={{ 
                              backgroundColor: '#FFEBEE', 
                              '&:hover': {
                                backgroundColor: '#FFCDD2'
                              }, 
                              borderRadius: '50%', 
                              padding: 1
                            }}
                          >
                            <DeleteIcon color="error" style={{ fontSize: "2.3rem"}}  />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <Box display="flex" justifyContent="center" mb={2}>
            <Pagination
              count={Math.ceil(filteredHorarios.length / cardsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>

          <Tooltip title="Crear Fechas" placement="top" TransitionProps={{ timeout: 500 }}>
            <Fab
              aria-label="add"
              style={{
                border: "0.9px solid grey",
                backgroundColor: "#94CEF2",
                position: "fixed",
                bottom: "50px",
                right: "50px",
                zIndex: 1000,
              }}
              onClick={handleOpenModal}
            >
              <UpdateDisabledIcon style={{ fontSize: "2.0rem"}}/>
            </Fab>
          </Tooltip>
          <ModalInactivarFecha open={modalOpen} handleClose={handleCloseModal} onFechaInactivada={handleFechaInactivada} />
        </div>
      </div>
    </section>
  );
};

export default FechasTrabajo;
