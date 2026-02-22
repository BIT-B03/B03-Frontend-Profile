import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import App from './pages/app.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DetailMember from './pages/DetailMember.jsx';
import Member from './pages/Member.jsx';
import Register from './pages/Register.jsx';
import RegistrationSuccess from './pages/RegistrationSuccess.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OurProject from './pages/OurProject.jsx';
import DetailProject from './pages/DetailProject.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import ErrorHandlerPage from './pages/ErrorHandlerPage.jsx';
import NotFoundRedirect from './pages/NotFoundRedirect.jsx';
import ProtectedRoute from './utils/ProtectRoute';
import CreateKickRequest from './pages/CreateKickRequest.jsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                    <Route path="member-management/kick-request/create" element={<ProtectedRoute> <CreateKickRequest /> </ProtectedRoute>} />
                    <Route path="people" element={<Member />} />
                    <Route path="people/:userHashedId" element={<DetailMember />} />
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="project" element={<OurProject />} />
                    <Route path="projects/:projectHashedId" element={<DetailProject />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    <Route path="forgot-password" element={<Navigate to="/reset-password" replace />} />
                    <Route path="error" element={<ErrorHandlerPage />} />
                    <Route path="registration-success" element={<RegistrationSuccess />} />
                    <Route
                        path="registration-succes"
                        element={<Navigate to="/registration-success" replace />}
                    />
                    <Route path="*" element={<NotFoundRedirect />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    </React.StrictMode>
);
