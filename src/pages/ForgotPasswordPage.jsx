import React from 'react';
import { Navigate } from 'react-router-dom';

// Legacy route file (kept to avoid broken imports). Use `/reset-password` instead.

export default function ForgotPasswordPage() {
  return <Navigate to="/reset-password" replace />;
}
