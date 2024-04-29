import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const clientes = () => {
  const columns = [
    { name: "Nombres", selector: "image", sortable: true },
    { name: "apellido", selector: "empleado", sortable: true },
    { name: "Correo", selector: "Cliente", sortable: true },
    { name: "telefono", selector: "date", sortable: true },
    { name: "Estado", selector: "estado", sortable: true },
    { name: "Acciones", selector: "action", sortable: true },
    {
      name: "Agregar",
      selector: "agregar",
      ignoreRowClick: true,
      cell: (row) => (
        <button
          onClick={() => handleAgregar(row)}
          className="text-sm text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded"
        >
          Agregar
        </button>
      ),
    },
  ];

  const room = [
    {
      image:
        "https://i.pinimg.com/474x/2a/f9/25/2af925b3a97c4bd1d1023d27320cac2c.jpg",
      Nombres: "julian tatum",
      apellido: "Mosquera",
      Correo: "Eduardomosquera@gmail.com",
      telefono: "202404435",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>{" "}
          Activo
        </span>
      ),
      action: (
        <button
          type="button"
          class="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <CancelIcon className="text-base mr-1" />
        </button>
      ),
    },
    {
      image:
        "https://i.pinimg.com/474x/6b/e4/25/6be425d231e4706e3f10da187cbf6dde.jpg",
      Nombres: "Eduardo",
      apellido: "Mosquera",
      Correo: "Eduardomosquera@gmail.com",
      telefono: "202404435",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>{" "}
          Inactivo
        </span>
      ),
      action: (
        <button
          type="button"
          class="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <CancelIcon className="text-base mr-1" />
        </button>
      ),
    },
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
            <h4 className="text-5xl mb-4">Gestión de Clientes</h4>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900"></div>

              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-pink-100 dark:bg-pink-700 dark:text-gray-400">
                    <tr>
                      {columns.map((column) => (
                        <th scope="col" class="px-6 py-3">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {room.map((row, index) => (
                      <tr
                        key={index}
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td class="py-4">
                          <div class="flex items-center">
                            <img
                              src={row.image}
                              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
                              alt={row.Nombres}
                            />
                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {row.Nombres}
                            </td>
                          </div>
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {row.apellido}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {row.Correo}
                        </td>

                        <td class="px-6 py-4">{row.telefono}</td>

                        <td class="px-6 py-4">{row.estado}</td>
                        <td class="px-6 py-4">{row.action}</td>
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
export default clientes;
