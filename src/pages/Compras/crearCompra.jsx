import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import * as Swal from 'sweetalert2';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ModalInsumos from "../../components/consts/Modalventas";
import Fab from '@mui/material/Fab';

const CrearCompra = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate(); 
  const [compras, setCompras] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fecha_compra, setFechaCompra] = useState('');
  const [descuento_compra, setDescuentoCompra] = useState('');
  const [iva_compra, setIvaCompra] = useState('');
  const [subtotal_compra, setSubtotalCompra] = useState('');
  const [estado_compra, setEstadoCompra] = useState('');
  const [modalData, setModalData] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const abrirModal = () => {
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
  };
  const [isFieldDisabled, setIsFieldDisabled] = useState({
    fecha_compra: false,
    descuento_compra: false,
    iva_compra: false,
    subtotal_compra: false,
    estado_compra: false,
  });

const [detallesCompra, setDetallesCompra] = useState([]);
const [IdCategoria, setCategoriaInsumo] = useState('');
const [IdInsumo, setInsumosDetalle] = useState('');
const [cantidad_insumo, setCantidadInsumo] = useState('');
const [precio_unitario, setPrecioUnitarioInsumo] = useState('');
const [totalValorInsumos, settotalValorInsumos] = useState('');

  useEffect(() => {
    fetchCompras();
    fetchInsumos();
    fetchCategorias();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/compras');
      setCompras(response.data);
    } catch (error) {
      console.error('Error fetching Compras:', error);
    }
  };
  const fetchInsumos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Error fetching Insumos:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching Categorias:', error);
    }
  };

  const handleAgregarDetalleCompra = () => {
    const cantidad = parseInt(cantidad_insumo);
    const precio = parseFloat(precio_unitario);
    const total = parseFloat(totalValorInsumos);
    const idInsumos = parseInt(IdInsumo);
    const idCategoria = parseInt(IdCategoria);

    const insumoSeleccionado = insumos.find(insu => insu.IdInsumos === idInsumos);
    const categoriaSeleccionada = categorias.find(cat => cat.IdCategoria === idCategoria);

    if (!idCategoria || !precio || !cantidad || !total || !idInsumos) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
    }

    const nuevoDetalleCompra = {
        IdCategoria: idCategoria, 
        cantidad_insumo: cantidad,
        precio_unitario: precio,
        totalValorInsumos: total
    };

    setDetallesCompra([...detallesCompra, nuevoDetalleCompra]);

    setInsumosDetalle('');
    setCategoriaInsumo('');
    setCantidadInsumo('');
    setPrecioUnitarioInsumo('');
    settotalValorInsumos('');

    console.log(nuevoDetalleCompra);
};

  const handleAddCompra = async () => {
    const formData = {
      fecha_compra,
      descuento_compra,
      iva_compra,
      subtotal_compra,
      estado_compra,
      detallesCompra: detallesCompra,
    };

    try {
      const confirmation = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres agregar esta compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar',
      });

      if (confirmation.isConfirmed) {
        await axios.post('http://localhost:5000/api/compras/guardarCompra', formData);
        fetchCompras();
        Swal.fire('¡Compra agregada!', '', 'success');
      }
    } catch (error) {
      console.error('Error al agregar la compra:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
   <section className="content">
  <div
    style={{
      paddingTop: "20px", // Ajuste el padding superior para dar espacio al título
      margin: "0 auto",
      borderRadius: "30px",
      marginTop: "150px",
      boxShadow: "0 4px 12px rgba(128, 0, 128, 0.25)",
      position: "fixed",
      top: "80px",
      left: "100px",
      width: "calc(38% - 100px)",
      padding: "20px",
    }}
  >
    <center>
      <h2 style={{ marginTop: '15px', fontSize: '24px', fontWeight: 'bold' }}>Registrar Compra</h2>
    </center>
    <br />
    <div className="col-md-12">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group mb-2">
            <label htmlFor="fecha_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Fecha:</label>
            <input
              type="date"
              id="fecha_compra"
              value={fecha_compra}
              onChange={(e) => setFechaCompra(e.target.value)}
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="descuento_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Descuento:</label>
            <input
              type="number"
              id="descuento_compra"
              value={descuento_compra}
              onChange={(e) => setDescuentoCompra(e.target.value)}
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              placeholder="Descuento"
            />
          </div>
        </div>

        <div className="form-group mb-2">
          <label htmlFor="iva_compra" className="block text-sm font-medium text-gray-900 dark:text-white">IVA:</label>
          <input
            type="number"
            id="iva_compra"
            value={iva_compra}
            onChange={(e) => setIvaCompra(e.target.value)}
            className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
            placeholder="IVA"
          />
        </div>

        <div className="form-group mb-2">
          <label htmlFor="estado_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Estado:</label>
          <select
            id="estado_compra"
            value={estado_compra}
            onChange={(e) => setEstadoCompra(e.target.value)}
            className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
          >
            <option value="">Seleccione el estado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Terminada">Terminada</option>
          </select>
        </div>
        <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2 flex justify-center gap-4">
          <button
            type="button"
            className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center"
            // onClick={abrirModal}
          >
            <GroupAddIcon />{" "}
          </button>
          <button
            type="button"
            className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center"
            // onClick={abrirModal}
          >
            <AddShoppingCartIcon />{" "}
          </button>
        </div>
      </div>
    </div>
  </div>

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
          width: "calc(65% - 100px)",
          padding: "20px", 
        }}
      >
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h3
            style={{ textAlign: "left", fontSize: "23px", fontWeight: "bold" }}
          >
            Detalle de Compra{" "}
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          <div>Imagen</div>
          <div>Categoria</div>
          <div>Insumo</div>
          <div>Proveedor</div>
          <div>Cantidad</div>
          <div>Precio Unitario</div>
        </div>

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
            <div></div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              Descuento aplicado:
            </div>
            <div></div>
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

      <Fab
        aria-label="add"
        style={{
          border: '0.5px solid grey',
          backgroundColor: '#94CEF2',
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 1000, 
        }}
        onClick={() => handleAddCompra(true)}
      >
        <i className='bx bx-save' style={{ fontSize: '1.3rem' }}></i>
      </Fab>
      </div>
      <ModalInsumos
        open={modalAbierto}
        handleClose={cerrarModal}
        title="Agregar adiciones"
        // onSubmit={handleSubmit}
        seleccionado={modalData}
        insumos={insumos}
        // insumosSeleccionados={insumosSeleccionados}
        // setInsumosSeleccionados={setInsumosSeleccionados}
      />

</section>
</div>
    );
}

export default CrearCompra;
