import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { CaretDown, Drop, List, X } from '@phosphor-icons/react';
import { EASE, EASE_IN_OUT, useSite } from '../lib/site.js';
import { Btn } from './Blocks.jsx';

export const MAIN = [
  ['/verify', 'Verify'],
  ['/secure', 'Secure'],
  ['/shares', 'Shares'],
  ['/trade', 'Trade'],
  ['/earn', 'Earn'],
];
export const MORE = [
  ['/values', 'Values'],
  ['/packs', 'Packs'],
  ['/cuids', 'Cuids'],
];

export function Logo({ light }) {
  return (
    <Link to="/" className={`logo${light ? ' logo-light' : ''}`} aria-label="Cuiditi home">
      <span className="logo-mark">
        <Drop weight="fill" />
      </span>
      Cuiditi
    </Link>
  );
}

/** Sits clear over the hero photo, turns to frosted glass once you scroll, hides while you scroll down. */
export default function SiteHeader({ hidden }) {
  const { lenis } = useSite();
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  const [away, setAway] = useState(false);
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(v > 40);
    setAway(v > 420 && v > prev);
  });

  useEffect(() => {
    setOpen(false);
    setMore(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const l = lenis.current;
    if (l) open ? l.stop() : l.start();
  }, [open, lenis]);

  const moreActive = MORE.some(([to]) => pathname === to);

  return (
    <>
      <motion.header
        className={`hdr${solid && !open ? ' is-solid' : ''}${open ? ' is-open' : ''}`}
        initial={{ y: '-110%' }}
        animate={{ y: hidden || (away && !open && !more) ? '-110%' : '0%' }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div className="wrap hdr-in">
          <Logo />
          <nav aria-label="Main" className="hdr-nav-wrap">
            <ul className="hdr-nav">
              {MAIN.map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} className="hdr-link">
                    {({ isActive }) => (
                      <>
                        {label}
                        {isActive && <motion.span layoutId="nav-active" className="hdr-active" transition={{ duration: 0.5, ease: EASE }} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
              <li className="hdr-more" onMouseEnter={() => setMore(true)} onMouseLeave={() => setMore(false)}>
                <button
                  type="button"
                  className="hdr-link"
                  aria-expanded={more}
                  aria-controls="more-menu"
                  onClick={() => setMore((m) => !m)}
                >
                  More <CaretDown weight="bold" className={more ? 'flip' : ''} />
                  {moreActive && <motion.span layoutId="nav-active" className="hdr-active" />}
                </button>
                <AnimatePresence>
                  {more && (
                    <motion.div
                      id="more-menu"
                      className="hdr-drop"
                      initial={{ opacity: 0, y: -10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.97 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      {MORE.map(([to, label]) => (
                        <NavLink key={to} to={to} className="hdr-drop-link">
                          {label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </nav>
          <div className="hdr-cta">
            <NavLink to="/signin" className="hdr-link hide-md">
              Sign in
            </NavLink>
            <span className="hide-sm">
              <Btn to="/signup" small>
                Get started
              </Btn>
            </span>
            <button
              type="button"
              className="hdr-burger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X weight="bold" /> : <List weight="bold" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mmenu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: EASE_IN_OUT }}
          >
            <motion.ul
              className="mmenu-list"
              initial="hidden"
              animate="shown"
              variants={{ shown: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
            >
              {[...MAIN, ...MORE, ['/signin', 'Sign in']].map(([to, label]) => (
                <li key={to} className="word-mask">
                  <motion.span variants={{ hidden: { y: '110%' }, shown: { y: 0, transition: { duration: 0.7, ease: EASE } } }}>
                    <NavLink to={to} className="mmenu-link">
                      {label}
                    </NavLink>
                  </motion.span>
                </li>
              ))}
            </motion.ul>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
              <Btn to="/signup">Get started</Btn>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
