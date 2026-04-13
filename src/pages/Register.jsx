import '../styles/index.css';
import React from 'react';
import Navbar from '../components/Navbar';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import RegisterForm from '../components/register/RegisterForm';
import useAuthCheck from '../hooks/useAuthCheck';

// Navbar configured to hide nav items and show brand/login CTA

function Register() {
  useAuthCheck('/dashboard');
  return (
    <BackgroundLayout>
      <Navbar
        navItems={[]}
        showNavItems={false}
        brandText="BIT-B03"
        rightCtaText="Already have an account?"
        rightCtaHref="/login"
      />
      {/* Offset for fixed navbar */}
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <RegisterForm />
      </main>
    </BackgroundLayout>
  );
}

export default Register;
