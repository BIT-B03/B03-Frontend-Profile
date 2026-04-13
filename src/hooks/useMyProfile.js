import { useCallback, useEffect, useState } from 'react';
import { GetMyProfile } from '../api/api';

const resolveProfilePayload = (payload) => {
  if (!payload) return null;
  if (payload.data) return payload.data;
  return payload;
};

export default function useMyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await GetMyProfile();
      const data = resolveProfilePayload(resp);
      setProfile(data);
      if (typeof window !== 'undefined') {
        if (data?.avatar_url) {
          localStorage.setItem('avatar_url', data.avatar_url);
        } else {
          localStorage.removeItem('avatar_url');
        }
        window.dispatchEvent(new Event('user-updated'));
      }
      return data;
    } catch (err) {
      console.error(err);
      setError('Gagal memuat profil.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      const data = await fetchProfile();
      if (!isMounted) return;
      setProfile(data);
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}
