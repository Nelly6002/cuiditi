export const EASE = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];

/** Shared, reactive site state: whether the intro has lifted, and the Lenis instance. */
export const site = $state({ introDone: false, lenis: null, menuOpen: false });

export const pageTitle = (title) => (title ? `${title} | Cuiditi` : 'Cuiditi | Buy, verify and trade Nigerian property');
