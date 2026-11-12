import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { Eye, EyeSlash, SealCheck } from '@phosphor-icons/react';
import { EASE, usePageTitle, useSite } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { Btn, Page } from '../components/Blocks.jsx';
import { RevealWords } from '../components/Motion.jsx';

export default function Auth({ mode }) {
  const up = mode === 'signup';
  usePageTitle(up ? 'Create account' : 'Sign in');
  const { introDone } = useSite();
  const photo = up ? photos.lagoon : photos.skyline;
  const [vals, setVals] = useState({ name: '', email: '', password: '' });
  const [errs, setErrs] = useState({});
  const [show, setShow] = useState(false);
  const [ok, setOk] = useState(false);
  const shake = useAnimationControls();

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (up && vals.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(vals.email)) next.email = 'Enter a valid email address.';
    if (up ? vals.password.length < 8 : !vals.password) next.password = up ? 'Use at least 8 characters.' : 'Enter your password.';
    setErrs(next);
    if (Object.keys(next).length) {
      shake.start({ x: [0, -12, 12, -7, 7, 0], transition: { duration: 0.45 } });
      setOk(false);
    } else setOk(true);
  };

  const fields = [
    ...(up ? [['name', 'Full name', 'text', 'name']] : []),
    ['email', 'Email', 'email', 'email'],
    ['password', 'Password', show ? 'text' : 'password', up ? 'new-password' : 'current-password'],
  ];

  return (
    <Page>
      <section className="auth">
        <div className="auth-side graded">
          <motion.img src={photo.src(1600)} alt={photo.alt} initial={{ scale: 1.25 }} animate={introDone ? { scale: 1 } : {}} transition={{ duration: 2.4, ease: EASE }} />
          <span className="auth-shade" aria-hidden="true" />
          <div className="auth-side-in">
            <RevealWords as="h2" text={up ? 'Start with ₦1,000.' : 'Welcome back.'} show={introDone} delay={2} />
            <motion.p initial={{ opacity: 0, y: 14 }} animate={introDone ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7, duration: 0.8, ease: EASE }}>
              {up ? 'Verify, buy and trade property from one wallet.' : 'Your wallet and portfolio are where you left them.'}
            </motion.p>
          </div>
        </div>
        <div className="auth-main">
          <motion.div className="auth-card" animate={shake}>
            <motion.div initial="h" animate={introDone ? 's' : 'h'} variants={{ s: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}>
              <motion.h1 variants={item}>{up ? 'Create your account' : 'Sign in'}</motion.h1>
              <motion.p variants={item} className="muted auth-sub">
                {up ? 'It takes a couple of minutes.' : 'Pick up where you left off.'}
              </motion.p>
              <form noValidate onSubmit={submit}>
                {fields.map(([k, label, type, ac]) => (
                  <motion.div variants={item} key={k} className={`field${errs[k] ? ' invalid' : ''}`}>
                    <label htmlFor={k}>{label}</label>
                    <div className="input-wrap">
                      <input
                        id={k}
                        type={type}
                        autoComplete={ac}
                        value={vals[k]}
                        onChange={(e) => setVals({ ...vals, [k]: e.target.value })}
                        aria-invalid={!!errs[k]}
                        aria-describedby={errs[k] ? `${k}-err` : k === 'password' && up ? 'pw-help' : undefined}
                      />
                      {k === 'password' && (
                        <button type="button" className="input-eye" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)}>
                          {show ? <EyeSlash /> : <Eye />}
                        </button>
                      )}
                    </div>
                    {k === 'password' && up && !errs.password && (
                      <span className="help" id="pw-help">
                        At least 8 characters.
                      </span>
                    )}
                    <AnimatePresence>
                      {errs[k] && (
                        <motion.span className="err" id={`${k}-err`} role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          {errs[k]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                <motion.div variants={item} className="auth-submit">
                  <Btn type="submit">{up ? 'Create account' : 'Sign in'}</Btn>
                </motion.div>
              </form>
              <AnimatePresence>
                {ok && (
                  <motion.div className="ok-box" initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                    <SealCheck weight="fill" /> The form is valid. Connect it to the real sign-in endpoint.
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.p variants={item} className="auth-switch">
                {up ? 'Already have an account? ' : 'New to Cuiditi? '}
                <Link to={up ? '/signin' : '/signup'}>{up ? 'Sign in' : 'Create an account'}</Link>
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

const item = { h: { opacity: 0, y: 18 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
