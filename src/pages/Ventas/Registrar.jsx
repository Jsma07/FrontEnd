import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalInsumos from "../../components/consts/Modalventas";
import Swal from "sweetalert2";

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

    // Recalcula los valores de subtotal, iva y total
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
      Estado: 2,
    };

    console.log(ventaData);

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

      // Enviar una solicitud para actualizar las existencias según los datos del detalle y el cálculo utilizando el método put
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
          subtotal += insumo.PrecioUnitario; // Sumar el precio unitario por el resto
        }
      }

      const ivaCalculado = subtotal * (0.19 / 100);
      total += subtotal + ivaCalculado;
    });

    const descuentoAplicado = total * (descuento / 100);
    const totalConDescuento = total - descuentoAplicado;

    setTotalGeneral(totalConDescuento); // Actualizar el total general considerando el descuento
    setIva(total * (0.19 / 100)); // Actualizar el estado del IVA
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
      // Mostrar alerta de SweetAlert
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "La cantidad no puede ser mayor que los usos disponibles",
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

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="flex justify-center">
          <div className="w-full sm:w-11/12 md:w-9/12 lg:w-10/12 xl:w-9/12">
            <div className="box border-3 shadow p-4 mt-6 mb-6 overflow-hidden">
              <div className="box-header with-border pt-6">
                <h1 className="box-title text-center text-3xl mb-6">
                  Crear Ventas
                  <button className="btn bg-black text-white ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="transform msFilter"
                    >
                      <path
                        d="M19 2H5C3.346 2 2 3.346 2 5v2.831c0 1.053.382 2.01 1 2.746V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-5h4v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-9.424c.618-.735 1-1.692 1-2.746V5c0-1.654-1.346-3-3-3zm1 3v2.831c0 1.14-.849 2.112-1.891 2.167L18 10c-1.103 0-2-.897-2-2V4h3c.552 0 1 .449 1 1zM10 8V4h4v4c0 1.103-.897 2-2 2s-2-.897-2-2zM4 5c0-.551.448-1 1-1h3v4c0 1.103-.897 2-2 2l-.109-.003C4.849 9.943 4 8.971 4 7.831V5zm6 11H6v-3h4v3z"
                        fill="rgba(255, 255, 255, 1)"
                      />
                    </svg>
                  </button>
                </h1>
              </div>

              <div className="panel-body" style={{ marginBottom: "30px" }}>
                <form
                  action=""
                  name="formulario"
                  id="formulario"
                  method="POST"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group">
                    <label htmlFor="Servicios">Servicios</label>
                    <input
                      className="form-control"
                      type="hidden"
                      name="idventa"
                      id="idventa"
                    />
                    <select
                      name="Servicios"
                      id="Servicios"
                      className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:border-gray-200 dark:text-gray-400 dark:border-gray-700"
                      data-live-search="true"
                      required
                    >
                      <option value="">Seleccione un servicio</option>
                      {servicios.map((servicio) => (
                        <option
                          key={servicio.IdServicio}
                          value={servicio.IdServicio}
                        >
                          {servicio.Nombre_Servicio}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="Empleado">Empleado</label>
                    <select
                      name="Empleado"
                      id="Empleado"
                      className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:border-gray-200 dark:text-gray-400 dark:border-gray-700"
                      required
                    >
                      <option value="">Seleccione un Empleado</option>
                      {empleados.map((empleado) => (
                        <option
                          key={empleado.IdEmpleado}
                          value={empleado.IdEmpleado}
                        >
                          {empleado.Nombre} {empleado.Apellido}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="Cliente">Cliente</label>
                    <select
                      name="Cliente"
                      id="Cliente"
                      className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:border-gray-200 dark:text-gray-400 dark:border-gray-700"
                      required
                    >
                      <option value="">Seleccione un Cliente</option>
                      {clientes.map((cliente) => (
                        <option
                          key={cliente.IdCliente}
                          value={cliente.IdCliente}
                        >
                          {cliente.Nombre} {cliente.Apellido}
                        </option>
                      ))}
                    </select>{" "}
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="first_name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Iva
                    </label>
                    <input
                      type="number"
                      name="iva"
                      id="iva"
                      value={iva.toFixed(2)}
                      onChange={(e) => setIva(parseFloat(e.target.value))}
                      placeholder="IVA"
                    />
                  </div>

                  <div className="form-group grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fecha">Fecha</label>
                      <input
                        type="date" // Usamos el tipo de entrada de fecha
                        id="fecha"
                        name="fecha"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:border-gray-200 dark:text-gray-400 dark:border-gray-700"
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Descuento"
                        name="Descuento"
                        value={descuento}
                        onChange={(e) =>
                          setDescuento(parseFloat(e.target.value))
                        }
                        required
                      />
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

                  <div className="flex justify-center">
                    <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2">
                      <button
                        type="button"
                        className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        onClick={abrirModal}
                      >
                        <i className="fa-solid fa-cart-shopping"></i>insumos
                      </button>
                    </div>

                    <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2">
                      <button
                        type="submit"
                        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </form>

                <div
                  className="panel-body"
                  style={{ marginBottom: "30px", overflowX: "auto" }}
                >
                  <div className="form-group col-lg-12 col-md-12 col-xs-12">
                    <table
                      id="detalles"
                      className="table table-striped table-bordered table-condensed table-hover"
                      style={{ marginTop: "1.5rem", width: "100%" }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#000000",
                          color: "#FFFFFF",
                        }}
                      >
                        <tr>
                          <th>Opciones</th>
                          <th>Insumo</th>
                          <th>Precio unitario</th>
                          <th>usos disponibles </th>
                          <th>Unidades</th>
                          <th>Categorías</th>
                          <th>Subtotal</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insumosSeleccionados.map((insumo) => {
                          return (
                            <tr key={insumo.IdInsumos}>
                              <td>Opciones</td>
                              <td>{insumo.NombreInsumos}</td>
                              <td>{insumo.PrecioUnitario}</td>
                              <td>{insumo.UsosDisponibles}</td>
                              <td>{insumo.Cantidad}</td>
                              <td>{insumo.nombre_categoria}</td>
                              <td>{subtotal.toFixed(2)}</td>
                              <td>
                                <input
                                  type="number"
                                  value={
                                    cantidadInsumos[insumo.IdInsumos] || ""
                                  }
                                  onChange={(e) =>
                                    handleCantidadChange(e, insumo.IdInsumos)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                        <tfoot>
                          <tr>
                            <th colSpan="4" style={{ paddingRight: "20px" }}>
                              TOTAL
                            </th>
                            <th colSpan="2">{totalGeneral.toFixed(2)}</th>
                          </tr>
                          <tr>
                            <th colSpan="4" style={{ paddingRight: "20px" }}>
                              Descuento aplicado
                            </th>
                            <th colSpan="2">{descuento.toFixed(2)}</th>
                          </tr>
                        </tfoot>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Registrar;
