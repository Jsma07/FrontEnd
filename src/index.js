import React from 'react';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom';
import Roles from './pages/Roles/Roles';
import Usuarios from './pages/Usuarios/Usuarios';
import Ventas from './pages/Ventas/Ventas';
import Compras from './pages/Compras/Compras';
import Agenda from './pages/Agendamiento/Agenda';
import Login from './components/consts/Login';
import Salida from './pages/Salida_Insumos/Salida';  
import Insumosd from './pages/Insumos/Insumos';
import Clientes from "./pages/Clientes/Clientes";


 ReactDOM.render(
  <BrowserRouter>
  <Routes>
  <Route path="/iniciarSesion" element={<Login />} />
    <Route path="/" element={<App />} >
     <Route path="/configuracion/roles" element={<Roles />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/compras" element={<Compras />} />
      <Route path="/agendamiento" element={<Agenda />} />
      <Route path="/Salida_Insumos" element={<Salida />} />
  
      <Route path="/Clientes" element={<Clientes />} />
      <Route path="/Insumos" element={<Insumosd />} />

    </Route>
  </Routes>
</BrowserRouter>,
document.getElementById('root')
 )


