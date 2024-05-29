import React, { useState } from "react";
import TablePrueba from "../../components/consts/Tabla"; // Asegúrate de importar correctamente el archivo

const Agenda = () => {
  const [rows, setRows] = useState([
    {
      
      Servicio: "https://i.pinimg.com/736x/62/37/42/623742355124564336d097be9016b3b7.jpg",
      Nombre: "Uñas Permanentes",
      FechaHora: "2022-04-27 10:00 AM",
      Empleado: "Jacke",
      Cliente: "Estefania",
      Estado: "Terminado",
      isActive: false,
    },
    {
     
      Servicio: "https://i.pinimg.com/474x/24/8b/d9/248bd907c3bcd7ed17557c23d32298e0.jpg",
      Nombre: "Uñas Esculpidas",
      FechaHora: "2022-04-28 11:30 AM",
      Empleado: "Monica",
      Cliente: "Yurani",
      Estado: "Cancelado",
      isActive: false,
    },
    {
      
      Servicio: "https://i.pinimg.com/236x/34/3e/3d/343e3d8931ffe5269742f51cc915daa6.jpg",
      Nombre: "Uñas 3D",
      FechaHora: "2022-04-28 12:30 PM",
      Empleado: "Monica",
      Cliente: "Coraline",
      Estado: "En Proceso",
      isActive: false,
    },
    // Agrega más filas según sea necesario
  ]);

  const handleEditClick = (id) => {
    console.log(`Editando rol con ID: ${id}`);
    // Aquí puedes agregar la lógica para editar el rol directamente sin abrir un modal
  };

  const columns = [
    
    {
      field: "Servicio",
      headerName: "Servicio",
      width: "w-32",
      renderCell: (params) => (
        <img
          src={params.row.Servicio}
          alt="Servicio"
          style={{ maxWidth: "100%", height: "auto", width: "3rem", height: "3rem", borderRadius: "50%" }}
        />
      )
    },
    { field: "Nombre", headerName: "Nombre", width: "w-32" },
    { field: "FechaHora", headerName: "Fecha/Hora", width: "w-32" },
    { field: "Empleado", headerName: "Empleado", width: "w-32" },
    { field: "Cliente", headerName: "Cliente", width: "w-32" },
    { field: "Estado", headerName: "Estado", width: "w-55",
      renderCell: (params) => (
        <div>
          {params.row.Estado === "En Proceso" && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              En Proceso
            </span>
          )}
          {params.row.Estado === "Cancelado" && (
            <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
              Cancelado
            </span>
          )}
          {params.row.Estado === "Terminado" && (
            <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              Terminado
            </span>
          )}
        </div>
      )
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: "w-32",
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          <button onClick={() => handleEditClick(params.row.id)} className="text-yellow-500">
            <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
          </button>
          <button onClick={() => handleEditClick(params.row.id)} className="text-red-500">
            <i className="bx bx-trash" style={{ fontSize: "24px" }}></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Agenda</h1>
      <TablePrueba columns={columns} data={rows} />
    </div>
  );
};

export default Agenda;
