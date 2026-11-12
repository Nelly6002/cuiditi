import { Fragment, useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { EASE } from '../lib/site.js';

const bare = (w) => w.replace(/[.,'’?]/g, '').toLowerCase();
const VIEW = { once: true, margin: '0px 0px -10% 0px' };

/** Fades and lifts its content in when it scrolls into view. `delay` is in steps of 80ms. */
export function Reveal({ as = 'div', delay = 0, y = 26, className, children, ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.9, ease: EASE, delay: delay * 0.08 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Words rise out of masks one after another, on scroll or on cue with `show`. */
export function RevealWords({ text, as = 'h2', className = '', accent = [], delay = 0, show }) {
  const Tag = motion[as];
  const words = text.split(' ');
  const accented = new Set(accent.map(bare));
  const trigger = show === undefined ? { whileInView: 'shown', viewport: VIEW } : { animate: show ? 'shown' : 'hidden' };
  return (
    <Tag
      className={`reveal-words ${className}`}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.055, delayChildren: delay * 0.08 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <motion.span
              className={accented.has(bare(w)) ? 'accent' : undefined}
              variants={{
                hidden: { y: '115%', rotate: 5 },
                shown: { y: 0, rotate: 0, transition: { duration: 1, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Photo that wipes open from a smaller crop as it enters, then drifts against the scroll. */
export function RevealImage({ photo, w = 1280, className = '', eager, children }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);
  return (
    <motion.div
      ref={ref}
      className={`frame graded ${className}`}
      initial={{ clipPath: 'inset(14% 10% 14% 10% round 18px)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 18px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      <motion.img src={photo.src(w)} alt={photo.alt} loading={eager ? 'eager' : 'lazy'} style={{ y, scale: 1.18 }} />
      {children}
    </motion.div>
  );
}

/** Parallax wrapper: moves its child against the scroll by `amount` percent. */
export function Parallax({ amount = 10, className, children }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : [`${amount}%`, `-${amount}%`]);
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/**
 * A statement that lights up word by word as it scrolls through the viewport.
 * `parts` mixes strings and photos; photos become small image pills inside the sentence.
 */
export function ScrubText({ parts, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] });
  const tokens = [];
  parts.forEach((p) =>
    typeof p === 'string' ? p.split(' ').filter(Boolean).forEach((w) => tokens.push({ w })) : tokens.push({ photo: p })
  );
  const n = tokens.length;
  const label = parts.filter((p) => typeof p === 'string').join(' ');
  return (
    <p ref={ref} className={`scrub ${className}`} aria-label={label}>
      {tokens.map((t, i) =>
        t.w ? (
          <ScrubWord key={i} p={scrollYProgress} r={[i / n, (i + 1) / n]} reduce={reduce}>
            {t.w}
          </ScrubWord>
        ) : (
          <ScrubPill key={i} p={scrollYProgress} r={[i / n, (i + 1) / n]} photo={t.photo} reduce={reduce} />
        )
      )}
    </p>
  );
}
function ScrubWord({ p, r, reduce, children }) {
  const opacity = useTransform(p, r, [0.14, 1]);
  return (
    <>
      <motion.span aria-hidden="true" style={{ opacity: reduce ? 1 : opacity }}>
        {children}
      </motion.span>{' '}
    </>
  );
}
function ScrubPill({ p, r, photo, reduce }) {
  const scale = useTransform(p, r, [0.3, 1]);
  const opacity = useTransform(p, r, [0, 1]);
  return (
    <>
      <motion.span className="pill-img" aria-hidden="true" style={reduce ? undefined : { scale, opacity }}>
        <img src={photo.src(330)} alt="" loading="lazy" />
      </motion.span>{' '}
    </>
  );
}

/** Counts up to `to` once in view. Updates the DOM directly, no re-renders. */
export function Counter({ to, prefix = '', suffix = '', duration = 2, decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, VIEW);
  const reduce = useReducedMotion();
  const fmt = (v) =>
    prefix + v.toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = fmt(to);
      return;
    }
    const c = animate(0, to, { duration, ease: EASE, onUpdate: (v) => ref.current && (ref.current.textContent = fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <>
      <span ref={ref} className="tnum" aria-hidden="true">
        {fmt(0)}
      </span>
      <span className="sr-only">{fmt(to)}</span>
    </>
  );
}

/** Odometer: every digit spins through a full turn before landing on its value. */
export function Odometer({ value, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();
  let digit = 0;
  return (
    <span ref={ref} className={`odo ${className}`}>
      <span className="sr-only">{value}</span>
      {value.split('').map((c, i) => {
        if (!/\d/.test(c))
          return (
            <span key={i} className="odo-sep" aria-hidden="true">
              {c}
            </span>
          );
        const d = Number(c);
        const order = digit++;
        return (
          <span key={i} className="odo-col" aria-hidden="true">
            <motion.span
              className="odo-strip"
              initial={{ y: '0em' }}
              animate={inView ? { y: `${-(reduce ? d : 10 + d) * 1.1}em` } : {}}
              transition={{ duration: reduce ? 0 : 2.4, ease: [0.2, 0.9, 0.1, 1], delay: order * 0.08 }}
            >
              {Array.from({ length: 20 }, (_, k) => (
                <span key={k}>{k % 10}</span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/** Pulls its child toward the cursor, then springs back. Mouse only. */
export function Magnetic({ children, strength = 0.32, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const move = (e) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.span ref={ref} className={`magnetic ${className}`} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.span>
  );
}

/** Pointer handler that lights a card's border and surface under the cursor (see .spot in CSS). */
export function spotlight(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Endless strip that speeds up with scroll velocity and flips direction when you scroll back up. */
export function VelocityMarquee({ children, base = -2.4 }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * base * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x }}>
        {[0, 1, 2, 3].map((k) => (
          <div className="marquee-set" key={k}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
