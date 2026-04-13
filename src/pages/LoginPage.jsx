import '../styles/index.css';
import React from 'react';
import Navbar from '../components/Navbar';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import LoginForm from '../components/login/LoginForm';
import useAuthCheck from '../hooks/useAuthCheck';

function LoginPage() {
  useAuthCheck('/dashboard');

  return (
    <BackgroundLayout>
      <Navbar
        navItems={[]}
        showNavItems={false}
        brandText="BIT-B03"
        rightCtaText="Don't have an account?"
        rightCtaHref="/register"
        rightCtaLinkText="Register"
      />
      <main className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        {/* Center form while leaving space for fixed navbar */}
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
          <LoginForm />
        </div>
      </main>
    </BackgroundLayout>
  );
}

export default LoginPage;
