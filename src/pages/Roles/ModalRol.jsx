import React, { useState } from 'react';
import { Button, Checkbox, FormControlLabel, Grid, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';


const AddRoleModal = ({ open, handleClose }) => {
  const [permissions, setPermissions] = useState({
    Dashboard: { Leer: false, Crear: false },
    Usuarios: { Leer: false, Crear: false },
    Configuracion: { Leer: false, Crear: false },
    Ventas: { Leer: false, Crear: false },
  });

  const handlePermissionChange = (category, permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [category]: {
        ...prevPermissions[category],
        [permission]: !prevPermissions[category][permission],
      },
    }));
  };

  const handleAddRole = () => {
    // Aquí puedes implementar la lógica para agregar el nuevo rol con los permisos seleccionados
    console.log('Nuevo rol y permisos:', permissions);
    // Luego puedes cerrar el modal
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: 20, borderRadius: 8 }}>
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: 25 }}>Agregar Nuevo Rol</Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="input-with-sx" label="Nombre" variant="standard" style={{ marginBottom: 10 }} /> {/* Agrega margen inferior aquí */}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {Object.entries(permissions).map(([category, categoryPermissions]) => (
            <Grid item xs={12} key={category}>
              <Typography variant="subtitle1">{category}</Typography>
              <Grid container spacing={1} style={{ marginTop: 5 }}>
                {Object.entries(categoryPermissions).map(([permission, value]) => (
                  <Grid item key={permission}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={() => handlePermissionChange(category, permission)}
                        />
                      }
                      label={permission}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Button
  variant="contained"
  color="primary"
  onClick={handleAddRole}
  style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto', display: 'block', justifyContent: 'space-between' }}
>
  <span style={{ marginRight: '8px' }}>Enviar</span>
  <SendIcon />
</Button>

      </div>
    </Modal>
  );
};

export default AddRoleModal;
