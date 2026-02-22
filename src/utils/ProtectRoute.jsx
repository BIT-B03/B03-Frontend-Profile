import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('auth_access_token');

    return isAuthenticated ? children : <Navigate to="/error" replace />;
};

export default ProtectedRoute;