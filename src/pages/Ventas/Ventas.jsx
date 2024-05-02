import React from "react";

import CancelIcon from "@mui/icons-material/Cancel";

const Ventas = () => {
  const columns = [
    { name: "img", selector: "image", sortable: true },
    { name: "Cantidad", selector: "Cantidad", sortable: true },
    { name: "Empelado", selector: "empleado", sortable: true },
    { name: "Cliente", selector: "Cliente", sortable: true },
    { name: "Fecha", selector: "date", sortable: true },
    { name: "Estado", selector: "estado", sortable: true },
    { name: "Acciones", selector: "action", sortable: true },
  ];

  const room = [
    {
      image:
        "https://i.pinimg.com/474x/c6/67/23/c66723df095f3a44cf0574c71c492bc6.jpg",
      product: "Apple Watch",
      empleado: "Johan steven martinez",
      cliente: "Eduardo mosquera",
      date: "2024-04-25",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>{" "}
          Vendido
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
        "https://i.pinimg.com/474x/2c/02/89/2c0289313ee273171604c6720971085a.jpg",
      product: "Apple Watch",
      empleado: "Johan steven martinez",
      cliente: "Eduardo mosquera",
      date: "2024-04-25",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span> Anulado
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
        "https://i.pinimg.com/474x/77/13/e3/7713e3d43b2f83819ac6ccad279d2afc.jpg",
      product: "Apple Watch",
      empleado: "Johan steven martinez",
      cliente: "Eduardo mosquera",
      date: "2024-04-25",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>{" "}
          Vendido
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
            <h4 className="text-5xl mb-4">Gestión de Ventas</h4>

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
                              alt={row.product}
                            />
                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {row.product}
                            </td>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex items-center">
                            <button
                              class="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                              type="button"
                            >
                              <span class="sr-only">Quantity button</span>
                              <svg
                                class="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M1 1h16"
                                />
                              </svg>
                            </button>
                            <div>
                              <input
                                type="number"
                                id="first_product"
                                class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder={row.empleado}
                                required
                              />
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {row.empleado}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {row.cliente}
                        </td>
                        <td class="px-6 py-4">{row.date}</td>

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

export default Ventas;
