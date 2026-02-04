import '../styles/index.css';
import React from 'react';
import Navbar from '../components/Navbar';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import ErrorHandler from '../components/ErrorHendler/ErrorHandler';

export default function ErrorHandlerPage() {
  return (
    <BackgroundLayout>
      <main className="min-h-screen flex items-center justify-center px-4 py-10 sm:py-14">
        <ErrorHandler />
      </main>
    </BackgroundLayout>
  );
}
