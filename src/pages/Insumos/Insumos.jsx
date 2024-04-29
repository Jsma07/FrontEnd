import React, { useState } from "react";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Insumos = () => {
  const columns = [
    { name: "Insumo", selector: "insumos", sortable: true },
    { name: "Cantidad", selector: "Cantidad", sortable: true },
    { name: "usos", selector: "usos", sortable: true },
    { name: "Categoria", selector: "Categoria", sortable: true },
    { name: "Estado", selector: "estado", sortable: true },
    { name: "Acciones", selector: "action", sortable: true },
  ];
  const room = [
    {
      id: 1,
      insumos: "Esmaltes",
      image:
        "https://i.pinimg.com/474x/e9/38/36/e93836e510ab80e701899800512fc3de.jpg",

      Cantidad: 1,
      usos: "45545",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>{" "}
          Habilitado
        </span>
      ),
      Categoria: "frutas",

      action: (
        <div className="inline">
          <button
            type="button"
            class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <UpdateOutlinedIcon className="text-base mr-1" />
          </button>
          <button
            type="button"
            class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <SwapVertIcon className="text-base mr-1" />
          </button>
        </div>
      ),
    },
    {
      id: 1,
      insumos: "Limas",
      image:
        "https://i.pinimg.com/474x/ec/c8/e3/ecc8e36917edc160f08bf13e2deb27d9.jpg",

      Cantidad: 1,
      usos: "45545",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>{" "}
          Inactivo
        </span>
      ),
      Categoria: "frutas",

      action: (
        <div className="inline">
          <button
            type="button"
            class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <UpdateOutlinedIcon className="text-base mr-1" />
          </button>
          <button
            type="button"
            class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <SwapVertIcon className="text-base mr-1" />
          </button>
        </div>
      ),
    },
    {
      id: 1,
      insumos: "Corta uñas",
      image:
        "https://i.pinimg.com/474x/84/44/fe/8444fee797bb5496ac11f292ca8d24e7.jpg",

      Cantidad: 1,
      usos: "45545",
      estado: (
        <span className="inline-flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>{" "}
          Activo
        </span>
      ),
      Categoria: "frutas",

      action: (
        <div className="inline">
          <button
            type="button"
            class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <UpdateOutlinedIcon className="text-base mr-1" />
          </button>
          <button
            type="button"
            class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <SwapVertIcon className="text-base mr-1" />
          </button>
        </div>
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
            <h4 className="text-4xl mb-4">
              {" "}
              Gestión insumos
              <KitchenOutlinedIcon className="text-base mr-3" />
            </h4>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="mt-20 mr-4 flex justify-end">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="search"
                        id="search"
                        className="block w-full p-2 pl-8 pr-10 text-sm border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

                <div className="-mt-16">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-pink-100 dark:bg-pink-700 dark:text-gray-400">
                      <tr>
                        {columns.map((column, index) => (
                          <th key={index} scope="col" className="px-6 py-3">
                            {column.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoom.map((row, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="py-4">
                            <div className="flex items-center">
                              <img
                                src={row.image}
                                className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
                                alt={row.insumos}
                              />
                              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                {row.insumos}
                              </td>
                            </div>
                          </td>
                          <td className="px-6 py-4">{row.Cantidad}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div>
                                <input
                                  type="number"
                                  id="first_product"
                                  className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder={row.Cantidad}
                                  required
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{row.Categoria}</td>
                          <td className="px-6 py-4">{row.estado}</td>
                          <td className="px-6 py-4">{row.action}</td>
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
    </div>
  );
};

export default Insumos;
