import { useEffect, useMemo, useRef, useState } from 'react';
import { getAvatarImageUrl } from '../api/api';

const AVATAR_BG_PALETTE = [
	// Keep these aligned with tailwind.config.js palette
	{ from: '#24E1C9', to: '#1F4C74' }, // brand teal -> brand navy
	{ from: '#3B82F6', to: '#1F4C74' }, // stat blue -> brand navy
	{ from: '#F59E0B', to: '#1F4C74' }, // stat yellow -> brand navy
	{ from: '#EF4444', to: '#1F4C74' }, // stat red -> brand navy
	{ from: '#24E1C9', to: '#06060D' }, // brand teal -> dark
	{ from: '#3B82F6', to: '#06060D' }, // blue -> dark
];

const hexToRgb = (hex) => {
	const raw = String(hex || '').replace('#', '').trim();
	if (raw.length !== 6) return { r: 0, g: 0, b: 0 };
	const r = Number.parseInt(raw.slice(0, 2), 16);
	const g = Number.parseInt(raw.slice(2, 4), 16);
	const b = Number.parseInt(raw.slice(4, 6), 16);
	return {
		r: Number.isFinite(r) ? r : 0,
		g: Number.isFinite(g) ? g : 0,
		b: Number.isFinite(b) ? b : 0,
	};
};

const rgba = ({ r, g, b }, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

const hashStringToInt = (value) => {
	const s = String(value || '');
	let hash = 5381;
	for (let i = 0; i < s.length; i += 1) {
		hash = (hash * 33) ^ s.charCodeAt(i);
	}
	return hash >>> 0;
};

const pickAvatarGradient = (seed) => {
	const idx = hashStringToInt(seed) % AVATAR_BG_PALETTE.length;
	return AVATAR_BG_PALETTE[idx];
};

export const getInitial = (name) => {
	const raw = String(name || '').trim();
	if (!raw) return '?';
	const first = raw.split(/\s+/)[0] || raw;
	return (first[0] || '?').toUpperCase();
};

export const useAvatarImageSrc = (avatarUrl) =>
	useMemo(() => {
		if (!avatarUrl) return null;
		return getAvatarImageUrl(avatarUrl);
	}, [avatarUrl]);

export const useAvatarCircleStyle = ({ seed, size }) => {
	const gradient = useMemo(() => pickAvatarGradient(seed || ''), [seed]);
	const gradientRgb = useMemo(
		() => ({ from: hexToRgb(gradient.from), to: hexToRgb(gradient.to) }),
		[gradient.from, gradient.to]
	);

	return useMemo(
		() => ({
			width: size,
			height: size,
			backgroundColor: '#06060D',
			backgroundImage: [
				`radial-gradient(circle at 30% 28%, ${rgba(gradientRgb.from, 0.95)} 0%, ${rgba(gradientRgb.from, 0)} 62%)`,
				`radial-gradient(circle at 85% 85%, ${rgba(gradientRgb.to, 0.55)} 0%, ${rgba(gradientRgb.to, 0)} 60%)`,
				`linear-gradient(135deg, ${rgba(gradientRgb.to, 0.92)} 0%, rgba(6, 6, 13, 1) 88%)`,
			].join(', '),
			boxShadow: `0 0 0 1px rgba(255,255,255,0.06) inset, 0 6px 18px ${rgba(gradientRgb.from, 0.14)}`,
			textShadow: '0 1px 2px rgba(0,0,0,0.55)',
		}),
		[size, gradientRgb.from, gradientRgb.to]
	);
};

export const useMoreBadgeStyle = ({ size }) =>
	useAvatarCircleStyle({ seed: 'more-badge', size });

export const useAvatarTooltip = ({ enabled = true } = {}) => {
	const anchorRef = useRef(null);
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

	const updateTooltipPos = () => {
		const el = anchorRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();

		// anchor point: center-top of the avatar
		const rawLeft = rect.left + rect.width / 2;
		const left = Math.max(12, Math.min(window.innerWidth - 12, rawLeft));
		const top = Math.max(8, rect.top);
		setTooltipPos({ top, left });
	};

	useEffect(() => {
		if (!tooltipOpen) return;
		updateTooltipPos();

		const onScroll = () => updateTooltipPos();
		const onResize = () => updateTooltipPos();

		window.addEventListener('scroll', onScroll, true);
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('scroll', onScroll, true);
			window.removeEventListener('resize', onResize);
		};
	}, [tooltipOpen]);

	const handlers = enabled
		? {
			onMouseEnter: () => setTooltipOpen(true),
			onMouseLeave: () => setTooltipOpen(false),
			onFocus: () => setTooltipOpen(true),
			onBlur: () => setTooltipOpen(false),
		}
		: {};

	return {
		anchorRef,
		tooltipOpen: enabled ? tooltipOpen : false,
		tooltipPos,
		tooltipHandlers: handlers,
	};
};

export const useAvatarCircleModel = ({ name, avatarUrl, hashedId, size }) => {
	const src = useAvatarImageSrc(avatarUrl);
	const initial = useMemo(() => getInitial(name), [name]);
	const seed = useMemo(() => hashedId || name || '', [hashedId, name]);
	const circleStyle = useAvatarCircleStyle({ seed, size });
	const { anchorRef, tooltipOpen, tooltipPos, tooltipHandlers } = useAvatarTooltip({
		enabled: Boolean(name),
	});

	const [imgOk, setImgOk] = useState(Boolean(src));
	useEffect(() => {
		setImgOk(Boolean(src));
	}, [src]);

	return {
		src,
		imgOk,
		onImgError: () => setImgOk(false),
		initial,
		circleStyle,
		anchorRef,
		tooltipOpen,
		tooltipPos,
		tooltipHandlers,
		ariaLabel: name ? `Contributor: ${name}` : 'Contributor',
		title: name || undefined,
		tabIndex: name ? 0 : -1,
	};
};
