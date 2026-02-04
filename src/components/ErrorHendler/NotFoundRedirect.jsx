import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toErrorPageState } from '../../utils/errorState';

export default function NotFoundRedirect() {
  const location = useLocation();

  return (
    <Navigate
      to="/error"
      replace
      state={toErrorPageState(null, {
        status: 404,
        code: 'NOT_FOUND',
        title: 'Page Not Found',
        message: 'Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.',
        details: `No route matches: ${location?.pathname || '/'}`,
        from: {
          pathname: location?.pathname || '/',
          search: location?.search || '',
          hash: location?.hash || '',
        },
        allowGoBack: true,
      })}
    />
  );
}
