import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
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

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="dashboard" element={<Dashboard />} />
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
                {/* Backward/typo-friendly alias (one 's') */}
                <Route
                    path="registration-succes"
                    element={<Navigate to="/registration-success" replace />}
                />
                <Route path="*" element={<NotFoundRedirect />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
