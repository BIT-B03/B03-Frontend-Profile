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
import AboutPage from './pages/AboutPage.jsx';
import ProtectedRoute from './utils/ProtectRoute';
import KickRequests from './pages/KickRequests.jsx';
import CreateKickRequest from './pages/CreateKickRequest.jsx';
import ConfirmPelamar from './pages/ConfirmPelamar.jsx';
import MemberSettings from './pages/MemberSettings.jsx';
import Profile from './pages/Profile.jsx';
import CreateProject from './pages/CreateProject.jsx';
import DetailProjectCreate from './pages/DetailProjectCreate.jsx';
import EditProjectDescription from './pages/EditProjectDescription.jsx';
import Settings from './pages/Settings.jsx';
import Contact from './pages/Contact.jsx';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                    <Route path="member-management/kick-request" element={<ProtectedRoute> <KickRequests /> </ProtectedRoute>} />
                    <Route path="member-management/kick-request/create" element={<ProtectedRoute> <CreateKickRequest /> </ProtectedRoute>} />
                    <Route path="member-management/confirm-pelamar" element={<ProtectedRoute> <ConfirmPelamar /> </ProtectedRoute>} />
                    <Route path="member-management/member-settings" element={<ProtectedRoute> <MemberSettings /> </ProtectedRoute>} />
                    <Route path="profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
                    <Route path="settings" element={<ProtectedRoute> <Settings /> </ProtectedRoute>} />
                    <Route path="create-project" element={<ProtectedRoute> <CreateProject /> </ProtectedRoute>} />
                    <Route path="create-project/:projectHashedId" element={<ProtectedRoute> <DetailProjectCreate /> </ProtectedRoute>} />
                    <Route path="create-project/:projectHashedId/edit-description" element={<ProtectedRoute> <EditProjectDescription /> </ProtectedRoute>} />

                    <Route path="people" element={<Member />} />
                    <Route path="people/:userHashedId" element={<DetailMember />} />
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="project" element={<OurProject />} />
                    <Route path="projects/:projectHashedId" element={<DetailProject />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="about" element={<AboutPage />} />
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
