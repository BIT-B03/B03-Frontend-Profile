const ExtractBackendMessage = (error) => {
  const data = error?.response?.data || {};
  return (
    data.message ||
    data.error ||
    null
  );
};

export const MapAuthError = (error, context = 'Auth') => {
  const status = error?.response?.status;
  const backendMsg = ExtractBackendMessage(error);

  if (!status) {
    return {
      code: 'NETWORK_ERROR',
      status: 0,
      message: 'Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi.',
      details: backendMsg || null,
    };
  }

  // Specific mappings per status
  switch (status) {
    case 429:
      return {
        code: 'RATE_LIMIT',
        status,
        message: backendMsg || 'Terlalu banyak permintaan. Coba lagi nanti.',
      };

    case 401: {
      const messageByContext = {
        Login: 'Username atau password salah.',
        Logout: 'Token tidak valid atau telah kedaluwarsa.',
      };
      return {
        code: 'UNAUTHORIZED',
        status,
        message: backendMsg || messageByContext[context] || 'Akses tidak diizinkan.',
      };
    }

    case 400: {
      const messageByContext = {
        VerifyResetToken: 'Token tidak valid atau telah kedaluwarsa.',
        ResetPassword: 'Token tidak valid atau telah kedaluwarsa atau password baru tidak memenuhi syarat.',
        Login: 'Harap isi username dan password.',
        Register: 'Data pendaftaran tidak valid.',
        ForgotPassword: 'Format email tidak valid.',
      };
      return {
        code: 'BAD_REQUEST',
        status,
        message: backendMsg || messageByContext[context] || 'Input tidak valid.',
      };
    }

    case 503:
      return {
        code: 'SERVICE_UNAVAILABLE',
        status,
        message: backendMsg || 'Reset password tidak tersedia saat ini.',
      };

    case 500:
      return {
        code: 'SERVER_ERROR',
        status,
        message: backendMsg || 'Terjadi kesalahan pada server. Coba lagi nanti.',
      };

    default:
      return {
        code: 'UNKNOWN_ERROR',
        status,
        message: backendMsg || 'Terjadi kesalahan yang tidak diketahui.',
      };
  }
};
