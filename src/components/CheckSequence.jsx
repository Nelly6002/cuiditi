import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Check, CircleNotch, SealCheck } from '@phosphor-icons/react';
import { EASE } from '../lib/site.js';

const STEPS = ['Title found in the registry', 'Parcel matched on the map', 'No disputes on record'];

/** A small live demo of a title check: each step spins, then ticks, then the result lands. Loops while visible. */
export default function CheckSequence({ className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setStep((s) => (s >= STEPS.length + 2 ? 0 : s + 1)), step === STEPS.length ? 2400 : 900);
    return () => clearTimeout(id);
  }, [inView, step]);
  const done = step >= STEPS.length;
  return (
    <div ref={ref} className={`glass checkseq ${className}`}>
      <div className="checkseq-head">
        <span className="chip chip-glass">Example check</span>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.span key="ok" className="checkseq-ok" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
              <SealCheck weight="fill" /> Verified
            </motion.span>
          ) : (
            <motion.span key="run" className="checkseq-run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Checking
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <ul>
        {STEPS.map((s, i) => {
          const state = step > i ? 'done' : step === i ? 'run' : 'wait';
          return (
            <li key={s} className={`checkseq-row is-${state}`}>
              <span className="checkseq-ic">
                <AnimatePresence mode="wait" initial={false}>
                  {state === 'done' ? (
                    <motion.span key="d" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                      <Check weight="bold" />
                    </motion.span>
                  ) : state === 'run' ? (
                    <motion.span key="r" className="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CircleNotch weight="bold" />
                    </motion.span>
                  ) : (
                    <motion.span key="w" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="dot" />
                  )}
                </AnimatePresence>
              </span>
              <span>{s}</span>
              <motion.span className="checkseq-bar" initial={false} animate={{ scaleX: state === 'done' ? 1 : 0 }} transition={{ duration: 0.8, ease: EASE }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
