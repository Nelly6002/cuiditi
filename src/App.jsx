import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import './styles/site.css';
import './styles/pages.css';
import { SiteContext, nav, useSite } from './lib/site.js';
import Intro from './components/Intro.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import { ScrollProgress } from './components/Blocks.jsx';
import Home from './pages/Home.jsx';
import Verify from './pages/Verify.jsx';
import Secure from './pages/Secure.jsx';
import Shares from './pages/Shares.jsx';
import Trade from './pages/Trade.jsx';
import Earn from './pages/Earn.jsx';
import Values from './pages/Values.jsx';
import Packs from './pages/Packs.jsx';
import Cuids from './pages/Cuids.jsx';
import Auth from './pages/Auth.jsx';
import Credits from './pages/Credits.jsx';
import NotFound from './pages/NotFound.jsx';

// The intro plays on every full page load (never on page-to-page navigation).
// After the first time in a visit it runs a quicker version, and it can always be skipped.
const INTRO_KEY = 'cuiditi-intro-seen';
function introSeenThisVisit() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
}

function Shell({ showIntro }) {
  const location = useLocation();
  const { lenis } = useSite();
  const firstPath = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname !== firstPath.current) nav.moved = true;
  }, [location.pathname]);

  const toTop = () => (lenis.current ? lenis.current.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));

  return (
    <>
      <ScrollProgress />
      <SiteHeader hidden={showIntro} />
      <main id="main">
        <AnimatePresence mode="wait" onExitComplete={toTop}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/secure" element={<Secure />} />
            <Route path="/shares" element={<Shares />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/values" element={<Values />} />
            <Route path="/packs" element={<Packs />} />
            <Route path="/cuids" element={<Cuids />} />
            <Route path="/signin" element={<Auth mode="signin" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </>
  );
}

export default function App() {
  const reduceMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [showIntro, setShowIntro] = useState(!reduceMotion);
  const [introDone, setIntroDone] = useState(reduceMotion);
  const quickIntro = useMemo(introSeenThisVisit, []);
  const lenis = useRef(null);

  // Smooth scrolling
  useEffect(() => {
    if (reduceMotion) return;
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.current = instance;
    let frame;
    const raf = (time) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis.current = null;
    };
  }, [reduceMotion]);

  // Freeze scrolling while the intro covers the page
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', showIntro);
    const l = lenis.current;
    if (l) showIntro ? l.stop() : l.start();
  }, [showIntro]);

  // The hero starts moving as the intro lifts, not after, so the two overlap
  const handleReveal = useCallback(() => setIntroDone(true), []);
  const handleDone = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {}
    setShowIntro(false);
    setIntroDone(true);
  }, []);

  const site = useMemo(() => ({ introDone, lenis }), [introDone]);

  return (
    <SiteContext.Provider value={site}>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <BrowserRouter>
          <Shell showIntro={showIntro} />
        </BrowserRouter>
        {showIntro && <Intro quick={quickIntro} onReveal={handleReveal} onDone={handleDone} />}
        <div className="grain" aria-hidden="true" />
      </MotionConfig>
    </SiteContext.Provider>
  );
}
