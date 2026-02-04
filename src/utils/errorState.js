// Utilities for building a reusable error page payload via react-router `location.state`.
// Keep everything serializable and sanitized (no tokens, passwords, auth headers, or huge dumps).

const SENSITIVE_QUERY_KEYS = new Set([
  'token',
  'access_token',
  'refresh_token',
  'id_token',
  'password',
  'new_password',
  'confirm_password',
]);

export const sanitizeSearch = (search) => {
  const raw = String(search || '');
  if (!raw) return '';

  try {
    const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
    for (const key of Array.from(params.keys())) {
      if (SENSITIVE_QUERY_KEYS.has(String(key).toLowerCase())) {
        params.delete(key);
      }
    }
    const out = params.toString();
    return out ? `?${out}` : '';
  } catch {
    // If parsing fails, do a conservative strip for common token patterns.
    return '';
  }
};

export const sanitizeText = (input, { maxLen = 600 } = {}) => {
  let text = input == null ? '' : String(input);
  if (!text) return '';

  // Redact JWT-like tokens
  text = text.replace(
    /([A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/g,
    '[REDACTED_JWT]'
  );

  // Redact Bearer tokens
  text = text.replace(/(Bearer\s+)[A-Za-z0-9\-._~+/]+=*/gi, '$1[REDACTED]');

  // Redact Authorization/Cookie headers in case they appear in error strings
  text = text.replace(/Authorization\s*:\s*[^\n]+/gi, 'Authorization: [REDACTED]');
  text = text.replace(/Cookie\s*:\s*[^\n]+/gi, 'Cookie: [REDACTED]');

  // Redact common key=value secrets
  text = text.replace(/(token|access_token|refresh_token|id_token)\s*[:=]\s*['"]?([^\s'"&]+)/gi, '$1=[REDACTED]');
  text = text.replace(/(password|new_password|confirm_password)\s*[:=]\s*['"]?([^\s'"&]+)/gi, '$1=[REDACTED]');

  // Redact token in query-like strings
  text = text.replace(/([?&](?:token|access_token|refresh_token|id_token)=)([^&\s]+)/gi, '$1[REDACTED]');

  // Trim and clamp size
  text = text.trim();
  if (text.length > maxLen) {
    text = `${text.slice(0, Math.max(0, maxLen - 1))}…`;
  }

  return text;
};

export const inferKind = ({ status, code } = {}) => {
  const s = Number(status || 0);
  if (!s) return 'network';
  if (s === 404) return 'not-found';
  if (s === 401 || s === 403 || code === 'UNAUTHORIZED') return 'auth';
  return 'http';
};

export const defaultTitleFor = ({ status, kind } = {}) => {
  const s = Number(status || 0);
  if (kind === 'network' || s === 0) return 'Koneksi bermasalah';
  if (s === 404) return 'Halaman tidak ditemukan';
  if (s === 403) return 'Akses ditolak';
  if (s === 401) return 'Perlu login';
  if (s >= 500) return 'Server sedang bermasalah';
  return 'Terjadi kesalahan';
};

export const defaultMessageFor = ({ status, kind } = {}) => {
  const s = Number(status || 0);
  if (kind === 'network' || s === 0) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi.';
  }
  if (s === 404) {
    return 'Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.';
  }
  if (s === 403) {
    return 'Anda tidak memiliki izin untuk mengakses halaman ini.';
  }
  if (s === 401) {
    return 'Sesi Anda mungkin telah berakhir. Silakan login kembali.';
  }
  if (s >= 500) {
    return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
  }
  return 'Silakan coba lagi atau kembali ke beranda.';
};

export const toErrorPageState = (err, {
  context,
  from,
  status,
  code,
  title,
  message,
  details,
  allowGoBack = true,
  primaryCta,
  secondaryCta,
} = {}) => {
  // Accept both mapped errors ({status, code, message, details}) and raw errors.
  const mappedStatus = Number(status ?? err?.status ?? err?.response?.status ?? 0);
  const mappedCode = String(code ?? err?.code ?? 'UNKNOWN_ERROR');

  const kind = inferKind({ status: mappedStatus, code: mappedCode });

  const safeTitle = sanitizeText(title || err?.title || defaultTitleFor({ status: mappedStatus, kind }), {
    maxLen: 120,
  });

  const safeMessage = sanitizeText(
    message || err?.message || defaultMessageFor({ status: mappedStatus, kind }),
    { maxLen: 400 }
  );

  const rawDetails = details ?? err?.details ?? err?.response?.data?.message ?? err?.response?.data?.error ?? '';
  const safeDetails = sanitizeText(rawDetails, { maxLen: 900 });

  const timestamp = Date.now();

  const safeFrom = from
    ? {
        pathname: sanitizeText(from.pathname || '', { maxLen: 200 }),
        search: sanitizeSearch(from.search || ''),
        hash: sanitizeText(from.hash || '', { maxLen: 80 }),
      }
    : undefined;

  const primary = primaryCta || { label: 'Ke Beranda', to: '/', replace: true };

  return {
    kind,
    title: safeTitle,
    message: safeMessage,
    code: sanitizeText(mappedCode, { maxLen: 60 }),
    status: mappedStatus,
    context: sanitizeText(context || '', { maxLen: 80 }) || undefined,
    from: safeFrom,
    timestamp,
    requestId: sanitizeText(err?.requestId || err?.response?.data?.request_id || err?.response?.data?.requestId || '', {
      maxLen: 80,
    }) || undefined,
    meta: {
      status: mappedStatus,
      code: sanitizeText(mappedCode, { maxLen: 60 }),
      timestamp,
      requestId: sanitizeText(err?.requestId || err?.response?.data?.request_id || err?.response?.data?.requestId || '', {
        maxLen: 80,
      }) || undefined,
    },
    details: safeDetails || undefined,
    allowGoBack: Boolean(allowGoBack),
    primaryCta: {
      label: sanitizeText(primary.label, { maxLen: 32 }) || 'Ke Beranda',
      to: String(primary.to || '/'),
      replace: Boolean(primary.replace),
    },
    secondaryCta: secondaryCta
      ? {
          label: sanitizeText(secondaryCta.label, { maxLen: 32 }),
          to: String(secondaryCta.to || '/'),
          replace: Boolean(secondaryCta.replace),
        }
      : undefined,
  };
};
