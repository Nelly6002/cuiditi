import { useRef } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Bank, Check, Fingerprint, Megaphone, PuzzlePiece, X } from '@phosphor-icons/react';
import { EASE, usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { CtaBand, Page, PageHero, SecHead } from '../components/Blocks.jsx';
import { Reveal, RevealImage, RevealWords } from '../components/Motion.jsx';

export default function Shares() {
  usePageTitle('Cuid Shares');
  return (
    <Page>
      <PageHero
        photo={photos.lekki}
        eyebrow="Cuid Shares"
        title="Own property in small pieces."
        accent={['pieces.']}
        lead="Tokenization splits one listing into Cuids, so hundreds of people can buy in, trade out and set the price on a live market."
      />
      <section className="section">
        <div className="wrap">
          <SecHead title="One property. Many Cuids." text="Scroll to split this plot into the pieces people actually buy. The highlighted ones could be yours." />
          <Splitter photo={photos.island} />
        </div>
      </section>
      <Compare />
      <section className="section section-tight">
        <div className="wrap sticky-split">
          <div className="sticky-col">
            <RevealWords text="Built for how Nigerians pay and own." />
          </div>
          <ul className="rows big-rows">
            {[
              [PuzzlePiece, 'Own in bits', 'Buy Cuids the way you buy data. Stack small, grow big.'],
              [Fingerprint, 'Prove ownership', 'Your stake lives on ledger records you can show anyone.'],
              [Megaphone, 'Trade in the open', 'Sell to another buyer on the platform instead of hiding in private chats.'],
              [Bank, 'Local payment rails', 'Paystack in, regulated escrow, verification on the map.'],
            ].map(([Icon, t, d], i) => (
              <Reveal as="li" delay={i} key={t} className="row">
                <span className="ic">
                  <Icon weight="duotone" />
                </span>
                <span>
                  <b>{t}</b>
                  <span>{d}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section-tight">
        <div className="wrap split">
          <RevealImage photo={photos.skyline} className="split-media" />
          <div>
            <SecHead title="Proven in other markets." text="Dubai and Singapore already do this on regulated rails. Building fractions sell in 48 hours and ownership settles in under 3 minutes. Cuiditi brings that liquidity home." />
          </div>
        </div>
      </section>
      <CtaBand photo={photos.abuja} title="Start with ₦1,000." text="Pick a verified parcel and buy your first Cuids." />
    </Page>
  );
}

const COLS = 10;
const ROWS = 6;
const MINE = new Set([13, 14, 24, 37, 46]);

/** One photo cut into a grid. As you scroll the tiles drift apart and a few light up as "yours". */
function Splitter({ photo }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 45%'] });
  const p = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(p, 'change', (v) => ref.current?.style.setProperty('--p', reduce ? 1 : v));
  const url = photo.src(1600);
  return (
    <div ref={ref} className="frag" style={{ '--p': reduce ? 1 : 0, '--cols': COLS }} role="img" aria-label={`${photo.alt}, split into a grid of small shares`}>
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        return (
          <span
            key={i}
            className={`frag-tile${MINE.has(i) ? ' is-mine' : ''}`}
            style={{
              '--c': c - (COLS - 1) / 2,
              '--r': r - (ROWS - 1) / 2,
              '--k': ((i * 37) % 11) / 10,
              backgroundImage: `url(${url})`,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
}

function Compare() {
  return (
    <section className="section section-tight">
      <div className="wrap compare">
        <Reveal className="card compare-card">
          <span className="chip chip-bad">Today</span>
          <h3>Most Nigerian property stays frozen.</h3>
          <ul>
            {['Deals take 90 to 180 days.', 'Buyers need the full plot price up front.', 'Sellers wait in private chats with no open bid.'].map((t, i) => (
              <li key={t}>
                <X weight="bold" className="x" />
                <span className="strike">
                  {t}
                  <motion.span className="strike-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -15% 0px' }} transition={{ duration: 0.7, ease: EASE, delay: 0.6 + i * 0.25 }} />
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="card compare-card compare-good" delay={1}>
          <span className="chip chip-ok">On Cuiditi</span>
          <h3>One property, many Cuids.</h3>
          <ul>
            {['Buy a fraction from ₦1,000.', 'Resell to another buyer on the platform.', 'The price is set openly by the market.'].map((t, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '0px 0px -15% 0px' }} transition={{ duration: 0.6, ease: EASE, delay: 1.2 + i * 0.2 }}>
                <motion.span className="tick" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 1.3 + i * 0.2 }}>
                  <Check weight="bold" />
                </motion.span>
                {t}
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
