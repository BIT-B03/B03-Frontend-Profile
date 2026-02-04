const STORAGE_TS_KEY = 'registration_success_at';
const STORAGE_EMAIL_KEY = 'registration_success_email';

export const MarkRegistrationSuccess = (email) => {
  try {
    sessionStorage.setItem(STORAGE_TS_KEY, String(Date.now()));
    if (typeof email === 'string') {
      sessionStorage.setItem(STORAGE_EMAIL_KEY, email);
    }
  } catch {
  }
};

export const ClearRegistrationSuccess = () => {
  try {
    sessionStorage.removeItem(STORAGE_TS_KEY);
    sessionStorage.removeItem(STORAGE_EMAIL_KEY);
  } catch {
    // ignore
  }
};

export const GetRegistrationSuccessEmail = () => {
  try {
    return sessionStorage.getItem(STORAGE_EMAIL_KEY) || '';
  } catch {
    return '';
  }
};

export const CanAccessRegistrationSuccess = ({ ttlMs = 10 * 60 * 1000 } = {}) => {
  try {
    const raw = sessionStorage.getItem(STORAGE_TS_KEY);
    if (!raw) return false;

    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;

    return Date.now() - ts <= ttlMs;
  } catch {
    return false;
  }
};
