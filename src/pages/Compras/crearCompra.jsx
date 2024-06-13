import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import * as Swal from 'sweetalert2';

const CrearCompra = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate(); 
  const [compras, setCompras] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fecha_compra, setFechaCompra] = useState('');
  const [descuento_compra, setDescuentoCompra] = useState('');
  const [iva_compra, setIvaCompra] = useState('');
  const [subtotal_compra, setSubtotalCompra] = useState('');
  const [estado_compra, setEstadoCompra] = useState('');
  const [isFieldDisabled, setIsFieldDisabled] = useState({
    fecha_compra: false,
    descuento_compra: false,
    iva_compra: false,
    subtotal_compra: false,
    estado_compra: false,
  });

const [detallesCompra, setDetallesCompra] = useState([]);
const [Dimagen_insumo, setImagenInsumo] = useState('');
const [IdCategoria, setCategoriaInsumo] = useState('');
const [IdProveedor, setProveedorInsumo] = useState('');
const [Dnombre_insumo, setNombreInsumo] = useState('');
const [cantidad_insumo, setCantidadInsumo] = useState('');
const [precio_unitario, setPrecioUnitarioInsumo] = useState('');
const [totalValorInsumos, settotalValorInsumos] = useState('');

  useEffect(() => {
    fetchCompras();
    fetchProveedores();
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
  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error fetching Proveedores:', error);
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
    const idProveedor = parseInt(IdProveedor);
    const idCategoria = parseInt(IdCategoria);

    const proveedorSeleccionado = proveedores.find(prov => prov.IdProveedor === idProveedor);
    const categoriaSeleccionada = categorias.find(cat => cat.IdCategoria === idCategoria);

    if (!idProveedor || !idCategoria || !precio || !cantidad || !total) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
    }

    const nuevoDetalleCompra = {
        Dimagen_insumo,
        IdProveedor: idProveedor, 
        IdCategoria: idCategoria, 
        Dnombre_insumo,
        cantidad_insumo: cantidad,
        precio_unitario: precio,
        totalValorInsumos: total
    };

    setDetallesCompra([...detallesCompra, nuevoDetalleCompra]);

    setProveedorInsumo('');
    setImagenInsumo('');
    setCategoriaInsumo('');
    setNombreInsumo('');
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
      <center>
        <h2 style={{ marginTop: '30px', fontSize: '24px', fontWeight: 'bold' }}>Registrar Compra</h2>
      </center>
      <br />
      <div className="col-md-12">
        <div className="border border-gray-300 p-4 relative mx-auto" style={{ maxWidth: '1100px' }}>
          <label className="absolute top-0 bg-white px-2" style={{ top: '-15px' }}>Información de la compra</label>
          <div className="grid grid-cols-5 gap-4">
            <div className="mb-4">
              <label htmlFor="fecha_compra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha:</label>
                <input type="date" id="fecha_compra" value={fecha_compra} onChange={(e) => setFechaCompra(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="descuento_compra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descuento:</label>
              <input type="number" id="descuento_compra" value={descuento_compra} onChange={(e) => setDescuentoCompra(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Descuento"/>
            </div>

            <div className="mb-4">
              <label htmlFor="iva_compra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">IVA:</label>
              <input type="number" id="iva_compra" value={iva_compra} onChange={(e) => setIvaCompra(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Iva" />
            </div>

            <div className="mb-4">
              <label htmlFor="estado_compra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado:</label>
              <select id="estado_compra" value={estado_compra} onChange={(e) => setEstadoCompra(e.target.value)} className="w-full pl-2 pr-8 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Seleccione el estado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Terminada">Terminada</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="subtotal_compra" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subtotal:</label>
              <input type="number" id="subtotal_compra" value={subtotal_compra} onChange={(e) => setSubtotalCompra(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Subtotal"/>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <div className="flex">
        <div className="w-2/3 border border-gray-300 p-4 relative" style={{ marginLeft: '-80px' }}>
        <label className="absolute top-0 bg-white px-2" style={{ top: '-15px' }}>Información del insumo</label>
        <div className="flex flex-wrap -mx-4">
            <div className="w-1/2 px-2 mb-4">
                <label htmlFor="ImagenInsumo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imagen:</label>
                <input   type="text" id="Dimagen_insumo" value={Dimagen_insumo} onChange={(e) => setImagenInsumo(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Imagen" />
            </div>
            <div className="w-1/2 px-2 mb-4">
              <label htmlFor="CategoriaInsumo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria:</label>
              <select id="IdCategoria" value={IdCategoria} onChange={(e) => setCategoriaInsumo(e.target.value)} className="w-full pl-2 pr-8 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(categoria => (
                      <option key={categoria.IdCategoria} value={categoria.IdCategoria}>{categoria.nombre_categoria}</option>
                  ))}
              </select>
          </div>
        </div>
        <div className="flex flex-wrap -mx-4">
          <div className="w-1/2 px-2 mb-4">
              <label htmlFor="IdProveedor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Proveedor:</label>
              <select id="IdProveedor" value={IdProveedor} onChange={(e) => setProveedorInsumo(e.target.value)} className="w-full pl-2 pr-8 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(proveedor => (
                      <option key={proveedor.IdProveedor} value={proveedor.IdProveedor}>{proveedor.nombre_proveedor}</option>
                  ))}
              </select>
          </div>
            <div className="w-1/2 px-2 mb-4">
                <label htmlFor="NombreInsumo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre:</label>
                <input type="text" id="Dnombre_insumo" value={Dnombre_insumo} onChange={(e) => setNombreInsumo(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nombre" />
            </div>
        </div>
        <div className="flex flex-wrap -mx-4">
            <div className="w-1/2 px-2 mb-4">
                <label htmlFor="PrecioUnitarioInsumo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio unitario:</label>
                <input type="number" id="precio_unitario" value={precio_unitario} onChange={(e) => setPrecioUnitarioInsumo(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Precio unitario" />
            </div>
            <div className="w-1/2 px-2 mb-4">
                <label htmlFor="CantidadInsumo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cantidad:</label>
                <input type="number" id="cantidad_insumo" value={cantidad_insumo} onChange={(e) => setCantidadInsumo(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cantidad" />
            </div>
        </div>
        <div className="flex flex-wrap -mx-4">
            <div className="w-1/2 px-2 mb-4">
                <label htmlFor="Total" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total:</label>
                <input type="number" id="totalValorInsumos" value={totalValorInsumos} onChange={(e) => settotalValorInsumos(e.target.value)} className="w-full pl-2 pr-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Total" />
            </div>
            <div className="w-1/2 px-2 mb-4">
                
            </div>
        </div>
        <div className="flex flex-wrap -mx-4">
            <div className="w-1/2 px-2 mb-4">
                <button type="button" class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                onClick={handleAgregarDetalleCompra}>
                  <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Agregar
                  </span>
                </button>
            </div>
            <div className="w-1/2 px-2 mb-4">
              <button
                type="button"
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                onClick={handleAddCompra}
                >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Registrar
                </span>
              </button>
            </div>
        </div>
    </div>
    <div className="w-1/3 p-4">
    <div className="border border-gray-300" style={{ overflowX: 'auto', width: 'calc(100% + 90px)' }}>
        <table className="w-full text-center" style={{ fontSize: '0.8rem', borderCollapse: 'collapse' }}>
            <thead className="bg-gray-200">
                <tr>
                    <th className="px-4 py-2">Imagen</th>
                    <th className="px-4 py-2">Categoría</th>
                    <th className="px-4 py-2">Proveedor</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Precio unitario</th>
                </tr>
            </thead>
            <tbody>
                {detallesCompra.map((detalle, index) => {
                    const proveedor = proveedores.find(prov => prov.IdProveedor === detalle.IdProveedor);
                    const categoria = categorias.find(cat => cat.IdCategoria === detalle.IdCategoria);

                    return (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{detalle.Dimagen_insumo}</td>
                            <td className="border border-gray-300 px-4 py-2">{categoria ? categoria.nombre_categoria : 'N/A'}</td>
                            <td className="border border-gray-300 px-4 py-2">{proveedor ? proveedor.nombre_proveedor : 'N/A'}</td>
                            <td className="border border-gray-300 px-4 py-2">{detalle.Dnombre_insumo}</td>
                            <td className="border border-gray-300 px-4 py-2">{detalle.cantidad_insumo}</td>
                            <td className="border border-gray-300 px-4 py-2">{detalle.precio_unitario}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
</div>
</div>
</div>

    );
}

export default CrearCompra;
