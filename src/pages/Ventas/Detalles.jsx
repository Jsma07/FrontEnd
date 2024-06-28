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
    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Detalle de Venta</h1>

    {venta && (
      <div>
        {/* Información principal de la venta */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Servicio</th>
                <th scope="col" className="px-6 py-3">Cliente</th>
                <th scope="col" className="px-6 py-3">Empleado</th>
                <th scope="col" className="px-6 py-3">Precio Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 flex items-center space-x-4">
                  <img
                    src={venta.venta.servicio.ImgServicio}
                    alt={venta.venta.servicio.Nombre_Servicio}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span>{venta.venta.servicio.Nombre_Servicio}</span>
                </td>
                <td className="px-6 py-4">{venta.venta.cliente.Nombre} {venta.venta.cliente.Apellido}</td>
                <td className="px-6 py-4">{venta.venta.empleado.Nombre} {venta.venta.empleado.Apellido}</td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${venta.venta.Total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Resumen de la venta */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumen de la Venta</h2>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              <li className="py-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.75h7.5m-12 12.25h16.5m-16.5 0h16.5M3 8.25l6 5.25 6-5.25"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">Fecha:</p>
                  <p className="text-sm text-gray-600">{venta.venta.Fecha}</p>
                </div>
              </li>
              <li className="py-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h19.5m-19.5 0h19.5m-18 18h16.5m-16.5 0h16.5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">Subtotal:</p>
                  <p className="text-sm text-gray-600">${venta.venta.Subtotal !== undefined ? venta.venta.Subtotal.toFixed(2) : "0.00"}</p>
                </div>
              </li>
              <li className="py-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.75h7.5m-12 12.25h16.5m-16.5 0h16.5M3 8.25l6 5.25 6-5.25"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">IVA:</p>
                  <p className="text-sm text-gray-600">${venta.venta.Iva !== undefined ? venta.venta.Iva.toFixed(2) : "0.00"}</p>
                </div>
              </li>
              <li className="py-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.75h7.5m-12 12.25h16.5m-16.5 0h16.5M3 8.25l6 5.25 6-5.25"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">Descuento:</p>
                  <p className="text-sm text-gray-600">${venta.venta.Descuento !== undefined ? venta.venta.Descuento.toFixed(2) : "0.00"}</p>
                </div>
              </li>
              <li className="py-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.75h7.5m-12 12.25h16.5m-16.5 0h16.5M3 8.25l6 5.25 6-5.25"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">Total:</p>
                  <p className="text-sm text-gray-600">${venta.venta.Total !== undefined ? venta.venta.Total.toFixed(2) : "0.00"}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Insumos utilizados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {venta.insumos.map((insumo, index) => (
            <div
              key={index}
              className="max-w-xs bg-white border-2 border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="overflow-hidden rounded-full mx-auto mt-4 w-24 h-24">
                <img
                  className="object-cover w-full h-full"
                  src={`http://localhost:5000${insumo.imagen}`}
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
