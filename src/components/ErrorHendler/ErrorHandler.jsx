import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toErrorPageState } from '../../utils/errorState';
import ErrorHeaderLabel from './parts/ErrorHeaderLabel';
import ErrorStatusBlock from './parts/ErrorStatusBlock';
import ErrorTerminalCard from './parts/ErrorTerminalCard';
import ErrorDetailsPanel from './parts/ErrorDetailsPanel';
import ErrorActionButtons from './parts/ErrorActionButtons';

const formatTime = (ts) => {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return '';
  }
};

export default function ErrorHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = useMemo(() => {
    const raw = location?.state;

    // If state is missing (refresh/new tab), show a safe generic fallback.
    if (!raw || typeof raw !== 'object') {
      return toErrorPageState(null, {
        status: 500,
        code: 'MISSING_ERROR_STATE',
        title: 'Terjadi kesalahan',
        message:
          'Detail error tidak tersedia (mungkin karena halaman direfresh). Silakan kembali ke beranda.',
        allowGoBack: true,
      });
    }

    // Re-sanitize defensively (state should already be sanitized).
    return toErrorPageState(raw, {
      status: raw.status,
      code: raw.code,
      title: raw.title,
      message: raw.message,
      details: raw.details,
      context: raw.context,
      from: raw.from,
      allowGoBack: raw.allowGoBack,
      primaryCta: raw.primaryCta,
      secondaryCta: raw.secondaryCta,
    });
  }, [location?.state]);

  const [showDetails, setShowDetails] = useState(false);

  const status = Number(state?.status || 0);
  const code = state?.code || 'UNKNOWN_ERROR';
  const title = state?.title || 'Terjadi kesalahan';
  const message = state?.message || 'Silakan coba lagi.';

  const timestampText = state?.timestamp ? formatTime(state.timestamp) : '';

  const metaLine = (() => {
    const parts = [];
    if (status) parts.push(`HTTP ${status}`);
    if (code) parts.push(code);
    if (state?.timestamp) parts.push(formatTime(state.timestamp));
    if (state?.requestId) parts.push(`requestId: ${state.requestId}`);
    return parts.join(' • ');
  })();

  const primary = state?.primaryCta || { label: 'Ke Beranda', to: '/', replace: true };
  const secondary = state?.secondaryCta;

  const bigStatus = status || (state?.kind === 'network' ? 0 : '');
  const showRetry = state?.kind === 'network' || status >= 500;

  const terminalTitle = 'system/error-handler';
  const actionLine = state?.kind === 'network' ? 'Awaiting connection…' : 'Awaiting user action…';

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      <div className="glass-white rounded-2xl shadow-2xl p-5 sm:p-10 relative">
        <ErrorHeaderLabel terminalTitle={terminalTitle} />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-stretch">
          <ErrorStatusBlock bigStatus={bigStatus} />

          <div className="w-full lg:flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-pure-white">{title}</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-gray">{message}</p>

            <ErrorTerminalCard
              terminalTitle={terminalTitle}
              status={status}
              timestampText={timestampText}
              code={code}
              fromPathname={state?.from?.pathname}
              requestId={state?.requestId}
              actionLine={actionLine}
              metaLine={metaLine}
            />

            <ErrorDetailsPanel
              details={state?.details}
              showDetails={showDetails}
              onToggle={() => setShowDetails((v) => !v)}
            />

            <ErrorActionButtons
              primary={primary}
              allowGoBack={state?.allowGoBack}
              secondary={secondary}
              showRetry={showRetry}
              onGoPrimary={() => navigate(primary.to, { replace: Boolean(primary.replace) })}
              onGoBack={() => navigate(-1)}
              onGoSecondary={() => navigate(secondary.to, { replace: Boolean(secondary.replace) })}
              onRetry={() => window.location.reload()}
            />

            <p className="mt-8 text-xs text-muted-gray">
              Jika masalah berlanjut, silakan hubungi support dan sertakan informasi teknis di atas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
