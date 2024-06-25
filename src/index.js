import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Roles from './pages/Roles/Roles';
import Admin from './pages/Administrador/Administradores';
import Usuarios2 from './pages/Usuarios2/Usuarios2';
import Ventas from './pages/Ventas/Ventas';
import Insumos from './pages/Insumos/Insumos';
import Categorias from './pages/Insumos/Categorias';
import Compras from './pages/Compras/Compras';
import CrearCompra from './pages/Compras/crearCompra';
import Agenda from './pages/Agendamiento/Agenda';
import Login from './components/consts/Login';
import Proveedores from './pages/Compras/Proveedores';
import CrearCuenta from './components/consts/Register';
import Servicios from './pages/Agendamiento/Servicios/Servicios';
import Salida from './pages/Salida_Insumos/Salida';
import Clientes from "./pages/Clientes/Clientes";
import Empleados from "./pages/Empleados/Empleados";
import Registrar from './pages/Ventas/Registrar'
import InsumoDetalle from './pages/Ventas/Detalles'


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/iniciarSesion" element={<Login />} />
        <Route path="/Registrar" element={<CrearCuenta />} />
        <Route path="/" element={<App />}>
          <Route path="/configuracion/roles" element={<Roles />} />
          <Route path="/Usuarios/Administradores" element={<Admin />} />
          {/* <Route path="/Usuarios" element={<Usuarios2 />} /> */}
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/compras/Proveedores" element={<Proveedores />} />
          <Route path="/compras/crearCompra" element={<CrearCompra />} />
          <Route path="/Insumos/Categorias" element={<Categorias />} />
          <Route path="/agendamiento" element={<Agenda />} />
          <Route path="/Salida_Insumos" element={<Salida />} />
          <Route path="/Clientes" element={<Clientes />} />
          <Route path="/Insumos" element={<Insumos />} />
          <Route path="/agendamiento/Servicios" element={<Servicios />} />
          <Route path="/Empleados" element={<Empleados />} />
          <Route path="/RegistrarVentas" element={<Registrar />} />
          <Route path="/Detalleventa/:id" element={<InsumoDetalle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
