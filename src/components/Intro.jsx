import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE, EASE_IN_OUT } from '../lib/site.js';

const WORD = 'Cuiditi';

// Full version on the first load of a visit, a quicker one on every reload after that
const TIMINGS = {
  full: { rise: 0.95, stagger: 0.06, fill: 1.5, hold: 260, exit: 1.05 },
  quick: { rise: 0.55, stagger: 0.03, fill: 0.7, hold: 80, exit: 0.8 },
};

/**
 * Opening animation on every full page load.
 * rise (letters rise out of masks as outlines) → fill (green liquid rises inside the letters,
 * "trade real estate like water") → exit (the whole sheet lifts away to reveal the hero photo).
 * A click, tap or any key skips ahead.
 */
export default function Intro({ quick, onReveal, onDone }) {
  const t = quick ? TIMINGS.quick : TIMINGS.full;
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState('rise');

  // Wait for the webfont so the word doesn't jump mid-animation (never longer than 1.5s)
  useEffect(() => {
    let alive = true;
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]).then(
      () => alive && setReady(true)
    );
    return () => {
      alive = false;
    };
  }, []);

  const skip = useCallback(() => setStage('exit'), []);
  useEffect(() => {
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [skip]);

  useEffect(() => {
    if (stage === 'exit') onReveal();
  }, [stage, onReveal]);

  return (
    <motion.div
      className="intro"
      role="status"
      onClick={skip}
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={stage === 'exit' ? { clipPath: 'inset(0% 0% 100% 0%)' } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: stage === 'exit' ? t.exit : 0, ease: EASE_IN_OUT }}
      onAnimationComplete={() => stage === 'exit' && onDone()}
    >
      <span className="sr-only">Loading Cuiditi</span>
      {ready && (
        <motion.div
          className="intro-word"
          aria-hidden="true"
          animate={stage === 'exit' ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: t.exit * 0.8, ease: EASE_IN_OUT }}
        >
          <motion.div
            className="intro-letters"
            initial="from"
            animate="to"
            variants={{ to: { transition: { staggerChildren: t.stagger } } }}
            onAnimationComplete={(def) => def === 'to' && setStage((s) => (s === 'rise' ? 'fill' : s))}
          >
            {WORD.split('').map((c, i) => (
              <span className="word-mask" key={i}>
                <motion.span variants={{ from: { y: '115%' }, to: { y: 0, transition: { duration: t.rise, ease: EASE } } }}>
                  {c}
                </motion.span>
              </span>
            ))}
          </motion.div>
          <motion.div
            className="intro-fill"
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={stage === 'rise' ? {} : { clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: t.fill, ease: [0.65, 0, 0.35, 1] }}
            onAnimationComplete={() => stage === 'fill' && setTimeout(() => setStage((s) => (s === 'fill' ? 'exit' : s)), t.hold)}
          >
            {WORD}
          </motion.div>
        </motion.div>
      )}
      <motion.p
        className="intro-tag"
        initial={{ opacity: 0, y: 10 }}
        animate={stage === 'exit' ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: stage === 'exit' ? 0 : 0.5 }}
      >
        Trade real estate like water
      </motion.p>
      <span className="intro-line" aria-hidden="true">
        <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: t.fill + t.rise + 0.4, ease: [0.4, 0, 0.2, 1] }} />
      </span>
      <button
        type="button"
        className="intro-skip"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
      >
        Skip intro
      </button>
    </motion.div>
  );
}
