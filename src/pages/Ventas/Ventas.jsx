import React from "react";

const Ventas = () => {
  const columns = [
    { name: "img", selector: "image", sortable: true },
    { name: "Cantidad", selector: "Cantidad", sortable: true },
    { name: "Empelado", selector: "qty", sortable: true },
    { name: "Cliente", selector: "price", sortable: true },
    { name: "Fecha", selector: "action", sortable: true },
    { name: "Estado", selector: "date", sortable: true },
    { name: "Acciones", selector: "action", sortable: true },
  ];
  const room = [
    {
      image:
        "https://i.pinimg.com/474x/01/cf/a5/01cfa537f145c625692adf907f0cb1df.jpg",
      product: "Apple Watch",
      qty: 1,
      price: "Johan steven martinez",
      action: (
        <a
          href="#"
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          Eduardo mosquera
        </a>
      ),
      date: "2024-04-25",
    },

    {
      image:
        "https://i.pinimg.com/474x/88/7f/f0/887ff0731b2b0b0e269f686fbf8ca9b8.jpg",
      product: "Apple Watch",
      qty: 1,
      price: "Emerson vargas",
      action: (
        <a
          href="#"
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          Yurani hecheverry
        </a>
      ),
      date: "2024-04-25",
    },

    {
      image:
        "https://i.pinimg.com/474x/4e/21/3e/4e213eb2b2c02d60e7021870cdae9e20.jpg",
      product: "Apple Watch",
      qty: 1,
      price: "Lorena castañeda",
      action: (
        <a
          href="#"
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          Linda estrella muñoz f
        </a>
      ),
      date: "2024-04-25",
    },

    {
      image:
        "https://i.pinimg.com/474x/7c/53/71/7c5371c2b540b985fe5106297f845053.jpg",
      product: "Apple Watch",
      qty: 1,
      price: "Cristiano rolado ",
      action: (
        <a
          href="#"
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          james rodrigues
        </a>
      ),
      date: "2024-04-25",
    },
    {
      image:
        "https://i.pinimg.com/474x/32/b9/7a/32b97ae226b0f0fd90d11a070699c646.jpg",
      product: "Apple Watch",
      qty: 1,
      price: "Lana sofia ",
      action: (
        <a
          href="#"
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          Eladio carriol
        </a>
      ),
      date: "2024-04-25",
    },
    {
      image:
        "https://i.pinimg.com/474x/1c/81/35/1c8135133cd81667bfc2a70c6618cc17.jpg",
      product: "Apple Watch",
      qty: 1,
      price: "Weidy loreyi",
      action: (
        <a
          href="#"
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          Salomon torres
        </a>
      ),
      date: "2024-04-25",
    },

    {
      image:
        "https://i.pinimg.com/474x/92/83/37/928337bbed13af5910179935bd80a936.jpg",
      product: "Apple Watch",
      qty: 1,
      price: "jude belimgan",
      action: (
        <a
          href="#"
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          vini junior
        </a>
      ),
      date: "2024-04-25",
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
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                placeholder={row.qty}
                                required
                              />
                            </div>
                            <button
                              class="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                              type="button"
                            >
                              <span class="sr-only">Quantity button</span>
                              <svg
                                class="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 1v16M1 9h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {row.price}
                        </td>
                        <td class="px-6 py-4">{row.action}</td>
                        <td class="px-6 py-4">{row.date}</td>
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
