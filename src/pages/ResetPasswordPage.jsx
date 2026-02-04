import '../styles/index.css';
import React from 'react';
import Navbar from '../components/Navbar';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import ResetPasswordForm from '../components/ResetPassword/ResetPasswordForm';

function ResetPasswordPage() {
  return (
    <BackgroundLayout>
      <Navbar
        navItems={[]}
        showNavItems={false}
        brandText="BIT-B03"
        rightCtaText="Remember your password?"
        rightCtaHref="/login"
        rightCtaLinkText="Log in"
      />
      <main className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
          <ResetPasswordForm />
        </div>
      </main>
    </BackgroundLayout>
  );
}

export default ResetPasswordPage;
