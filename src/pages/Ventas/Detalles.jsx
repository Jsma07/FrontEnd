import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const InsumoDetalle = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalleVenta = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/Buscardetalle/${id}`
        );
        setVenta(response.data[0]); // Asumimos que el primer elemento es la venta agrupada
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchDetalleVenta();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6">
      <h1 className="text-3xl font-bold mb-4">Detalle de venta</h1>
      {venta && (
        <div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Servicio
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Empleado
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Precio Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">
                    <img
                      src={venta.venta.servicio.ImgServicio}
                      alt={venta.venta.servicio.Nombre_Servicio}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                      }}
                    />
                    {venta.venta.servicio.Nombre_Servicio}
                  </td>
                  <td className="px-6 py-4">
                    {venta.venta.cliente.Nombre} {venta.venta.cliente.Apellido}
                  </td>
                  <td className="px-6 py-4">
                    {venta.venta.empleado.Nombre}{" "}
                    {venta.venta.empleado.Apellido}
                  </td>
                  <td className="px-6 py-4">${venta.venta.Total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Resumen de la venta
            </h2>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-16.5 3.75h9m10.5-3.75h3m-12-5.25h3m18 12V10m0 0l-3-3m3 3l3 3"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        Fecha:
                      </p>
                      <p className="text-sm text-gray-600">
                        {venta.venta.Fecha}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        Subtotal:
                      </p>
                      <p className="text-sm text-gray-600">
                        {venta.venta.Subtotal !== undefined
                          ? venta.venta.Subtotal.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-16.5 3.75h9m10.5-3.75h3m-12-5.25h3m18 12V10m0 0l-3-3m3 3l3 3"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        IVA:
                      </p>
                      <p className="text-sm text-gray-600">
                        {venta.venta.Iva !== undefined
                          ? venta.venta.Iva.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-16.5 3.75h9m10.5-3.75h3m-12-5.25h3m18 12V10m0 0l-3-3m3 3l3 3"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        Descuento:
                      </p>
                      <p className="text-sm text-gray-600">
                        {venta.venta.Descuento !== undefined
                          ? venta.venta.Descuento.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-16.5 3.75h9m10.5-3.75h3m-12-5.25h3m18 12V10m0 0l-3-3m3 3l3 3"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        Total:
                      </p>
                      <p className="text-sm text-gray-600">
                        {venta.venta.Total !== undefined
                          ? venta.venta.Total.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {venta.insumos.map((insumo, index) => (
              <div
                key={index}
                className="max-w-xs bg-white border-2 border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="overflow-hidden rounded-full mx-auto mt-4 w-24 h-24">
                  <img
                    className="object-cover w-full h-full"
                    src={insumo.Imagen}
                    alt={insumo.NombreInsumos}
                  />
                </div>
                <div className="p-4 text-center">
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {insumo.NombreInsumos}
                  </h5>
                  <p className="text-gray-700 dark:text-gray-400">
                    Precio unitario: ${insumo.PrecioUnitario.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsumoDetalle;
