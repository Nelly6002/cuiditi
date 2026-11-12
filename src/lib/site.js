import { createContext, useContext, useEffect } from 'react';

export const EASE = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];

export const SiteContext = createContext({ introDone: true, lenis: { current: null } });
export const useSite = () => useContext(SiteContext);

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Cuiditi` : 'Cuiditi | Buy, verify and trade Nigerian property';
  }, [title]);
}

// True once the visitor has navigated between pages at least once, so the page curtain
// only plays on in-app navigation and never on top of the intro.
export const nav = { moved: false };
