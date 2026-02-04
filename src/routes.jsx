import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './pages/app.jsx';
import DetailMember from './pages/DetailMember.jsx';
import Member from './pages/Member.jsx';
import Register from './pages/Register.jsx';
import RegistrationSuccess from './pages/RegistrationSuccess.jsx';
import { Navigate } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="people" element={<Member />} />
                <Route path="people/:userHashedId" element={<DetailMember />} />
                <Route path="register" element={<Register />} />
                <Route path="registration-success" element={<RegistrationSuccess />} />
                {/* Backward/typo-friendly alias (one 's') */}
                <Route
                    path="registration-succes"
                    element={<Navigate to="/registration-success" replace />}
                />
            </Routes>
        </Router>
    </React.StrictMode>
);
