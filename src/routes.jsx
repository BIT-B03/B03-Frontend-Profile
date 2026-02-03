import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './pages/app.jsx';
import DetailMember from './pages/DetailMember.jsx';
import Member from './pages/Member.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="people" element={<Member />} />
                <Route path="people/:userHashedId" element={<DetailMember />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
