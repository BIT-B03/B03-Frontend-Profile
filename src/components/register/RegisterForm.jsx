import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Register } from '../../api/api';
import FormCv from './FormCv';
import { MarkRegistrationSuccess } from '../../utils/registrationSuccessGate';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [cvFile, setCvFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);

  

  const validate = () => {
    if (!name.trim()) return 'Name wajib diisi.';
    if (!username.trim()) return 'Username wajib diisi.';
    if (!password || password.length < 6) return 'Password minimal 6 karakter.';
    if (confirmPassword !== password) return 'Konfirmasi password tidak sama.';
    if (!cvFile) return 'CV (PDF) wajib diunggah.';
    if (!email.trim()) return 'Email wajib diisi.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const msg = validate();
    if (msg) {
      setErrorMessage(msg);
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('username', username.trim());
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('email', email.trim());
    if (bio) formData.append('bio', bio.trim());
    if (cvFile) formData.append('cv_file', cvFile);

    try {
      setSubmitting(true);
      await Register(formData);
      // Redirect to success page
      MarkRegistrationSuccess(email.trim());
      navigate('/registration-success');
    } catch (err) {
      setErrorMessage(err?.message || 'Gagal melakukan pendaftaran.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6">
      <div className="mb-6 text-center">
        <h1 className="text-lg sm:text-2xl font-semibold text-pure-white">Create your account and start building, collaborating, and innovating with other developers.</h1>
      </div>
      <div className="glass-white rounded-2xl shadow-2xl p-4 sm:p-8">
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm text-muted-gray mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              className="w-full rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 text-sm sm:text-base"
              onChange={(e) => setName(e.target.value)}
              required
              defaultValue=""
            />
          </div>

          <div>
            <label className="block text-sm text-muted-gray mb-1">Username</label>
            <input
              type="text"
              placeholder="johndoe123"
              className="w-full rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 text-sm sm:text-base"
              onChange={(e) => setUsername(e.target.value)}
              required
              defaultValue=""
            />
          </div>

          <div>
            <label className="block text-sm text-muted-gray mb-1">Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 text-sm sm:text-base"
              onChange={(e) => setPassword(e.target.value)}
              required
              defaultValue=""
            />
          </div>

          <div>
            <label className="block text-sm text-muted-gray mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              className="w-full rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 text-sm sm:text-base"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              defaultValue=""
            />
          </div>

          <div>
            <label className="block text-sm text-muted-gray mb-1">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 text-sm sm:text-base"
              onChange={(e) => setEmail(e.target.value)}
              required
              defaultValue=""
            />
          </div>

          <div>
            <label className="block text-sm text-muted-gray mb-1">Bio (Opsional)</label>
            <textarea
              placeholder="Masukkan Bio Kamu"
              className="w-full rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 min-h-[96px] text-sm sm:text-base"
              onChange={(e) => setBio(e.target.value)}
              defaultValue=""
            />
          </div>

          <FormCv value={cvFile} onChange={setCvFile} onError={setErrorMessage} />

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-flash w-full rounded-lg bg-brand-getstarted px-4 py-2 text-sm sm:text-base text-pure-white shadow disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Register'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
  
};

export default RegisterForm;
