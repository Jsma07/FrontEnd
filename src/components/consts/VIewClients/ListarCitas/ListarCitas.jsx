import React, { useEffect, useState, useContext } from "react"; // Importa React y los hooks useEffect, useState, y useContext
import axios from "axios"; // Importa Axios para hacer peticiones HTTP
import { UserContext } from "../../../../context/ContextoUsuario"; // Importa el contexto de usuario
import { Typography } from "@mui/material"; // Importa el componente Typography de Material UI para estilizar texto

const MisCitas = () => {
  // Declara el estado para almacenar las citas, el estado de carga y los posibles errores
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extrae el usuario del contexto de usuario
  const { user } = useContext(UserContext);

  // useEffect se ejecuta después del primer renderizado y cada vez que el estado 'user' cambie
  useEffect(() => {
    console.log("Token:", user); // Log para verificar el token o la información del usuario en la consola

    // Función asincrónica que obtiene las citas del backend
    const fetchCitas = async () => {
      try {
        // Realiza una petición GET a la API para obtener las citas
        const response = await axios.get(
          "http://localhost:5000/api/agendas",
          {}
        );
        // Filtra las citas para mostrar solo las que pertenecen al cliente con IdCliente 17
        const citasF = response.data.filter((citas) => citas.IdCliente === 17)
        // Actualiza el estado de las citas con las citas filtradas
        setCitas(citasF);
        // Marca como finalizada la carga de datos
        setLoading(false);
      } catch (error) {
        // En caso de error, actualiza el estado del error y detiene la carga
        setError("Hubo un problema al cargar las citas.");
        setLoading(false);
      }
    };

    fetchCitas(); // Llama a la función para obtener las citas
  }, [user]); // 'user' es la dependencia de useEffect, por lo que si cambia, se vuelve a ejecutar el efecto

  // Si los datos aún están cargando, muestra un mensaje de carga
  if (loading) {
    return <p>Cargando citas...</p>;
  }

  // Si hubo un error, muestra el mensaje de error
  if (error) {
    return <p>{error}</p>;
  }

  // Renderiza la interfaz principal de las citas
  return (
    <div>
      <h2>Mis Citas</h2>
      {user && (
        <Typography variant="h6" component="h3">
          Tu: {user.nombre || user.Nombre} {/* Muestra el nombre del usuario */}
        </Typography>
      )}
      {citas.length === 0 ? (
        // Si no hay citas, muestra un mensaje indicando que no hay citas programadas
        <p>No tienes citas programadas.</p>
      ) : (
        // Si hay citas, las muestra en una lista
        <ul>
          {citas.map((cita) => (
            <li key={cita.id}> {/* Cada cita es una lista */}
              <p>Servicio: {cita.servicio.Nombre_Servicio}</p>
              <p>
                Empleado: {cita.empleado.Nombre} {cita.empleado.Apellido}
              </p>
              <p>Cliente: {cita.cliente.Nombre}</p>
              <p>Fecha: {cita.Fecha}</p>
              <p>Hora: {cita.Hora}</p>
              {/* Muestra la imagen del servicio */}
              <img src={cita.servicio.ImgServicio} alt="Servicio" width="100" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisCitas; // Exporta el componente para su uso en otras partes de la aplicación
