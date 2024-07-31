import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import * as Swal from 'sweetalert2';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ModalAgregarInsumo from "../../components/consts/modal";
import ModalAgregarProveedor from "../../components/consts/modal";
import ModalDetalleInsumos from "../../components/consts/modalDetalleInsumos";
import CamposObligatorios from "../../components/consts/camposVacios";
import Fab from '@mui/material/Fab';

const CrearCompra = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate(); 
  const [compras, setCompras] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fecha_compra, setFechaCompra] = useState('');
  const [descuento_compra, setDescuentoCompra] = useState('');
  const [iva_compra, setIvaCompra] = useState('');
  const [subtotal_compra, setSubtotalCompra] = useState('');
  const [estado_compra, setEstadoCompra] = useState('');
  const [modalData, setModalData] = useState(null);
  const [openModalAgregarInsumo, setOpenModalAgregarInsumo] = useState(false);
  const [openModalAgregarProveedor, setOpenModalAgregarProveedor] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

  const [detallesCompra, setDetallesCompra] = useState([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [cantidad_insumo, setCantidadInsumo] = useState({});
  const [precio_unitario, setPrecioUnitario] = useState({});
  const [totalValorInsumos, settotalValorInsumos] = useState('');

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

  useEffect(() => {
    fetchCompras();
    fetchInsumos();
    fetchCategorias();
    fetchProveedores();
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

  const fetchProveedores = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/proveedores");
      console.log("proveedores fetched:", response.data); 
      setProveedores(response.data);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };

  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.IdCategoria === idCategoria);
    return categoria ? categoria.nombre_categoria : "Desconocido";
  };

  const handleCantidadChange = (idInsumo, value) => {
    setCantidadInsumo({ ...cantidad_insumo, [idInsumo]: value });
  };

  const handlePrecioChange = (idInsumo, value) => {
    setPrecioUnitario({ ...precio_unitario, [idInsumo]: value });
  };

  const handleAddInsumo = async (formData) => {
    try {
      const {
        NombreInsumos,
        IdCategoria,
        Idproveedor,
        Imagen,
      } = formData;
  
      const camposObligatorios = [
        "NombreInsumos",
        "Imagen",
        "IdCategoria",
        "Idproveedor",
      ]; 
      if (
        !CamposObligatorios(
          formData,
          camposObligatorios,
          "Por favor, complete todos los campos del proveedor."
        )
      ) {
        return;
      }
  
      if (!/^[a-zA-Z0-9\s]+$/.test(NombreInsumos)) {
        window.Swal.fire({
          icon: "error",
          title: "Nombre del insumo inválido",
          text: "El nombre del insumo no debe contener caracteres especiales.",
        });
        return;
      }
  
      const confirmation = await window.Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres agregar este insumo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      });
  
      if (confirmation.isConfirmed) {
        const formDataToSend = new FormData();
        formDataToSend.append("NombreInsumos", NombreInsumos);
        formDataToSend.append("Idproveedor", Idproveedor);
        formDataToSend.append("IdCategoria", IdCategoria);
        formDataToSend.append("Imagen", Imagen);
  
        const response = await axios.post(
          "http://localhost:5000/api/insumos/guardarInsumo",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        console.log("Respuesta del servidor:", response.data);
  
        handleCloseModalAgregar();
        fetchInsumos();
        window.Swal.fire("Insumo agregado!", "", "success");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error al agregar insumo:", error.response.data);
      } else {
        console.error("Error al agregar insumo:", error.message);
      }
    }
  };

  const handleAddProveedor = async (formData) => {
    try {
      const { NIT, correo_proveedor, telefono_proveedor, direccion_proveedor, empresa_proveedor } = formData;
      const response = await axios.get('http://localhost:5000/api/proveedores');
      const proveedores = response.data;
      const proveedorExistenteNIT = proveedores.find(proveedor => proveedor.NIT === NIT);
      const proveedorExistenteCorreo = proveedores.find(proveedor => proveedor.correo_proveedor === correo_proveedor);
      const proveedorExistenteTelefono = proveedores.find(proveedor => proveedor.telefono_proveedor === telefono_proveedor);
      const proveedorExistenteDireccion = proveedores.find(proveedor => proveedor.direccion_proveedor === direccion_proveedor);
      const proveedorExistenteEmpresa = proveedores.find(proveedor => proveedor.empresa_proveedor === empresa_proveedor);
  
      const camposObligatorios = ['NIT','nombre_proveedor', 'correo_proveedor', 'telefono_proveedor', 'direccion_proveedor', 'empresa_proveedor'];

      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del proveedor.')) {
        return;
      }

      if (proveedorExistenteNIT) {
        window.Swal.fire({
          icon: 'warning',
          title: 'NIT ya registrado',
          text: 'El NIT de la empresa ingresado ya está registrado para otro proveedor.',
        });
        return;
      }
      
      const nit = formData['NIT'];
      if (!/^\d+$/.test(nit)) {
        window.Swal.fire({
          icon: 'error',
          title: 'NIT de la empresa inválido',
          text: 'Por favor, ingresa solo números en el campo del NIT de la empresa.',
        });
        return;
      }

      if (NIT.length < 9 || NIT.length > 10) {
        window.Swal.fire({
          icon: 'error',
          title: 'NIT de la empresa inválido',
          text: 'Por favor, asegúrate de que el NIT de la empresa tenga minimo 9 dígitos.',
        });
        return;
      }

    const nombreProveedor = formData['nombre_proveedor'];
    if (!/^[a-zA-Z\s]+$/.test(nombreProveedor)) {
      window.Swal.fire({
        icon: 'error',
        title: 'Nombre de proveedor inválido',
        text: 'El nombre de proveedor no debe contener números ni caracteres especiales.',
      });
      return;
    }

    const correoProveedor = formData['correo_proveedor'];
    if (!/\b[A-Za-z0-9._%+-]+@(gmail|hotmail)\.com\b/.test(correoProveedor)) {
      window.Swal.fire({
        icon: 'error',
        title: 'Correo electrónico inválido',
        text: 'Por favor, ingresa un correo electrónico válido que termine en @gmail.com o @hotmail.com.',
      });
      return;
    }
     
    const telefono = formData['telefono_proveedor'];
      if (!/^\d+$/.test(telefono)) {
        window.Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: 'Por favor, ingresa solo números en el campo de teléfono.',
        });
        return;
     }

      if (telefono.length !== 10) {
        window.Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: 'Por favor, asegúrate de que el número de teléfono tenga 10 dígitos.',
        });
        return;
      }

      if (proveedorExistenteCorreo) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Correo ya registrado',
          text: 'El correo electrónico ingresado ya está registrado para otro proveedor.',
        });
        return;
      }
  
      if (proveedorExistenteTelefono) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Teléfono ya registrado',
          text: 'El número de teléfono ingresado ya está registrado para otro proveedor.',
        });
        return;
      }

      if (proveedorExistenteDireccion) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Direccion ya registrada',
          text: 'La direccion ingresada ya está registrado para otro proveedor.',
        });
        return;
      }

      if (proveedorExistenteEmpresa) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Empresa ya registrada',
          text: 'La empresa ingresada ya está registrado para otro proveedor.',
        });
        return;
      }

      const confirmation = await window.Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres agregar este proveedor?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmation.isConfirmed) {
        formData.estado_proveedor = 1;
        await axios.post('http://localhost:5000/api/proveedores/guardarProveedor', formData);
        handleCloseModalAgregar();
        fetchProveedores();
        window.Swal.fire('¡Proveedor agregado!', '', 'success');
      }
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }

  };

  const sendCompra = async (formData) => {
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
        const postResponse = await axios.post('http://localhost:5000/api/compras/guardarCompra', formData);
        console.log('Respuesta del servidor:', postResponse.data);
        fetchCompras();
        Swal.fire('¡Compra agregada!', '', 'success');
      }
    } catch (error) {
      console.error('Error al agregar la compra:', error);
      alert('No se pudo agregar la compra. Verifique la conexión al servidor.');
    }
  };
  
  const handleAgregarDetalleCompra = () => {
    const nuevosDetallesCompra = insumosSeleccionados.map((insumo) => ({
      IdInsumo: insumo.IdInsumos,
      cantidad_insumo: cantidad_insumo[insumo.IdInsumos] || 0,
      precio_unitario: precio_unitario[insumo.IdInsumos] || 0,
      totalValorInsumos: (cantidad_insumo[insumo.IdInsumos] || 0) * (precio_unitario[insumo.IdInsumos] || 0),
    }));
  
    console.log("Nuevos detalles de compra:", nuevosDetallesCompra);
  
    // Actualiza el estado y luego llama a sendCompra
    setDetallesCompra(nuevosDetallesCompra);
  };
  
  // Llama a handleAddCompra después de que detallesCompra se haya actualizado
  const handleAddCompra = () => {
    handleAgregarDetalleCompra();
  };
  
  // Efecto que se ejecuta cuando detallesCompra cambia
  useEffect(() => {
    if (detallesCompra.length > 0) {
      const subtotal_compra = detallesCompra.reduce((acc, detalle) => acc + detalle.totalValorInsumos, 0);
  
      const formData = {fecha_compra, descuento_compra: parseFloat(descuento_compra), iva_compra: parseFloat(iva_compra),subtotal_compra: parseFloat(subtotal_compra),estado_compra,
        detallesCompra: detallesCompra.map(detalle => ({
          ...detalle,
          cantidad_insumo: parseFloat(detalle.cantidad_insumo),
          precio_unitario: parseFloat(detalle.precio_unitario),
          totalValorInsumos: parseFloat(detalle.totalValorInsumos),
        })),
      };
  
      console.log("Datos enviados al backend:", formData);
  
      const camposObligatorios = ['fecha_compra', 'descuento_compra', 'iva_compra', 'estado_compra'];
      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos de la compra.')) {
        return;
      }
      // Envía la compra después de actualizar el estado
      sendCompra(formData);
    }
  }, [detallesCompra]); 
  
  
  const handleChange = (name, value) => {
    setInsumoSeleccionado((prevInsumo) => ({
      ...prevInsumo,
      [name]: value,
    }));
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregarInsumo(false);
    setOpenModalAgregarProveedor(false);
    setInsumoSeleccionado(null);
  };


  return (
  <div className="max-w-4xl mx-auto p-4">
   <section className="content">
  <div
    style={{
      paddingTop: "20px", 
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
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500" required/>
          </div>

          <div className="form-group mb-2">
            <label htmlFor="descuento_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Descuento:</label>
            <input
              type="number"
              id="descuento_compra"
              value={descuento_compra}
              onChange={(e) => setDescuentoCompra(e.target.value)}
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              placeholder="Descuento" required/>
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
            placeholder="IVA" required/>
        </div>

        <div className="form-group mb-2">
          <label htmlFor="estado_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Estado:</label>
          <select
            id="estado_compra"
            value={estado_compra}
            onChange={(e) => setEstadoCompra(e.target.value)}
            className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500" required>
            <option value="">Seleccione el estado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Terminada">Terminada</option>
          </select>
        </div>
        <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2 flex justify-center gap-4">
          <button
            type="button"
            className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center"
            onClick={() => setOpenModalAgregarProveedor(true)}
          >
            <GroupAddIcon />{" "}
          </button>
          <button
            type="button"
            className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center"
            onClick={() => setOpenModalAgregarInsumo(true)}
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

      <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
        <div
          style={{
            fontWeight: "bold",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
            textAlign: "center",
          }}
        >
          <div>Imagen</div>
          <div>Categoria</div>
          <div>Insumo</div>
          <div>Cantidad</div>
          <div>P Unitario</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
            marginTop: "20px",
            overflowY: insumosSeleccionados.length > 2 ? "auto" : "visible",
            maxHeight: insumosSeleccionados.length > 2 ? "150px" : "none",
            textAlign: "center",
          }}
        >
          {insumosSeleccionados.map((insumo, index) => (
            <React.Fragment key={index}>
             <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img 
                  src={`http://localhost:5000${insumo.imagen}`} 
                  alt={insumo.NombreInsumos} 
                  width="50" 
                  style={{ borderRadius: "50%", width: "50px", height: "50px", objectFit: "cover" }}
                />
              </div>
              <div>{getNombreCategoria(insumo.Idcategoria)}</div>
              <div>{insumo.NombreInsumos}</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <input
                  type="number"
                  value={cantidad_insumo[insumo.IdInsumos] || ""}
                  onChange={(e) => handleCantidadChange(insumo.IdInsumos, e.target.value)}
                  style={{
                    width: "80px",
                    padding: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <input
                  type="number"
                  value={precio_unitario[insumo.IdInsumos] || ""}
                  onChange={(e) => handlePrecioChange(insumo.IdInsumos, e.target.value)}
                  style={{
                    width: "80px",
                    padding: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
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
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2 flex space-x-4">
            <a href="/compras">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                style={{
                  fontSize: "25px",
                }}
              >
                <i className="bx bx-arrow-back"></i>
              </button>
            </a>
            <button
              type="button"
              className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
              onClick={abrirModal}
              style={{
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
        onClick={handleAddCompra}
      >
        <i className='bx bx-save' style={{ fontSize: '1.3rem' }}></i>
      </Fab>
      </div>
      <ModalDetalleInsumos 
        open={modalAbierto} 
        handleClose={cerrarModal} 
        title="Agregar insumos" 
        onSubmit={handleAgregarDetalleCompra} 
        insumos={insumos} 
        setInsumosSeleccionados={setInsumosSeleccionados} 
        insumosSeleccionados={insumosSeleccionados} 
      />

</section>
      <ModalAgregarInsumo
        open={openModalAgregarInsumo}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleAddInsumo}
        title="Crear Nuevo Insumo"
        fields={[
          {
            name: "Idproveedor",
            label: "Proveedor",
            type: "select",
            options: proveedores
              .filter((proveedor) => proveedor.estado_proveedor === 1)
              .map((proveedor) => ({
                value: proveedor.IdProveedor,
                label: proveedor.nombre_proveedor,
              })),
          },
          {
            name: "IdCategoria",
            label: "Categoria insumo",
            type: "select",
            options: categorias
              .filter((categoria) => categoria.estado_categoria === 1)
              .map((categoria) => ({
                value: categoria.IdCategoria,
                label: categoria.nombre_categoria,
              })),
          },
          { name: "NombreInsumos", label: "Nombre insumo", type: "text" },
          { name: "Imagen", label: "Imagen", type: "file" },
        ]}
        onChange={handleChange}
      />  
      <ModalAgregarProveedor
          open={openModalAgregarProveedor}
          handleClose={handleCloseModalAgregar}
          onSubmit={(formData) => handleAddProveedor(formData)} 
          title="Crear Nuevo Proveedor"
          fields={[
            { name: 'NIT', label: 'NIT', type: 'text' },
            { name: 'empresa_proveedor', label: 'Empresa', type: 'text' },
            { name: 'nombre_proveedor', label: 'Nombre', type: 'text' },
            { name: 'correo_proveedor', label: 'Correo', type: 'text' },
            { name: 'telefono_proveedor', label: 'Teléfono', type: 'text' },
            { name: 'direccion_proveedor', label: 'Direccion', type: 'text' },
          ]}
          onChange={handleChange}
        />    
</div>
    );
}

export default CrearCompra;
