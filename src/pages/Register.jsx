import '../styles/index.css';
import React from 'react';
import Navbar from '../components/Navbar';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import RegisterForm from '../components/register/RegisterForm';

function Register() {
  return (
    <BackgroundLayout>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <RegisterForm />
      </main>
    </BackgroundLayout>
  );
}

export default Register;
