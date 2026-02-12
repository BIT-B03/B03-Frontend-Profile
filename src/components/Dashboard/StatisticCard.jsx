import React from 'react';

const normalizeRate = (raw) => {
	const n = Number(raw);
	if (!Number.isFinite(n)) return 0;
	// backend might return 0..1 or 0..100
	const pct = n <= 1 ? n * 100 : n;
	return Math.max(0, Math.min(100, pct));
};

export default function StatisticCard({
	title,
	subtitle,
	stats,
	icon,
	variant = 'teal',
}) {
	const VARIANT = {
		teal: {
			border: 'border-brand-24e1c9/20 hover:border-brand-24e1c9/35',
			tint: 'from-brand-24e1c9/12 via-white/5 to-transparent',
			icon: 'text-brand-24e1c9 bg-brand-24e1c9/10 border-brand-24e1c9/25',
			percent: 'text-brand-24e1c9',
			bar: 'bg-gradient-to-r from-brand-24e1c9 to-cyan-300',
			glow: 'hover:shadow-[0_0_18px_rgba(36,225,201,0.18)]',
			boxBorder: 'border border-brand-24e1c9/20',
		},
		blue: {
			border: 'border-stat-blue/20 hover:border-stat-blue/35',
			tint: 'from-stat-blue/12 via-white/5 to-transparent',
			icon: 'text-stat-blue bg-stat-blue/10 border-stat-blue/25',
			percent: 'text-stat-blue',
			bar: 'bg-gradient-to-r from-stat-blue to-blue-400',
			glow: 'hover:shadow-[0_0_18px_rgba(59,130,246,0.18)]',
			boxBorder: 'border border-stat-blue/25',
		},
		yellow: {
			border: 'border-stat-yellow/20 hover:border-stat-yellow/35',
			tint: 'from-stat-yellow/12 via-white/5 to-transparent',
			icon: 'text-stat-yellow bg-stat-yellow/10 border-stat-yellow/25',
			percent: 'text-stat-yellow',
			bar: 'bg-gradient-to-r from-stat-yellow to-amber-300',
			glow: 'hover:shadow-[0_0_18px_rgba(245,158,11,0.18)]',
			boxBorder: 'border border-stat-yellow/20',
		},
		red: {
			border: 'border-stat-red/20 hover:border-stat-red/35',
			tint: 'from-stat-red/12 via-white/5 to-transparent',
			icon: 'text-stat-red bg-stat-red/10 border-stat-red/25',
			percent: 'text-stat-red',
			bar: 'bg-gradient-to-r from-stat-red to-red-400',
			glow: 'hover:shadow-[0_0_18px_rgba(239,68,68,0.18)]',
			boxBorder: 'border border-stat-red/20',
		},
	};

	const v = VARIANT[variant] || VARIANT.teal;

	const completed = Number(stats?.completed ?? 0);
	const onProgress = Number(stats?.on_progress ?? 0);
	const total = Number(stats?.total ?? 0);
	const rate = normalizeRate(stats?.completion_rate ?? 0);
	const barStyle = { width: `${rate}%` };

	return (
		<div
			className={`relative overflow-visible rounded-2xl border bg-white/5 p-4 sm:p-5 backdrop-blur transition ${v.border}`}
		>
			<div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${v.tint}`} />
			<div className="relative">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							{icon ? (
								<span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${v.icon}`}>
									{icon}
								</span>
							) : null}
							<div>
								<div className="text-pure-white font-semibold truncate">{title}</div>
								{subtitle ? (
									<div className="text-xs text-muted-gray truncate">{subtitle}</div>
								) : null}
							</div>
						</div>
					</div>

					<div className="text-right">
						<div className={`${v.percent} font-bold text-lg`}>{Math.round(rate)}%</div>
						<div className="text-[11px] text-muted-gray">completion</div>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-3 gap-2">
					<div className={`rounded-xl p-3 ${v.boxBorder || 'border-b border-white/10'} bg-black/10`}>
						<div className="text-[11px] text-muted-gray">Completed</div>
						<div className="text-pure-white font-semibold">{completed}</div>
					</div>
					<div className={`rounded-xl p-3 ${v.boxBorder || 'border-b border-white/10'} bg-black/10`}>
						<div className="text-[11px] text-muted-gray">On progress</div>
						<div className="text-pure-white font-semibold">{onProgress}</div>
					</div>
					<div className={`rounded-xl p-3 ${v.boxBorder || 'border-b border-white/10'} bg-black/10`}>
						<div className="text-[11px] text-muted-gray">Total</div>
						<div className="text-pure-white font-semibold">{total}</div>
					</div>
				</div>

					<div className="mt-4">
						<div className="h-2 w-full rounded-full bg-white/10 overflow-visible">
							<div className="relative h-full">
								<div
									className={`absolute inset-y-0 left-0 rounded-full ${v.bar} blur-[8px] opacity-70`}
									style={barStyle}
									aria-hidden="true"
								/>
								<div
									className={`relative h-full rounded-full ${v.bar}`}
									style={barStyle}
									aria-label="Completion rate"
								/>
							</div>
						</div>
					</div>
			</div>
		</div>
	);
	}

