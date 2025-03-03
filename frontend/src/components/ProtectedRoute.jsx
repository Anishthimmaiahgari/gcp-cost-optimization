// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function ProtectedRoute({ children }) {
  const isAuthenticated = AuthService.checkAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  
  return children;
}

export default ProtectedRoute;