import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Drop } from '@phosphor-icons/react';
import { EASE, EASE_IN_OUT, nav, useSite } from '../lib/site.js';
import { Magnetic, Reveal, RevealWords } from './Motion.jsx';

/** Button with an arrow that slides out and a fresh one that slides in on hover. */
export function Btn({ to, href, children, variant = 'primary', small, onClick, type }) {
  const cls = `btn btn-${variant}${small ? ' btn-sm' : ''}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className="btn-arrow" aria-hidden="true">
        <ArrowRight weight="bold" />
        <ArrowRight weight="bold" />
      </span>
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <button type={type ?? 'button'} className={cls} onClick={onClick}>{inner}</button>;
}

export function TextLink({ to, children }) {
  return (
    <Link to={to} className="tlink">
      {children} <ArrowUpRight weight="bold" />
    </Link>
  );
}

/** Wraps every page: a green curtain sweeps away on arrival and sweeps in on exit. */
export function Page({ children }) {
  const first = !nav.moved;
  return (
    <>
      {children}
      <motion.div
        className="curtain"
        aria-hidden="true"
        initial={first ? false : { scaleY: 1, originY: 0 }}
        animate={{ scaleY: 0, originY: 0, transition: { duration: 0.85, ease: EASE_IN_OUT, delay: 0.08 } }}
        exit={{ scaleY: 1, originY: 1, transition: { duration: 0.6, ease: EASE_IN_OUT } }}
      >
        <span className="curtain-mark">
          <Drop weight="fill" />
        </span>
      </motion.div>
    </>
  );
}

/** Thin bar along the top edge that fills as you read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}

/**
 * Full-bleed photo hero. The photo zooms in on arrival, then as you scroll it drifts down,
 * the frame pulls in from the edges with rounded corners, and the copy lifts away.
 */
export function PageHero({ photo, eyebrow, title, lead, accent, children, tall, className = '' }) {
  const ref = useRef(null);
  const { introDone } = useSite();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '24%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.14]);
  const clip = useTransform(
    scrollYProgress,
    [0, 0.85],
    reduce
      ? ['inset(0px 0px 0px 0px round 0px)', 'inset(0px 0px 0px 0px round 0px)']
      : ['inset(0px 0px 0px 0px round 0px)', 'inset(0px 28px 64px 28px round 28px)']
  );
  const cy = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '45%']);
  const co = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);
  const fade = (d) => ({
    initial: { opacity: 0, y: 18 },
    animate: introDone ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, ease: EASE, delay: d },
  });
  return (
    <section ref={ref} className={`phero ${tall ? 'phero-tall' : ''} ${className}`}>
      <motion.div className="phero-frame" style={{ clipPath: clip }}>
        <motion.div className="phero-move" style={{ y, scale }}>
          <motion.img
            className="phero-img"
            src={photo.src(1920)}
            alt={photo.alt}
            fetchpriority="high"
            initial={{ scale: 1.22 }}
            animate={introDone ? { scale: 1 } : {}}
            transition={{ duration: 2.4, ease: EASE }}
          />
        </motion.div>
        <span className="phero-shade" aria-hidden="true" />
      </motion.div>
      <motion.div className="wrap phero-content" style={{ y: cy, opacity: co }}>
        {eyebrow && (
          <motion.p className="eyebrow eyebrow-light" {...fade(0.15)}>
            {eyebrow}
          </motion.p>
        )}
        <RevealWords as="h1" text={title} show={introDone} delay={2} accent={accent} className="phero-title" />
        {lead && (
          <motion.p className="phero-lead" {...fade(0.55)}>
            {lead}
          </motion.p>
        )}
        {children && (
          <motion.div className="phero-actions" {...fade(0.75)}>
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

/** Closing band: a full photo that zooms out as it scrolls in, with a frosted card on top. */
export function CtaBand({ photo, title = 'Ready to make property move?', text = 'Create an account in a few minutes.', to = '/signup', label = 'Get started' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 1.25, 1.08]);
  return (
    <section className="section ctaband-wrap">
      <div className="wrap">
        <div ref={ref} className="ctaband graded">
          <motion.img src={photo.src(1920)} alt={photo.alt} loading="lazy" style={{ y, scale }} />
          <span className="ctaband-shade" aria-hidden="true" />
          <div className="ctaband-in">
            <RevealWords as="h2" text={title} className="ctaband-title" />
            <Reveal delay={4} className="glass ctaband-card">
              <p>{text}</p>
              <Magnetic>
                <Btn to={to}>{label}</Btn>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Rows whose photo opens from a pill to a full panel when you hover or focus them. */
export function ExpandRows({ rows }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="xrows">
      {rows.map((r, i) => (
        <Reveal
          as="li"
          delay={i}
          key={r.name}
          className={`xrow${open === i ? ' is-open' : ''}`}
          onPointerEnter={() => setOpen(i)}
          onFocusCapture={() => setOpen(i)}
        >
          <Link to={r.to} className="xrow-link">
            <span className="xrow-name">{r.name}</span>
            <span className="xrow-text">{r.text}</span>
            <span className="xrow-img graded">
              <img src={r.photo.src(960)} alt={r.photo.alt} loading="lazy" />
            </span>
            <span className="xrow-go" aria-hidden="true">
              <ArrowUpRight weight="bold" />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

/** Cards that pin one after another and stack, the ones underneath easing back as new ones land. */
export function StickyStack({ items, render }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <div ref={ref} className="stack">
      {items.map((it, i) => (
        <StackCard key={i} i={i} n={items.length} p={scrollYProgress}>
          {render(it, i)}
        </StackCard>
      ))}
    </div>
  );
}
function StackCard({ i, n, p, children }) {
  const reduce = useReducedMotion();
  const target = 1 - (n - i) * 0.035;
  const scale = useTransform(p, [i / n, 1], [1, reduce ? 1 : target]);
  const dim = useTransform(p, [i / n, 1], [0, reduce || i === n - 1 ? 0 : 0.35]);
  return (
    <div className="stack-slot" style={{ top: `calc(var(--header-h) + 28px + ${i * 26}px)` }}>
      <motion.div className="stack-card" style={{ scale }}>
        {children}
        <motion.span className="stack-dim" style={{ opacity: dim }} aria-hidden="true" />
      </motion.div>
    </div>
  );
}

/** Vertical scroll drives a horizontal track while the section is pinned (desktop). Phones swipe instead. */
export function HorizontalPan({ head, children }) {
  const sec = useRef(null);
  const track = useRef(null);
  const reduce = useReducedMotion();
  const [dist, setDist] = useState(0);
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const update = () => {
      setWide(mq.matches);
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    update();
    const ro = new ResizeObserver(update);
    if (track.current) ro.observe(track.current);
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const pan = wide && !reduce;
  return (
    <section ref={sec} className={`hpan${pan ? ' is-pan' : ''}`} style={pan ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className="hpan-sticky">
        <div className="wrap hpan-head">{head}</div>
        <motion.div ref={track} className="hpan-track" style={pan ? { x } : undefined}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/** Section heading: words rise in, optional line of body copy fades up underneath. */
export function SecHead({ title, text, accent, className = '' }) {
  return (
    <div className={`sec-head ${className}`}>
      <RevealWords text={title} accent={accent} />
      {text && (
        <Reveal as="p" delay={3} className="lead">
          {text}
        </Reveal>
      )}
    </div>
  );
}
