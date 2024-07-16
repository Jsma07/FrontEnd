// PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { UserContext } from './context/ContextoUsuario';

const PrivateRoute = ({ element, ...props }) => {
  const { usuario } = useContext(UserContext);

  return usuario ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/iniciarSesion" replace />
  );
};

export default PrivateRoute;
