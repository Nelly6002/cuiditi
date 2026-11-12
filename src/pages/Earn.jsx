import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Broadcast, Camera, ClipboardText, UsersThree } from '@phosphor-icons/react';
import { usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { Btn, CtaBand, Page, PageHero, SecHead } from '../components/Blocks.jsx';
import { Magnetic, Reveal, spotlight } from '../components/Motion.jsx';

const TASKS = [
  { Icon: UsersThree, t: 'Buyer showings', d: 'Bring capital onto the plot and walk buyers through it.', cls: 'b-photo', photo: photos.island },
  { Icon: ClipboardText, t: 'Listing readiness', d: 'Prepare property for the market.', cls: 'b-2' },
  { Icon: Camera, t: 'Site documentation', d: 'Photos and records that prove a listing is real.', cls: 'b-2' },
  { Icon: Broadcast, t: 'Market activation', d: 'Keep demand moving across the listings you cover.', cls: 'b-4 b-tint' },
];

export default function Earn() {
  usePageTitle('Earn with property work');
  return (
    <Page>
      <PageHero
        photo={photos.eko}
        eyebrow="Cuid Pro Cuo"
        title="Get paid for work that moves property."
        accent={['paid']}
        lead="Take on live opportunities across the real estate market. Cleaner listings, faster showings and deals that actually settle."
      >
        <Magnetic>
          <Btn to="/signup">Join opportunities</Btn>
        </Magnetic>
      </PageHero>
      <section className="section">
        <div className="wrap">
          <SecHead title="Hundreds of paid tasks, every day." />
          <div className="bento">
            {TASKS.map(({ Icon, t, d, cls, photo }, i) => (
              <Reveal key={t} delay={i % 3} className={`bento-cell ${cls}`}>
                <div className={`card spot bento-link${photo ? ' graded' : ''}`} onPointerMove={spotlight}>
                  {photo && <img className="bento-bg" src={photo.src(1280)} alt={photo.alt} loading="lazy" />}
                  <span className="ic bento-ic">
                    <Icon weight="duotone" />
                  </span>
                  <span className="bento-txt">
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <LiquidMeter />
      <CtaBand photo={photos.lekki} title="Work that unlocks liquidity." label="Join opportunities" />
    </Page>
  );
}

const STAGES = [
  ['Lock in', 'Pick a task and commit to it.'],
  ['Deliver', 'Do the work and submit your proof.'],
  ['Get paid', 'Cash lands as soon as the work is accepted.'],
];

/** A tank that fills from "illiquid" to "liquid" as you scroll, lighting each stage on the way. */
function LiquidMeter() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const level = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);
  return (
    <section className="section section-tight">
      <div className="wrap">
        <SecHead title="From illiquid to paid." />
        <div ref={ref} className="liquid">
          <div className="liquid-tank" aria-hidden="true">
            <motion.span className="liquid-fill" style={{ scaleX: level }} />
            <span className="liquid-end liquid-start">Illiquid</span>
            <span className="liquid-end liquid-stop">Liquid</span>
          </div>
          <div className="liquid-stages">
            {STAGES.map(([t, d], i) => (
              <Stage key={t} t={t} d={d} at={(i + 1) / (STAGES.length + 0.4)} p={level} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function Stage({ t, d, at, p }) {
  const o = useTransform(p, [at - 0.15, at], [0.35, 1]);
  const y = useTransform(p, [at - 0.15, at], [12, 0]);
  return (
    <motion.div className="liquid-stage" style={{ opacity: o, y }}>
      <h3>{t}</h3>
      <p>{d}</p>
    </motion.div>
  );
}
