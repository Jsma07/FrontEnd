import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalInsumos from "../../components/consts/Modalventas";
import Swal from "sweetalert2";
import ServicioSeleccionado from "../../components/consts/SeleccionServicios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Fab from "@mui/material/Fab";
import { Select, MenuItem } from "@mui/material";

const Registrar = () => {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [modalData, setModalData] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [ivaValue, setIvaValue] = useState(0);
  const [cantidadInsumos, setCantidadInsumos] = useState({});
  const [iva, setIva] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const abrirModal = () => {
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Empleados"
        );
        setEmpleados(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de empleados:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/servicios");
      setServicios(response.data);
    } catch (error) {
      console.error("Error fetching servicios:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Clientes"
        );
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de clientes:", error);
      }
    };

    fetchData();
  }, []);

  const handleImagenSeleccionada = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      setImagenSeleccionada(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const idServicio = parseInt(event.target.Servicios.value);
    const idEmpleado = parseInt(event.target.Empleado.value);
    const idCliente = parseInt(event.target.Cliente.value);
    const iva = parseFloat(event.target.iva.value);
    const fecha = event.target.fecha.value;
    const descuento = event.target.Descuento.value;

    let subtotal = 0;
    // Verifica si insumosSeleccionados está definido antes de usarlo
    if (insumosSeleccionados) {
      insumosSeleccionados.forEach((insumo) => {
        subtotal +=
          insumo.PrecioUnitario * (cantidadInsumos[insumo.IdInsumos] || 0);
      });
    }

    const total = subtotal + (subtotal * iva) / 100;

    const ventaData = {
      idServicio: idServicio,
      idEmpleado: idEmpleado,
      IdCliente: idCliente,
      Iva: iva,
      Subtotal: subtotal.toFixed(2),
      Fecha: fecha,
      Descuento: descuento,
      Total: total.toFixed(2),
      Estado: 1,
    };

    console.log("Datos de la venta:", ventaData);

    try {
      const ventaResponse = await axios.post(
        "http://localhost:5000/Jackenail/RegistrarVenta",
        ventaData
      );

      console.log("Venta registrada con éxito:", ventaResponse.data);

      if (insumosSeleccionados) {
        const detallesVenta = {
          detalles: insumosSeleccionados.map((insumo) => ({
            Idventa: ventaResponse.data.idVentas,
            Idinsumo: insumo.IdInsumos,
            Usos: parseInt(cantidadInsumos[insumo.IdInsumos] || 0),
            Precio_unitario: insumo.PrecioUnitario,
          })),
        };

        try {
          const detallesResponse = await axios.post(
            "http://localhost:5000/Jackenail/Detalleregistrar",
            detallesVenta
          );

          console.log(
            "Detalles de venta registrados con éxito:",
            detallesResponse.data
          );
        } catch (error) {
          console.error("Error al registrar los detalles de venta:", error);
        }
      }

      // Obtener el ID de la venta guardada
      const ventaId = ventaResponse.data.idVentas;

      // Utilizado para calcular las existencias disponibles y cantidades de los insumos después de realizar las ventas y el detalle
      const updatedInsumos = insumosSeleccionados.map((insumo) => {
        const cantidadVendida = cantidadInsumos[insumo.IdInsumos] || 0;
        const usoUnitario = insumo.usos_unitarios;
        let nuevosUsosDisponibles = insumo.UsosDisponibles;
        let nuevaCantidadDisponible = insumo.Cantidad;

        console.log("Insumo:", insumo.NombreInsumos);
        console.log("Cantidad vendida:", cantidadVendida);
        console.log("Usos unitarios:", usoUnitario);
        console.log("Usos disponibles antes:", nuevosUsosDisponibles);
        console.log("Cantidad disponible antes:", nuevaCantidadDisponible);

        if (cantidadVendida > 0) {
          const usosCompletos = Math.floor(cantidadVendida / usoUnitario);
          const resto = cantidadVendida % usoUnitario;

          nuevosUsosDisponibles -= usosCompletos * usoUnitario;
          nuevaCantidadDisponible -= usosCompletos;

          if (resto > 0) {
            nuevosUsosDisponibles -= resto;
          }

          console.log(
            "Usos completos utilizados:",
            usosCompletos * usoUnitario
          );
          console.log("Resto utilizado:", resto);
          console.log("Nuevos usos disponibles:", nuevosUsosDisponibles);
          console.log("Nueva cantidad disponible:", nuevaCantidadDisponible);
        }

        return {
          idInsumo: insumo.IdInsumos,
          usosDisponibles: nuevosUsosDisponibles,
          cantidad: nuevaCantidadDisponible,
        };
      });

      await Promise.all(
        updatedInsumos.map(async (insumo) => {
          await axios.put(
            `http://localhost:5000/api/existenciainsumos/editar/${insumo.idInsumo}`,
            {
              UsosDisponibles: insumo.usosDisponibles,
              Cantidad: insumo.cantidad,
            }
          );
        })
      );

      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Venta registrada con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "http://localhost:3000/ventas";
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    }
  };

  //solicutd para traer todos los insumos y ponerlos en un modal para utilizarlo en el detalle de las ventas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/insumos");
        console.log(response.data);
        setInsumos(response.data);
      } catch (error) {
        console.error("Error al obtener los insumos:", error);
      }
    };

    fetchData();
  }, []);

  const handleAdd = (id) => {
    const insumoSeleccionado = insumos.find(
      (insumo) => insumo.IdInsumos === id
    );
    setInsumosSeleccionados([...insumosSeleccionados, insumoSeleccionado]);
  };

  useEffect(() => {
    let total = 0;

    insumosSeleccionados.forEach((insumo) => {
      const cantidadVendida = cantidadInsumos[insumo.IdInsumos] || 0;
      const usoUnitario = insumo.usos_unitarios;
      let subtotal = 0;

      if (cantidadVendida > 0) {
        const usosCompletos = Math.floor(cantidadVendida / usoUnitario);
        const resto = cantidadVendida % usoUnitario;

        subtotal = insumo.PrecioUnitario * usosCompletos;

        if (resto > 0) {
          subtotal += insumo.PrecioUnitario;
        }
      }
      const ivaCalculado = subtotal * 0.19;
      total += subtotal + ivaCalculado;
    });
    const descuentoAplicado = total * (descuento / 100);
    const totalConDescuento = total - descuentoAplicado;

    setTotalGeneral(totalConDescuento);
    setIva(total * (0.19 / 100));
  }, [cantidadInsumos, insumosSeleccionados, descuento]);

  const handleCantidadChange = (e, idInsumo) => {
    const { value } = e.target;
    let cantidad = parseInt(value);

    // Validar que la cantidad no sea negativa
    if (cantidad < 0 || isNaN(cantidad)) {
      cantidad = 0; // Establecer la cantidad a cero si es negativa o no es un número
      // Mostrar alerta de SweetAlert
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "La cantidad no puede ser negativa",
        position: "center",
      });
    }

    // Validar que la cantidad no sea mayor que los usos disponibles
    const usosDisponibles = insumosSeleccionados.find(
      (insumo) => insumo.IdInsumos === idInsumo
    ).UsosDisponibles;

    if (cantidad > usosDisponibles) {
      // Mostrar alerta de SweetAlert con usos disponibles
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: `La cantidad no puede ser mayor que los usos disponibles. Usos disponibles: ${usosDisponibles}`,
        position: "center",
      });

      // Establecer la cantidad en los usos disponibles
      setCantidadInsumos({
        ...cantidadInsumos,
        [idInsumo]: usosDisponibles,
      });
    } else {
      // Si la cantidad es válida, actualizar el estado cantidadInsumos
      setCantidadInsumos({ ...cantidadInsumos, [idInsumo]: cantidad });
    }
  };

  const [fechaFactura, setFechaFactura] = useState("");

  useEffect(() => {
    const obtenerFechaActual = () => {
      const fecha = new Date();
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const fechaFormateada = fecha.toLocaleDateString("es-ES", options);
      setFechaFactura(fechaFormateada);
    };

    obtenerFechaActual();

    // Actualizar la fecha cada segundo (opcional)
    const intervalo = setInterval(() => {
      obtenerFechaActual();
    }, 1000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="content">
      <div
        style={{
          paddingTop: "40px", // Ajuste el padding superior para dar espacio al título
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.25)",
          position: "fixed",
          top: "80px",
          left: "100px",
          width: "calc(38% - 100px)",
          padding: "20px",
        }}
      >
        <h1 className="text-2xl font-bold mb-6">Gestión de Ventas</h1>
        <form
          action=""
          name="formulario"
          id="formulario"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="form-group mb-4">
            <label
              htmlFor="Servicios"
              className="block text-sm font-medium text-gray-700"
            >
              Servicios
            </label>
            <div className="relative">
              <input type="hidden" name="idventa" id="idventa" />
              <select
                name="Servicios"
                id="Servicios"
                className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.IdServicio} value={servicio.IdServicio}>
                    {servicio.Nombre_Servicio}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="Empleado">Empleado</label>
            <select
              name="Empleado"
              id="Empleado"
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un Empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.IdEmpleado} value={empleado.IdEmpleado}>
                  {empleado.Nombre} {empleado.Apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="Cliente">Cliente</label>
            <select
              name="Cliente"
              id="Cliente"
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un Cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.IdCliente} value={cliente.IdCliente}>
                  {cliente.Nombre} {cliente.Apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="iva"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              IVA
            </label>
            <input
              type="number"
              name="iva"
              id="iva"
              value={iva.toFixed(2)}
              onChange={(e) => setIva(parseFloat(e.target.value))}
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              placeholder="IVA"
            />
          </div>

          <div className="form-group grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="Descuento"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Descuento
              </label>
              <input
                type="number"
                id="Descuento"
                className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                placeholder="Descuento"
                name="Descuento"
                value={descuento}
                onChange={(e) => setDescuento(parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          <Fab
            aria-label="add"
            style={{
              border: "0.5px solid grey",
              backgroundColor: "#94CEF2",
              position: "fixed",
              bottom: "16px",
              right: "16px",
              zIndex: 1000,
              cursor: "pointer",
            }}
            type="submit"
          >
            <i className="bx bxs-save" style={{ fontSize: "1.8rem" }}></i>
          </Fab>
        </form>
      </div>

      <div
        style={{
          paddingTop: "10px",
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.3)",
          position: "fixed",
          right: "20px", // Alineado a la derecha
          top: "80px",
          width: "calc(65% - 100px)",
          padding: "20px", // Agregado espacio interior para separar los elementos
        }}
      >
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h3
            style={{ textAlign: "left", fontSize: "23px", fontWeight: "bold" }}
          >
            Factura de venta{" "}
          </h3>
        </div>

        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <p>Fecha: {fechaFactura}</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          <div>Nombre</div>
          <div>Precio Unitario</div>
          <div>Cantidad</div>
          <div>Cantidad</div>
        </div>

        {insumosSeleccionados.map((insumo) => (
          <div key={insumo.IdInsumos} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{insumo.NombreInsumos}</div>
              <div>{insumo.PrecioUnitario}</div>
              <div>{insumo.Cantidad}</div>
              <div>
                <input
                  type="number"
                  value={cantidadInsumos[insumo.IdInsumos] || ""}
                  onChange={(e) => handleCantidadChange(e, insumo.IdInsumos)}
                />
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: "40px",
            borderTop: "1px solid #ccc",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              TOTAL:
            </div>
            <div>{totalGeneral.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              Descuento aplicado:
            </div>
            <div>{descuento.toFixed(2)}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2">
            <button
              type="button"
              className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={abrirModal}
              style={{
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingCartIcon />{" "}
            </button>
          </div>
        </div>
      </div>

      <ModalInsumos
        open={modalAbierto}
        handleClose={cerrarModal}
        title="Agregar adiciones"
        onSubmit={handleSubmit}
        seleccionado={modalData}
        insumos={insumos}
        insumosSeleccionados={insumosSeleccionados}
        setInsumosSeleccionados={setInsumosSeleccionados}
      />
    </section>
  );
};
export default Registrar;
