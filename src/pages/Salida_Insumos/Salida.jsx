import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";

const Salida = () => {
  const columns = [
    { name: "Insumo", selector: "insumos", sortable: true },
    { name: "IDVenta", selector: "idVenta", sortable: true },
    { name: "Cantidad", selector: "Cantidad", sortable: true },
    { name: "Fecha", selector: "date", sortable: true },
    { name: "Estado", selector: "estado", sortable: true },
    { name: "Acciones", selector: "action", sortable: true },
  ];
  const room = [
    {
      id: 1,
      insumos: "Esmaltes",
      image:
        "https://i.pinimg.com/474x/01/cf/a5/01cfa537f145c625692adf907f0cb1df.jpg",
      iDVenta: 1,
      Cantidad: 1,
      date: "2024-04-25",
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
          Anular
        </button>
      ),
    },
    {
      id: 1,
      insumos: "Limas",
      image:
        "https://i.pinimg.com/474x/01/cf/a5/01cfa537f145c625692adf907f0cb1df.jpg",
      iDVenta: 1,
      Cantidad: 1,
      date: "2024-04-25",
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
          Anular
        </button>
      ),
    },
    {
      id: 1,
      insumos: "Herramientas ",
      image:
        "https://i.pinimg.com/474x/01/cf/a5/01cfa537f145c625692adf907f0cb1df.jpg",
      iDVenta: 1,
      Cantidad: 1,
      date: "2024-04-25",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>{" "}
          Habilitado
        </span>
      ),
      action: (
        <button
          type="button"
          class="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <CancelIcon className="text-base mr-1" />
          Anular
        </button>
      ),
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRoom = room.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div
      style={{
        paddingTop: "5px",
        width: "90vw",
        margin: "0 auto",
        marginLeft: "-11vw",
        borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
        marginTop: "-40px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Ajusta los valores según sea necesario
      }}
      className="p-5 w-90vw mx-auto -ml-11vw rounded-full overflow-hidden"
    >
      <div
        className="w-full mx-auto max-w-full shadow-lg"
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
            <h4 className="text-5xl mb-4">Gestión salida insumos</h4>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900"></div>

              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="mt-20 mr-4 flex justify-end">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="search"
                        id="search"
                        className="block w-96 p-2 pl-8 pr-10 text-sm border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        required
                      />

                      <button
                        type="submit"
                        className="absolute inset-y-0 right-0 px-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-r text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <SearchIcon className="text-base mr-3" />
                      </button>
                    </div>
                  </form>
                </div>
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
                    {room
                      .filter((row) =>
                        Object.values(row).some(
                          (value) =>
                            typeof value === "string" &&
                            value
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                      )
                      .map((row, index) => (
                        <tr
                          key={index}
                          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td class="py-4">
                            <div class="flex items-center">
                              <img
                                src={row.image}
                                className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
                                alt={row.insumos}
                              />
                              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                {row.insumos}
                              </td>
                            </div>
                          </td>
                          <td class="px-6 py-4">{row.iDVenta}</td>

                          <td class="px-6 py-4">
                            <div class="flex items-center">
                              <div>
                                <input
                                  type="number"
                                  id="first_product"
                                  class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder={row.Cantidad}
                                  required
                                />
                              </div>
                            </div>
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

export default Salida;
