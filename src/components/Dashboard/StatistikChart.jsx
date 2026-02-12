import React from 'react';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const normalizeRate = (raw) => {
	const n = Number(raw);
	if (!Number.isFinite(n)) return 0;
	// backend might return 0..1 or 0..100
	const pct = n <= 1 ? n * 100 : n;
	return clamp(pct, 0, 100);
};

function DonutRing({ value, size = 92, stroke = 10, label, from = '#1F4C74', to = '#24E1C9' }) {
	const v = normalizeRate(value);
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	const dash = (v / 100) * c;
	const gradientId = React.useId();

	return (
		<div className="flex flex-col items-center">
			<div className="relative" style={{ width: size, height: size }}>
				<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
					<defs>
						<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor={from} />
							<stop offset="100%" stopColor={to} />
						</linearGradient>
					</defs>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={r}
						stroke="rgba(255,255,255,0.10)"
						strokeWidth={stroke}
						fill="none"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={r}
						stroke={`url(#${gradientId})`}
						strokeWidth={stroke}
						strokeLinecap="round"
						fill="none"
						strokeDasharray={`${dash} ${c - dash}`}
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
						style={{ transition: 'stroke-dasharray 400ms ease' }}
					/>
				</svg>

				<div className="absolute inset-0 grid place-items-center">
					<div className="text-center">
						<div className="text-pure-white font-bold text-lg leading-none">{Math.round(v)}%</div>
						<div className="text-[11px] text-muted-gray mt-1">complete</div>
					</div>
				</div>
			</div>

			<div className="mt-3 text-sm font-semibold text-pure-white">{label}</div>
		</div>
	);
}

export default function StatistikChart({ data, overall: overallProp }) {
	// Accept either a full payload ({overall, projects, contributors}) or a direct overall object
	const overall = overallProp || data?.overall || data;

	return (
		<div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
			<div className="flex items-center justify-between gap-4">
				<div>
					<div className="text-pure-white font-semibold">Progress Overview</div>
					<div className="text-xs text-muted-gray">Chart lingkaran untuk overall completion rate</div>
				</div>
			</div>

			<div className="mt-5">
				<div className="flex justify-center">
					<DonutRing
						value={overall?.completion_rate ?? 0}
						label="Overall"
						from="#1F4C74"
						to="#24E1C9"
					/>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
					<div className="rounded-xl border border-white/10 bg-black/10 p-3">
						<div className="text-muted-gray">Completed</div>
						<div className="mt-1 text-pure-white font-semibold">{Number(overall?.completed ?? 0)}</div>
					</div>
					<div className="rounded-xl border border-white/10 bg-black/10 p-3">
						<div className="text-muted-gray">On progress</div>
						<div className="mt-1 text-pure-white font-semibold">{Number(overall?.on_progress ?? 0)}</div>
					</div>
					<div className="rounded-xl border border-white/10 bg-black/10 p-3">
						<div className="text-muted-gray">Total</div>
						<div className="mt-1 text-pure-white font-semibold">{Number(overall?.total ?? 0)}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

