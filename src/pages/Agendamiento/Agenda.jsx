import React, { useState, useEffect } from "react";
import axios from "axios";
import TablePrueba from "../../components/consts/Tabla";
import CustomSwitch from "../../components/consts/switch"; // Si lo necesitas

const Agendamientos = () => {
  const [agendamientos, setAgendamientos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [agendasRes, clientesRes, serviciosRes, empleadosRes] = await Promise.all([
        axios.get("http://localhost:5000/api/agendas"),
        axios.get("http://localhost:5000/jackenail/Listar_Clientes"),
        axios.get("http://localhost:5000/api/servicios"),
        axios.get("http://localhost:5000/jackenail/Listar_Empleados")
      ]);

      setAgendamientos(agendasRes.data);
      setClientes(clientesRes.data);
      setServicios(serviciosRes.data);
      setEmpleados(empleadosRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getNombreCliente = (id) => {
    const cliente = clientes.find((cliente) => cliente.IdCliente === id);
    return cliente ? cliente.NombreCliente : "Desconocido";
  };

  const getNombreServicio = (id) => {
    const servicio = servicios.find((servicio) => servicio.IdServicio === id);
    return servicio ? servicio.Nombre_Servicio : "Desconocido";
  };

  const getNombreEmpleado = (id) => {
    const empleado = empleados.find((empleado) => empleado.IdEmpleado === id);
    return empleado ? empleado.NombreEmpleado : "Desconocido";
  };

  const filtrar = agendamientos.filter((agendamiento) => {
    const { IdCliente, IdServicio, IdEmpleado, EstadoAgenda } = agendamiento;
    const FechaHora = agendamiento["Fecha/Hora"];
    const terminoABuscar = buscar.toLowerCase();

    const nombreCliente = getNombreCliente(IdCliente);
    const nombreServicio = getNombreServicio(IdServicio);
    const nombreEmpleado = getNombreEmpleado(IdEmpleado);
    const fechaHora = FechaHora ? FechaHora.toLowerCase() : "";

    return (
      (nombreCliente && nombreCliente.toLowerCase().includes(terminoABuscar)) ||
      (nombreServicio && nombreServicio.toLowerCase().includes(terminoABuscar)) ||
      (fechaHora && fechaHora.includes(terminoABuscar)) ||
      (nombreEmpleado && nombreEmpleado.toLowerCase().includes(terminoABuscar)) ||
      EstadoAgenda.toString().includes(terminoABuscar)
    );
  });

  const handleToggleSwitch = async (id) => {
    const agendamiento = agendamientos.find((agendamiento) => agendamiento.IdAgendamiento === id);
    if (!agendamiento) {
      console.error("Agendamiento no encontrado");
      return;
    }

    const newEstado = agendamiento.EstadoAgenda === 1 ? 0 : 1;

    const result = await window.Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "¿Quieres cambiar el estado del agendamiento?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/agendas/editar/${id}`, {
          EstadoAgenda: newEstado,
        });
        fetchData();
        window.Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: "El estado del agendamiento ha sido actualizado correctamente.",
        });
      } catch (error) {
        console.error("Error al cambiar el estado del agendamiento:", error);
        window.Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al cambiar el estado del agendamiento. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />
      <TablePrueba
        columns={[
          {
            field: "IdCliente",
            headerName: "CLIENTE",
            width: "w-36",
            renderCell: (params) => <div>{getNombreCliente(params.row.IdCliente)}</div>,
          },
          {
            field: "IdServicio",
            headerName: "SERVICIO",
            width: "w-36",
            renderCell: (params) => <div>{getNombreServicio(params.row.IdServicio)}</div>,
          },
          { field: "FechaHora", headerName: "FECHA/HORA", width: "w-36" },
          {
            field: "IdEmpleado",
            headerName: "EMPLEADO",
            width: "w-36",
            renderCell: (params) => <div>{getNombreEmpleado(params.row.IdEmpleado)}</div>,
          },
          {
            field: "EstadoAgenda",
            headerName: "ESTADO",
            width: "w-36",
            renderCell: (params) => (
              <div>{params.row.EstadoAgenda === 1 ? "En Proceso" : "Inactivo"}</div>
            ),
          },
          {
            field: "Acciones",
            headerName: "ACCIONES",
            width: "w-48",
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                <CustomSwitch
                  active={params.row.EstadoAgenda === 1}
                  onToggle={() => handleToggleSwitch(params.row.IdAgendamiento)}
                />
              </div>
            ),
          },
        ]}
        data={filtrar}
        title={"Gestión de Agendamientos"}
      />
    </div>
  );
};

export default Agendamientos;
