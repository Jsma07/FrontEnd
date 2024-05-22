import React from 'react';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom';
import Roles from './pages/Roles/Roles';
import Usuarios from './pages/Usuarios/Usuarios';
import Ventas from './pages/Ventas/Ventas';
import Insumos from './pages/Insumos/Insumos';
import Categorias from './pages/Insumos/Categorias';
import Compras from './pages/Compras/Compras';
import Agenda from './pages/Agendamiento/Agenda';
import Login from './components/consts/Login';
import Proveedores from './pages/Compras/Proveedores';
import CrearCuenta from './components/consts/Register';
import Servicios from './pages/Agendamiento/Servicios/Servicios';
import Salida from './pages/Salida_Insumos/Salida';
import Clientes from "./pages/Clientes/Clientes";
import Empleados from "./pages/Empleados/Empleados";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/iniciarSesion" element={<Login />} />
      <Route path="/Registrar" element={<CrearCuenta />} />
      <Route path="/" element={<App />} >
        <Route path="/configuracion/roles" element={<Roles />} />
        <Route path="/Usuarios/Administradores" element={<Usuarios />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/compras/Proveedores" element={<Proveedores />} />
        <Route path="/Insumos/Categorias" element={<Categorias />} />
        <Route path="/agendamiento" element={<Agenda />} /> 
        <Route path="/Salida_Insumos" element={<Salida />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/Insumos" element={<Insumos />} />
        <Route path="/agendamiento/Servicios" element={<Servicios/>} />
        <Route path="/Empleados" element={<Empleados />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
