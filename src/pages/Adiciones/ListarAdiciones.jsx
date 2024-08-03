import React, { useEffect, useState } from "react";
import axios from "axios";
import TablePrueba from "../../components/consts/Tabla";
import { toast } from "react-toastify";

const ListarAdiciones = () => {
  const [adiciones, setAdiciones] = useState([]);
  const [columns, setColumns] = useState([
    { field: "IdAdiciones", headerName: "ID" },
    { field: "NombreAdiciones", headerName: "Nombre" },
    {
      field: "Estado",
      headerName: "Estado",
      renderCell: (params) =>
        renderEstadoButton(params.value, params.row.IdAdiciones),
    },
  ]);

  const renderEstadoButton = (estado, adicionId) => {
    console.log(`Estado value: ${estado}`); // Log el estado value

    let buttonClass, estadoTexto;

    // Aquí definimos los estados como en ventas: 1 para Activo y 2 para Inactivo
    switch (estado) {
      case 1:
        buttonClass = "btn btn-success";
        estadoTexto = "Activo";
        break;
      case 2:
        buttonClass = "btn btn-danger";
        estadoTexto = "Inactivo";
        break;
      default:
        buttonClass = "btn btn-secondary";
        estadoTexto = "Desconocido";
    }

    return (
      <button
        className={buttonClass}
        onClick={() => handleEstadoClick(adicionId, estado)}
      >
        {estadoTexto}
      </button>
    );
  };

  const handleEstadoClick = (adicionId, estadoActual) => {
    // Alternar estado: si es Activo (1) lo pasamos a Inactivo (2) y viceversa
    const nuevoEstado = estadoActual === 1 ? 2 : 1;

    console.log(
      `Estado cambiado para la adición ${adicionId} a ${nuevoEstado}`
    );

    // Aquí puedes agregar la lógica para actualizar el estado en el servidor
    axios
      .put(
        `http://localhost:5000/Jackenail/ActualizarEstadoAdicion/${adicionId}`,
        {
          Estado: nuevoEstado,
        }
      )
      .then((response) => {
        console.log(`Estado actualizado correctamente: ${response.data}`);
        setAdiciones((prevAdiciones) =>
          prevAdiciones.map((adicion) =>
            adicion.IdAdiciones === adicionId
              ? { ...adicion, Estado: nuevoEstado }
              : adicion
          )
        );
        toast.success("Estado actualizado correctamente");
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
        toast.error("Error al actualizar el estado");
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/Jackenail/Listarventas/adiciones")
      .then((response) => {
        console.log(response.data); // Verifica que los datos estén siendo recibidos correctamente
        setAdiciones(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las adiciones:", error);
        toast.error("Error al obtener las adiciones");
      });
  }, []);

  return (
    <TablePrueba
      title="Gestión de Adiciones"
      columns={columns}
      data={adiciones}
    />
  );
};

export default ListarAdiciones;
