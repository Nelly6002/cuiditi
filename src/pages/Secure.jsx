import { useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { LockKey, SealCheck, ShieldCheck, UserCheck } from '@phosphor-icons/react';
import { EASE, usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { Btn, CtaBand, Page, PageHero, SecHead } from '../components/Blocks.jsx';
import { Counter, Reveal } from '../components/Motion.jsx';

export default function Secure() {
  usePageTitle('Secure a payment');
  return (
    <Page>
      <PageHero
        photo={photos.bridge}
        eyebrow="Cuid Cecure"
        title="Pay into escrow, not a stranger's account."
        accent={['escrow,']}
        lead="Cuid Cecure locks your money with Cuiditi until the beneficiary is verified and your release conditions are met."
      />
      <section className="section">
        <div className="wrap split split-top">
          <div>
            <Reveal className="big-stat">
              <Counter to={100} prefix="₦" suffix="B+" />
            </Reveal>
            <Reveal as="p" delay={1} className="lead">
              The EFCC reports over ₦100 billion lost to property fraud in Nigeria each year. Most of it leaves through a bank account that was switched mid deal.
            </Reveal>
          </div>
          <Stepper />
        </div>
      </section>
      <ReleaseTimeline />
      <CtaBand photo={photos.island} title="Protect your next payment." text="Free to start. You only pay when you lock funds." />
    </Page>
  );
}

const EMPTY = { role: 'send', purpose: 'Land purchase', amount: '', cond: 'The title transfer is registered' };

function Stepper() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const shake = useAnimationControls();
  const go = (n) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const next = () => {
    if (step === 1) {
      const n = Number(form.amount.replace(/,/g, ''));
      if (!form.amount || Number.isNaN(n) || n < 1000) {
        setErr('Enter an amount of ₦1,000 or more.');
        shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } });
        return;
      }
      setErr('');
    }
    go(step + 1);
  };
  const amount = Number(form.amount.replace(/,/g, '') || 0).toLocaleString('en-NG');
  const slide = {
    enter: (d) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d * -60, opacity: 0 }),
  };

  return (
    <Reveal className="card stepper" delay={1}>
      <div className="stepper-bar" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i}>
            <motion.span initial={false} animate={{ scaleX: done || step >= i ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} />
          </span>
        ))}
      </div>
      <p className="eyebrow">{done ? 'Done' : `Step ${step + 1} of 3`}</p>
      <div className="stepper-body">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} className="stepper-done">
              <motion.span className="done-ic" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}>
                <SealCheck weight="fill" />
              </motion.span>
              <h3>Your payment is ready to lock.</h3>
              <p className="muted">In the live product the other party now gets a link to verify their details and accept your terms.</p>
              <Btn
                variant="quiet"
                onClick={() => {
                  setDone(false);
                  setForm(EMPTY);
                  go(0);
                }}
              >
                Start another
              </Btn>
            </motion.div>
          ) : (
            <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE }}>
              {step === 0 && (
                <>
                  <h3 className="stepper-q">Are you sending money or expecting to receive it?</h3>
                  <div className="choice" role="radiogroup" aria-label="Your role">
                    {[
                      ['send', 'I am sending money', 'Protect a payment for land, rent or a build.'],
                      ['receive', 'I will receive funds', 'Share terms and let the other party deposit safely.'],
                    ].map(([v, t, d]) => (
                      <label key={v} className={form.role === v ? 'on' : ''}>
                        <input type="radio" name="role" value={v} checked={form.role === v} onChange={() => setForm({ ...form, role: v })} />
                        <span>
                          <b>{t}</b>
                          <span>{d}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <h3 className="stepper-q">Describe the payment</h3>
                  <div className="field">
                    <label htmlFor="purpose">What is it for?</label>
                    <select id="purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
                      <option>Land purchase</option>
                      <option>Rent</option>
                      <option>Building work</option>
                    </select>
                  </div>
                  <motion.div className={`field${err ? ' invalid' : ''}`} animate={shake}>
                    <label htmlFor="amount">Amount (₦)</label>
                    <input id="amount" inputMode="numeric" placeholder="2,500,000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} aria-invalid={!!err} aria-describedby="amount-err" />
                    {err && (
                      <span className="err" id="amount-err" role="alert">
                        {err}
                      </span>
                    )}
                  </motion.div>
                  <div className="field">
                    <label htmlFor="cond">Release the funds when</label>
                    <select id="cond" value={form.cond} onChange={(e) => setForm({ ...form, cond: e.target.value })}>
                      <option>The title transfer is registered</option>
                      <option>The keys are handed over</option>
                      <option>The work is signed off</option>
                    </select>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <h3 className="stepper-q">Review and lock</h3>
                  <dl className="review">
                    <dt>Role</dt>
                    <dd>{form.role === 'send' ? 'You are sending' : 'You are receiving'}</dd>
                    <dt>Purpose</dt>
                    <dd>{form.purpose}</dd>
                    <dt>Amount</dt>
                    <dd className="tnum">₦{amount}</dd>
                    <dt>Release</dt>
                    <dd>{form.cond}</dd>
                  </dl>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!done && (
        <div className="stepper-actions">
          {step > 0 && (
            <button type="button" className="btn btn-quiet" onClick={() => go(step - 1)}>
              Back
            </button>
          )}
          {step < 2 ? <Btn onClick={next}>Continue</Btn> : <Btn onClick={() => setDone(true)}>Lock payment</Btn>}
        </div>
      )}
    </Reveal>
  );
}

const RELEASE = [
  [LockKey, 'Lock', 'Your money is held by Cuiditi, never by the other party.'],
  [UserCheck, 'Verify', "We confirm the beneficiary's details so accounts cannot be switched mid deal."],
  [ShieldCheck, 'Release', 'Funds move only when the conditions you set are met.'],
];

/** The line between the three stages fills as you scroll, and each stage lights up as the line reaches it. */
function ReleaseTimeline() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const fill = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);
  return (
    <section className="section section-tight">
      <div className="wrap">
        <SecHead title="How release works." />
        <div ref={ref} className="timeline">
          <div className="timeline-line" aria-hidden="true">
            <motion.span style={{ scaleX: fill }} />
          </div>
          {RELEASE.map(([Icon, t, d], i) => (
            <TimelineStep key={t} Icon={Icon} t={t} d={d} at={i / (RELEASE.length - 1)} p={fill} />
          ))}
        </div>
      </div>
    </section>
  );
}
function TimelineStep({ Icon, t, d, at, p }) {
  const lit = useTransform(p, [Math.max(at - 0.05, 0), at + 0.001], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.85, 1]);
  return (
    <div className="tl-step">
      <motion.span className="tl-node" style={{ scale }}>
        <Icon weight="duotone" />
        <motion.span className="tl-node-lit" style={{ opacity: lit }}>
          <Icon weight="fill" />
        </motion.span>
      </motion.span>
      <h3>{t}</h3>
      <p>{d}</p>
    </div>
  );
}
