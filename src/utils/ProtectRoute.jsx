import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toErrorPageState } from './errorState';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('auth_access_token');
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/error"
                replace
                state={toErrorPageState(null, {
                    context: 'ProtectedRoute',
                    status: 401,
                    code: 'UNAUTHORIZED',
                    title: 'Perlu login',
                    message: 'Silakan login untuk mengakses halaman ini',
                    from: {
                        pathname: location?.pathname || '',
                        search: location?.search || '',
                        hash: location?.hash || '',
                    },
                    primaryCta: { label: 'Login', to: '/login', replace: true },
                    allowGoBack: true,
                })}
            />
        );
    }

    return children;
};

export default ProtectedRoute;