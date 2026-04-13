import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTH_TOKEN_KEY = 'auth_access_token';

/**
 * Hook untuk mengecek dan redirect jika user sudah login
 * Gunakan di halaman login/register untuk redirect user yang sudah authenticated
 */
export default function useAuthCheck(redirectTo = '/dashboard') {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);
}
