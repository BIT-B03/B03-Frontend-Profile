import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import RegistrationSuccessContent from '../components/register/RegistrationSuccessContent';
import {
  CanAccessRegistrationSuccess,
  ClearRegistrationSuccess,
  GetRegistrationSuccessEmail,
} from '../utils/registrationSuccessGate';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const ENABLE_SUCCESS_GUARD = false;
  const email = GetRegistrationSuccessEmail();

  useEffect(() => {
    if (!ENABLE_SUCCESS_GUARD) return;

    if (!CanAccessRegistrationSuccess()) {
      navigate('/register', { replace: true });
    }
  }, [ENABLE_SUCCESS_GUARD, navigate]);

  return (
    <BackgroundLayout>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
          <RegistrationSuccessContent
            email={email}
            onGoHome={() => {
              ClearRegistrationSuccess();
              navigate('/');
            }}
          />
        </div>
      </main>
    </BackgroundLayout>
  );
};

export default RegistrationSuccess;
