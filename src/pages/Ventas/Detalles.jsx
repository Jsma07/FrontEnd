import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
import "jspdf-autotable";

const InsumoDetalle = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para formatear el precio en pesos colombianos sin decimales
  const formatCurrency = (amount) => {
    const roundedAmount = Math.round(amount);
    return roundedAmount.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const response = await axios.get(
          `https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev/Buscardetalle/${id}`
        );
        const ventaData = response.data;

        if (Array.isArray(ventaData)) {
          const venta = ventaData[0];
          setVenta({
            venta: venta.venta,
            adiciones: Array.isArray(venta.adiciones) ? venta.adiciones : [],
          });
        } else {
          setVenta({
            venta: ventaData.venta,
            adiciones: Array.isArray(ventaData.adiciones)
              ? ventaData.adiciones
              : [],
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles de la venta:", error);
        setError("Ocurrió un error al obtener los detalles de la venta.");
        setLoading(false);
      }
    };

    fetchVenta();
  }, [id]);

  const generarPDF = () => {
    if (!venta) return;

    const doc = new jsPDF();
    const logoImg = "/jacke.png";

    doc.addImage(logoImg, "JPEG", 20, 10, 30, 30);
    doc.setFontSize(16);
    doc.text("Jacke Nail", 60, 25);

    doc.line(20, 45, 190, 45);

    const fecha = new Date().toLocaleDateString("es-CO");
    const hora = new Date().toLocaleTimeString("es-CO");
    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 140, 20);
    doc.text(`Hora: ${hora}`, 140, 30);

    doc.setFontSize(12);
    doc.text("Datos del Empleado:", 20, 55);
    doc.text(
      `Nombre: ${venta.venta.empleado.Nombre} ${venta.venta.empleado.Apellido}`,
      20,
      65
    );

    doc.setFontSize(12);
    doc.text("Datos del Cliente:", 20, 75);
    doc.text(
      `Nombre: ${venta.venta.cliente.Nombre} ${venta.venta.cliente.Apellido}`,
      20,
      85
    );

    doc.setFontSize(12);
    doc.text("Servicio:", 20, 95);
    doc.text(`Nombre: ${venta.venta.servicio.Nombre_Servicio}`, 20, 105);

    let y = 115;
    const headers = ["Nombre de adicion", "Precio Unitario"];
    const data = venta.adiciones.map((Adicion) => [
      Adicion.NombreAdiciones,
      formatCurrency(Adicion.Precio),
    ]);

    doc.autoTable({
      startY: y,
      head: [headers],
      body: data,
      theme: "plain",
    });

    doc.save(`factura_${venta.idVenta}.pdf`);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6">
      {venta && (
        <div
          style={{
            paddingTop: "40px",
            margin: "0 auto",
            borderRadius: "30px",
            marginTop: "20px",
            boxShadow: "0 4px 12px rgba(128, 0, 128, 0.25)",
            position: "fixed",
            top: "80px",
            left: "100px",
            width: "calc(63% - 100px)",
            padding: "20px",
          }}
        >
          <h1 className="text-2xl font-bold mb-6">Detalle de ventas</h1>

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
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <img
                      src={`https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev${venta.venta.servicio.ImgServicio}`}
                      alt={venta.venta.servicio.Nombre_Servicio}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span>{venta.venta.servicio.Nombre_Servicio}</span>
                  </td>
                  <td className="px-6 py-4">
                    {venta.venta.cliente.Nombre} {venta.venta.cliente.Apellido}
                  </td>
                  <td className="px-6 py-4">
                    {venta.venta.empleado.Nombre} {venta.venta.empleado.Apellido}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {formatCurrency(venta.venta.Total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {venta.adiciones && venta.adiciones.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {venta.adiciones.map((adicion, index) => (
                <div
                  key={index}
                  className="max-w-xs bg-white border-2 border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="overflow-hidden rounded-full mx-auto mt-4 w-24 h-24">
                    <img
                      className="object-cover w-full h-full"
                      src={`https://47f025a5-3539-4402-babd-ba031526efb2-00-xwv8yewbkh7t.kirk.replit.dev${adicion.Img}`}
                      alt={adicion.NombreAdiciones}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                      {adicion.NombreAdiciones}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-400">
                      Precio unitario: {formatCurrency(adicion.Precio)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              paddingTop: "10px",
              margin: "0 auto",
              borderRadius: "30px",
              marginTop: "20px",
              boxShadow: "0 4px 12px rgba(128, 0, 128, 0.3)",
              position: "fixed",
              right: "20px",
              top: "80px",
              width: "calc(40% - 100px)",
              padding: "20px",
            }}
          >
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Resumen de la Venta
              </h2>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <i className="bx bx-calendar w-10 h-10 text-gray-500"></i>{" "}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        Fecha:
                      </p>
                      <p className="text-sm text-gray-600">
                        {venta.venta.Fecha}
                      </p>
                    </div>
                  </li>
                  <li className="py-4 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <i className="bx bx-dollar w-10 h-10 text-gray-500"></i>{" "}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        Subtotal:
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(venta.venta.Subtotal)}
                      </p>
                    </div>
                  </li>
                  <li className="py-4 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <i className="bx bx-gift w-10 h-10 text-gray-500"></i>{" "}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        Descuento:
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(venta.venta.Descuento)}
                      </p>
                    </div>
                  </li>
                  <li className="py-4 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <i className="bx bx-wallet w-10 h-10 text-gray-500"></i>{" "}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        Total:
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(venta.venta.Total)}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: "15px",
              }}
            >
              <div
                className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <a href="/ventas">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    style={{ fontSize: "25px" }}
                  >
                    <i className="bx bx-arrow-back"></i>
                  </button>
                </a>
                <button
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  style={{ fontSize: "20px", marginLeft: "10px" }}
                  onClick={generarPDF}
                >
                  <i className="bx bxs-file-pdf"> PDF</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsumoDetalle;
