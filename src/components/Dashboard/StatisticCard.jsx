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
			bottomBorder: 'border-b-4 border-brand-24e1c9/60',
			// stronger teal-to-current gradient for fill
			tintGradient: 'from-brand-24e1c9/30 via-brand-24e1c9/10 to-white/5',
			// fill gradient for boxes: bottom (teal) -> top (dark)
			boxBg: 'bg-gradient-to-t from-brand-24e1c9/30 via-brand-24e1c9/10 to-black/10',
			// inline style to make the teal stronger at the bottom (~20% height)
			boxStyle: {
				backgroundImage:
					'linear-gradient(to top, rgba(36,225,201,0.95) 0%, rgba(36,225,201,0.9) 20%, rgba(6,6,13,0.12) 100%)',
			},
			boxBottom: 'border-b-2 border-brand-24e1c9/50',
			icon: 'text-brand-24e1c9 bg-brand-24e1c9/10 border-brand-24e1c9/25',
			percent: 'text-brand-24e1c9',
			bar: 'bg-brand-24e1c9/80',
			glow: 'hover:shadow-[0_0_18px_rgba(36,225,201,0.18)]',
			boxBorder: 'border border-brand-24e1c9/20',
		},
		blue: {
			border: 'border-stat-blue/20 hover:border-stat-blue/35',
			bottomBorder: 'border-b-4 border-stat-blue/60',
			tintGradient: 'from-stat-blue/30 via-stat-blue/10 to-white/5',
			boxBg: 'bg-gradient-to-t from-stat-blue/10 via-stat-blue/200 to-black/50',
			boxStyle: {
				backgroundImage:
					'linear-gradient(to top, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.1) 10%, rgba(6,6,13,0.10) 30%)',
			},
			boxBottom: 'border-b-2 border-stat-blue/50',
			boxBorder: 'border border-stat-blue/25',
			icon: 'text-stat-blue bg-stat-blue/10 border-stat-blue/25',
			percent: 'text-stat-blue',
			bar: 'bg-stat-blue/80',
			glow: 'hover:shadow-[0_0_18px_rgba(59,130,246,0.18)]',
		},
		yellow: {
			border: 'border-stat-yellow/20 hover:border-stat-yellow/35',
			bottomBorder: 'border-b-4 border-stat-yellow/60',
			tintGradient: 'from-stat-yellow/30 via-stat-yellow/10 to-white/5',
			boxBg: 'bg-gradient-to-t from-stat-yellow/30 via-stat-yellow/10 to-black/10',
			boxStyle: {
				backgroundImage:
					'linear-gradient(to top, rgba(245,158,11,0.25) 0%, rgba(245,158,11,0.09) 10%, rgba(6,6,13,0.05) 30%)',
			},
			boxBottom: 'border-b-2 border-stat-yellow/50',
			icon: 'text-stat-yellow bg-stat-yellow/10 border-stat-yellow/25',
			percent: 'text-stat-yellow',
			bar: 'bg-stat-yellow/80',
			glow: 'hover:shadow-[0_0_18px_rgba(245,158,11,0.18)]',
			boxBorder: 'border border-stat-yellow/20',
		},
		red: {
			border: 'border-stat-red/20 hover:border-stat-red/35',
			bottomBorder: 'border-b-4 border-stat-red/60',
			tintGradient: 'from-stat-red/30 via-stat-red/10 to-white/5',
			boxBg: 'bg-gradient-to-t from-stat-red/30 via-stat-red/10 to-black/10',
			boxStyle: {
				backgroundImage:
					'linear-gradient(to top, rgba(239,68,68,0.95) 0%, rgba(239,68,68,0.9) 20%, rgba(6,6,13,0.12) 100%)',
			},
			boxBottom: 'border-b-2 border-stat-red/50',
			icon: 'text-stat-red bg-stat-red/10 border-stat-red/25',
			percent: 'text-stat-red',
			bar: 'bg-stat-red/80',
			glow: 'hover:shadow-[0_0_18px_rgba(239,68,68,0.18)]',
			boxBorder: 'border border-stat-red/20',
		},
	};

	const v = VARIANT[variant] || VARIANT.teal;

	const completed = Number(stats?.completed ?? 0);
	const onProgress = Number(stats?.on_progress ?? 0);
	const total = Number(stats?.total ?? 0);
	const rate = normalizeRate(stats?.completion_rate ?? 0);

	return (
		<div
			className={`relative overflow-hidden rounded-2xl border bg-white/5 p-4 sm:p-5 backdrop-blur transition ${v.border} ${v.glow}`}
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
				<div style={v.boxStyle || undefined} className={`rounded-xl p-3 ${v.boxBg || 'bg-black/10'} ${v.boxBorder || v.boxBottom || 'border-b border-white/10'}`}>
					<div className="text-[11px] text-muted-gray">Completed</div>
					<div className="text-pure-white font-semibold">{completed}</div>
				</div>
				<div style={v.boxStyle || undefined} className={`rounded-xl p-3 ${v.boxBg || 'bg-black/10'} ${v.boxBorder || v.boxBottom || 'border-b border-white/10'}`}>
					<div className="text-[11px] text-muted-gray">On progress</div>
					<div className="text-pure-white font-semibold">{onProgress}</div>
				</div>
				<div style={v.boxStyle || undefined} className={`rounded-xl p-3 ${v.boxBg || 'bg-black/10'} ${v.boxBorder || v.boxBottom || 'border-b border-white/10'}`}>
					<div className="text-[11px] text-muted-gray">Total</div>
					<div className="text-pure-white font-semibold">{total}</div>
				</div>
			</div>

			<div className="mt-4">
				<div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
					<div
						className={`h-full rounded-full ${v.bar}`}
						style={{ width: `${rate}%` }}
						aria-label="Completion rate"
					/>
				</div>
			</div>
			</div>
		</div>
	);
}

