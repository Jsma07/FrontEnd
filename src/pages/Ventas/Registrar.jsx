import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalInsumos from "../../components/consts/Modalventas";
import Swal from "sweetalert2";
import  ServicioSeleccionado from '../../components/consts/SeleccionServicios'

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

  const [fechaFactura, setFechaFactura] = useState('');

  useEffect(() => {
    const obtenerFechaActual = () => {
      const fecha = new Date();
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
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
        <ServicioSeleccionado/>

        
        <div 
          style={{
            paddingTop: "10px",
            margin: "0 auto",
            borderRadius: "30px",
            marginTop: "20px",
            boxShadow: "0 4px 12px rgba(128, 0, 128, 0.1)",
            position: "fixed",
            right: "20px",  // Alineado a la derecha
            top: "80px",
            width: "calc(65% - 100px)",
            padding: "20px",  // Agregado espacio interior para separar los elementos
          }}
        >

          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h3 style={{ textAlign: "left", fontSize: "23px", fontWeight: "bold" }}>Factura Electronica </h3>
          </div>

          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <p>Fecha: {fechaFactura}</p>
          </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            <div>Nombre</div>
            <div>Precio Unitario</div>
            <div>Cantidad</div>
            <div>Subtotal</div>
            <div>Cantidad</div> 
          </div>

          {insumosSeleccionados.map((insumo) => (
            <div key={insumo.IdInsumos} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>{insumo.NombreInsumos}</div>
                <div>{insumo.PrecioUnitario}</div>
                <div>{insumo.Cantidad}</div>
                <div>{subtotal.toFixed(2)}</div>
                <div>
                  <input
                    type="number"
                    value={cantidadInsumos[insumo.IdInsumos] || ""}
                    onChange={(e) =>
                      handleCantidadChange(e, insumo.IdInsumos)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>TOTAL:</div>
              <div>{totalGeneral.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>Descuento aplicado:</div>
              <div>{descuento.toFixed(2)}</div>
          </div>
        </div>

      </div>

      </section>
  ); 
};
export default Registrar;
