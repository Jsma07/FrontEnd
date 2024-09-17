import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, IconButton, Typography, Divider, Tabs, Tab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';  // Importa el componente Avatar


const NotificationCard = styled('div')(({ theme, read, expanded }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: read ? 'transparent' : theme.palette.action.hover,
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  minHeight: expanded ? '100px' : '50px',  // Expande el tamaño al hacer clic
  display: 'flex',
  alignItems: 'center',  // Alineación vertical
}));

const NotificationModal = ({ open, handleClose, setNotificaciones, notificaciones, unreadCount, setUnreadCount }) => {
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState('aplazamiento'); // Estado para el valor de la pestaña

  const handleMarkAsRead = async (notifId) => {
    try {
      await axios.put(`https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/api/notificaciones/${notifId}/leido`);
      setNotificaciones(prevNotifs => 
        prevNotifs.map(notif => 
          notif.IdNotificacion === notifId ? { ...notif, Leido: true } : notif
        )
      );
      setUnreadCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error al marcar la notificación como leída", error);
    }
  };

  const handleExpandNotification = (notifId) => {
    setExpandedNotification(prev => prev === notifId ? null : notifId);
  };

  const handleDeleteNotification = async (notifId) => {
    try {
      await axios.delete(`https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/api/notificaciones/${notifId}`);
      setNotificaciones(prevNotifs => prevNotifs.filter(notif => notif.IdNotificacion !== notifId));
    } catch (error) {
      console.error("Error al eliminar la notificación", error);
    }
  };

  const filteredNotificaciones = notificaciones
    .filter(notif => tabValue === 'otro' || notif.Tipo === tabValue)
    .filter(notif =>
      notif.Tipo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notif.Mensaje.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Notificaciones
        <IconButton aria-label="close" onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          aria-label="notificaciones tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ marginBottom: '20px' }}
        >
          <Tab label="Aplazar cita" value="aplazar" />
          <Tab label="Anular cita" value="anular" />
          <Tab label="Otro" value="otro" />
        </Tabs>

        <TextField
          label="Buscar"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Divider />

        {filteredNotificaciones.length === 0 ? (
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '20px' }}>
            No se encontraron notificaciones.
          </Typography>
        ) : (
          filteredNotificaciones.map((notif) => (
            <NotificationCard
              key={notif.IdNotificacion}
              onClick={() => handleMarkAsRead(notif.IdNotificacion)}
              read={notif.Leido}
              expanded={expandedNotification === notif.IdNotificacion}
            >
              <Avatar src={notif.cliente.Img} alt={`${notif.cliente.nombre} ${notif.cliente.apellido}`} /> {/* Imagen del usuario */}
              <div onClick={() => handleExpandNotification(notif.IdNotificacion)} style={{ flex: 1, marginLeft: '10px' }}>
                <Typography variant="body1" component="p" noWrap={expandedNotification !== notif.IdNotificacion}>
                  <strong>{notif.Tipo}</strong>
                </Typography>
                <Typography variant="body2" component="p" noWrap={expandedNotification !== notif.IdNotificacion}>
                  {notif.Mensaje}
                </Typography>
              </div>
              <IconButton onClick={() => handleDeleteNotification(notif.IdNotificacion)} aria-label="delete">
                <DeleteIcon color="error" />
              </IconButton>
            </NotificationCard>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
