import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../../context/ContextoUsuario";
import { Typography } from "@mui/material";

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        // Asegúrate de que el token se esté recuperando correctamente
        const token = localStorage.getItem('token'); // Asegúrate de que el token esté presente en el localStorage
        const response = await axios.get(
          "http://localhost:5000/api/agendas/misCitas",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Usa el token del localStorage
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

  return (
    <div>
      <h2>Mis Citas</h2>
      {user && (
        <Typography variant="h6" component="h3">
          Tu: {user.nombre || user.Nombre}
        </Typography>
      )}
      {citas.length === 0 ? (
        <p>No tienes citas programadas.</p>
      ) : (
        <ul>
          {citas.map((cita) => (
            <li key={cita.IdAgenda}>
              <p>Servicio: {cita.servicio.Nombre_Servicio}</p>
              <p>
                Empleado: {cita.empleado.Nombre} {cita.empleado.Apellido}
              </p>
              <p>Fecha: {cita.Fecha}</p>
              <p>Hora: {cita.Hora}</p>
              <img src={cita.servicio.ImgServicio} alt="Servicio" width="100" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisCitas;
