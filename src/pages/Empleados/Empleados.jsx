import React, { useState, useEffect } from "react";
import axios from "axios";
import CancelIcon from "@mui/icons-material/Cancel";

const Empleados = () => {
  const [Empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Empleados"
        );
        setEmpleados(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de Empleados:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { name: "FotoPerfil", label: "Foto de Perfil" },
    { name: "Nombre", label: "Nombre" },
    { name: "Apellido", label: "Apellido" },
    { name: "Correo", label: "Correo" },
    { name: "Telefono", label: "Teléfono" },
    { name: "Estado", label: "Estado" },
    { name: "IdRol", label: "ID de Rol" },
    { name: "Acciones", label: "Acciones" },
  ];

  return (
    <div
      style={{
        paddingTop: "5px",
        width: "90vw",
        margin: "0 auto",
        marginLeft: "-11vw",
        borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
        marginTop: "-40px",
      }}
    >
      <div
        className="w-full mx-auto max-w-full"
        style={{
          position: "fixed",
          top: "calc(50% - 90px)",
          left: "90px",
          top: "80px",
          width: "92%",
          overflowY: "auto",
        }}
      >
        <div className="w-full mx-auto max-w-full">
          <div className="bg-white rounded-lg shadow-md p-8 border border-purple-500">
            <h4 className="text-5xl mb-4">Gestión de empleados</h4>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900"></div>

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-pink-100 dark:bg-pink-700 dark:text-gray-400">
                    <tr>
                      {columns.map((column) => (
                        <th key={column.name} scope="col" className="px-6 py-3">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Empleados.map((cliente, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        {columns.map((column) => (
                          <td
                            key={column.name}
                            className="px-6 py-4 font-semibold text-gray-900 dark:text-white"
                          >
                            {column.name === "FotoPerfil" ? (
                              <img
                                src={cliente.FotoPerfil}
                                className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
                                alt={`${cliente.Nombre} ${cliente.Apellido}`}
                              />
                            ) : column.name === "Estado" ? (
                              <span className="inline-flex items-center">
                                <span
                                  className={`h-2 w-2 rounded-full mr-1 ${
                                    cliente[column.name] === 1
                                      ? "bg-blue-500"
                                      : cliente[column.name] === 2
                                      ? "bg-green-500"
                                      : cliente[column.name] === 3
                                      ? "bg-red-500"
                                      : ""
                                  }`}
                                ></span>{" "}
                                {cliente[column.name] === 1
                                  ? "En proceso"
                                  : cliente[column.name] === 2
                                  ? "Terminado"
                                  : cliente[column.name] === 3
                                  ? "Anulada"
                                  : ""}
                              </span>
                            ) : (
                              cliente[column.name]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empleados;
