// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/ContextoUsuario';

const PrivateRoute = ({ children, requiredPermissions }) => {
  const { user, permissions } = useUser();

  if (!user) {
    return <Navigate to="/iniciarSesion" />;
  }

  const hasRequiredPermissions = requiredPermissions.every(permission => 
    permissions.includes(permission)
  );

  return hasRequiredPermissions ? children : <Navigate to="/iniciarSesion" />;
};

export default PrivateRoute;
