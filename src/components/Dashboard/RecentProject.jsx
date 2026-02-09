import React from 'react';
import { Link } from 'react-router-dom';
import AvatarStack from '../common/AvatarStack';

const safeNumber = (v) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};

const formatDateTime = (iso) => {
	if (!iso) return '-';
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return '-';
	return new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(d);
};

const statusMeta = (statusRaw) => {
	const status = String(statusRaw || '').toLowerCase();
	switch (status) {
		case 'completed':
			return {
				label: 'Completed',
				pill: 'border-brand-24e1c9/25 bg-brand-24e1c9/10 text-brand-24e1c9',
			};
		case 'on_progress':
		case 'in_progress':
			return {
				label: 'On progress',
				pill: 'border-stat-blue/25 bg-stat-blue/10 text-stat-blue',
			};
		case 'blocked':
			return {
				label: 'Blocked',
				pill: 'border-stat-red/25 bg-stat-red/10 text-stat-red',
			};
		case 'not_started':
			return {
				label: 'Not started',
				pill: 'border-white/15 bg-white/5 text-muted-gray',
			};
		default:
			return {
				label: status ? status.replace(/_/g, ' ') : 'Unknown',
				pill: 'border-white/15 bg-white/5 text-muted-gray',
			};
	}
};

export default function RecentProject({ projects }) {
	const list = Array.isArray(projects) ? projects : [];

	return (
		<section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="text-pure-white font-semibold">Recent Project</div>
					<div className="text-xs text-muted-gray">Project terbaru yang baru dibuat / diperbarui</div>
				</div>
				<div className="text-xs text-muted-gray">Total: {safeNumber(list.length)}</div>
			</div>

			{list.length === 0 ? (
				<div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-6 sm:p-8">
					<div className="flex flex-col items-center text-center gap-4">
						<div className="grid place-items-center w-14 h-14 rounded-2xl border border-white/10 bg-white/5 text-brand-24e1c9">
							<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>

						<div>
							<div className="text-pure-white font-semibold">Belum ada project</div>
							<div className="text-sm text-muted-gray mt-1 max-w-[46ch]">
								Mulai buat project pertamamu supaya progress dan kontribusi tim bisa tercatat di dashboard.
							</div>
						</div>

						<Link
							to="/create-project"
							className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-24e1c9 text-dark-bg font-semibold shadow-[0_10px_26px_rgba(36,225,201,0.18)] hover:bg-brand-24e1c9/90 active:bg-brand-24e1c9/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-24e1c9/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg transition"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							Buat Project
						</Link>
					</div>
				</div>
			) : (
				<div className="mt-5 overflow-hidden rounded-xl border border-white/10">
					<div className="divide-y divide-white/10">
						{list.map((p) => {
							const meta = statusMeta(p?.status);
							const creator = p?.creator || null;
							const contributorsRaw = Array.isArray(p?.contributors) ? p.contributors : [];
							const contributors = (() => {
								const seen = new Set();
								const merged = [];

								const pushUnique = (u) => {
									if (!u) return;
									const key = u?.hashed_id || u?.name;
									if (!key) return;
									if (seen.has(key)) return;
									seen.add(key);
									merged.push(u);
								};

								pushUnique(creator);
								contributorsRaw.forEach(pushUnique);
								return merged;
							})();
							return (
								<div
									key={p?.hashed_id || `${p?.title}-${p?.created_at}`}
									className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
								>
									<div className="min-w-0">
										<div className="flex items-center gap-2 min-w-0">
											<div className="text-pure-white font-semibold truncate">{p?.title || 'Untitled project'}</div>
											<span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${meta.pill}`}>
												{meta.label}
											</span>
										</div>
										<div className="mt-1 text-xs text-muted-gray">
											Dibuat: <span className="text-pure-white/80">{formatDateTime(p?.created_at)}</span>
										</div>
									</div>

									<div className="flex items-center justify-between sm:justify-end gap-3">
										<div className="flex items-center gap-3 overflow-visible">
											<AvatarStack users={contributors} size={28} max={5} />
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</section>
	);
}

