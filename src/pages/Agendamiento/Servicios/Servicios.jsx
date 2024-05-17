import React, { useState } from "react";
import Table from "../../../components/consts/Tabla";

const Servicios = () => {
  const [rows] = useState([
    {
      id: 1,
      Servicio: "https://i.pinimg.com/736x/62/37/42/623742355124564336d097be9016b3b7.jpg",
      Nombre: "Uñas Permanentes",
      Tiempo: "2 Horas",
      Precio: "55.000",
      NivelUña: "12",
      Estado: "Terminado",
      isActive: false,
    },
    {
      id: 2,
      Servicio: "https://i.pinimg.com/474x/24/8b/d9/248bd907c3bcd7ed17557c23d32298e0.jpg",
      Nombre: "Uñas Esculpidas",
      Tiempo: "1 Horas",
      Precio: "Monica",
      NivelUña: "5",
      Estado: "Cancelado",
      isActive: false,
    },
    {
      id: 3,
      Servicio: "https://i.pinimg.com/236x/34/3e/3d/343e3d8931ffe5269742f51cc915daa6.jpg",
      Nombre: "Uñas 3D",
      Tiempo: "3 Horas",
      Precio: "60.000",
      NivelUña: "7",
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
    { field: "id", headerName: "ID", width: "w-1" },
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
    { field: "Tiempo", headerName: "Tiempo", width: "w-32" },
    { field: "Precio", headerName: "Precio", width: "w-32" },
    { field: "NivelUña", headerName: "NivelUña", width: "w-32", renderCell: (params) => <div className="text-center">{params.row.NivelUña}</div> },
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
      <h1>Servicios</h1>
      <Table columns={columns} data={rows} />
    </div>
  );
};

export default Servicios;
