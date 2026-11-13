// Small motion toolkit built on Motion (motion.dev). Svelte actions plus helpers.
// Every effect checks prefers-reduced-motion and stays still when it is set.
import { animate, inView, scroll } from 'motion';
import { EASE } from './site.svelte.js';

export const VIEW = { margin: '0px 0px -10% 0px' };

export const prefersReduced = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const mix = (a, b, t) => a + (b - a) * t;
/** Where `p` sits between `a` and `b`, as 0..1. */
export const range = (p, a, b) => clamp((p - a) / (b - a));

/** Calls `cb(progress, info)` as `target` scrolls through the viewport (or the page, with no target). */
export const onScroll = (cb, target, offset) =>
	scroll((p, info) => cb(p, info), target ? { target, offset } : undefined);

/** Runs `cb` once, the first time `node` comes into view. Returns a cleanup. */
export function once(node, cb, options = VIEW) {
	let stop = () => {};
	stop = inView(
		node,
		() => {
			cb();
			stop();
		},
		options
	);
	return () => stop();
}

/** use:reveal: fades and lifts the element in when it scrolls into view. `delay` is in steps of 80ms. */
export function reveal(node, { delay = 0, y = 26 } = {}) {
	if (prefersReduced()) return;
	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	const stop = once(node, () =>
		animate(node, { opacity: [0, 1], y: [y, 0] }, { duration: 0.9, ease: EASE, delay: delay * 0.08 })
	);
	return { destroy: stop };
}

/** use:parallax: drifts the element against the scroll by `amount` percent. */
export function parallax(node, { amount = 10 } = {}) {
	if (prefersReduced()) return;
	const stop = onScroll(
		(p) => (node.style.transform = `translate3d(0, ${mix(amount, -amount, p)}%, 0)`),
		node.parentElement ?? node,
		['start end', 'end start']
	);
	return { destroy: stop };
}

/** use:magnetic: pulls the element toward the cursor, then springs back. Mouse only. */
export function magnetic(node, { strength = 0.32 } = {}) {
	if (prefersReduced()) return;
	const to = (x, y) => animate(node, { x, y }, { type: 'spring', stiffness: 220, damping: 16, mass: 0.4 });
	const move = (e) => {
		if (e.pointerType !== 'mouse') return;
		const r = node.getBoundingClientRect();
		to((e.clientX - (r.left + r.width / 2)) * strength, (e.clientY - (r.top + r.height / 2)) * strength);
	};
	const leave = () => to(0, 0);
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
}

/** Pointer handler that lights a card's border and surface under the cursor (see .spot in CSS). */
export function spotlight(e) {
	const el = e.currentTarget;
	const r = el.getBoundingClientRect();
	el.style.setProperty('--mx', `${e.clientX - r.left}px`);
	el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/** Svelte transition: wipes an element open from the top (used by the phone menu). */
export function wipe(node, { duration = 700 } = {}) {
	return {
		duration,
		easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
		css: (t) => `clip-path: inset(0% 0% ${(1 - t) * 100}% 0%)`
	};
}
