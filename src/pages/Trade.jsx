import { motion } from 'framer-motion';
import { ArrowsLeftRight, Binoculars, Coins, Handshake, TrendUp } from '@phosphor-icons/react';
import { EASE, usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { CORRIDORS } from '../data/content.js';
import { Btn, CtaBand, ExpandRows, Page, PageHero, SecHead, StickyStack } from '../components/Blocks.jsx';
import { Counter, Magnetic, Reveal } from '../components/Motion.jsx';

export default function Trade() {
  usePageTitle('Trade property');
  return (
    <Page>
      <PageHero photo={photos.market} eyebrow="Cuid Trade" title="Day trade property like water." accent={['water.']} lead="Buy dips on live markets, sell into strength the same week, and earn from yield, trades and agent commissions in one account.">
        <Magnetic>
          <Btn to="/signup">Get started</Btn>
        </Magnetic>
      </PageHero>
      <section className="section">
        <div className="wrap split">
          <div>
            <SecHead title="Property that moves every day." text="A new income stream for traders, brokers and side hustlers who read the market. Every parcel is verified before it is listed." />
          </div>
          <WeekChart />
        </div>
      </section>
      <section className="section section-tight">
        <div className="wrap">
          <SecHead title="Four ways to work the market." />
          <StickyStack
            items={WAYS}
            render={({ Icon, t, d, photo }) => (
              <div className="step-card">
                <div className="step-txt">
                  <span className="ic">
                    <Icon weight="duotone" />
                  </span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
                <div className="step-img graded">
                  <img src={photo.src(1280)} alt={photo.alt} loading="lazy" />
                </div>
              </div>
            )}
          />
        </div>
      </section>
      <section className="section section-tight">
        <div className="wrap">
          <SecHead title="Spot hot areas before the crowd." />
          <ExpandRows rows={CORRIDORS} />
        </div>
      </section>
      <CtaBand photo={photos.skyline} title="Read the market, then trade it." />
    </Page>
  );
}

const WAYS = [
  { Icon: ArrowsLeftRight, t: 'Flip', d: 'Buy low and sell high on listings, sometimes in the same week.', photo: photos.market },
  { Icon: Coins, t: 'Rent yield', d: 'Collect rent while your positions are funded.', photo: photos.island },
  { Icon: Binoculars, t: 'Scout', d: 'Spot hot LGAs before the crowd and position early.', photo: photos.lekki },
  { Icon: Handshake, t: 'Broker', d: 'Close clients with live, verified inventory.', photo: photos.skyline },
];

// Example week for the chart. Clearly labelled as an example in the UI.
const WEEK = [0.8, 3.4, 2.6, 7.9, 12.4];
const DAYS = ['M', 'T', 'W', 'T', 'F'];

/** Sample week: the line draws itself, the area fades in and the total counts up. */
function WeekChart() {
  const W = 460;
  const H = 200;
  const max = 14;
  const pts = WEEK.map((v, i) => [20 + (i * (W - 40)) / (WEEK.length - 1), H - 16 - (v / max) * (H - 40)]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts.at(-1)[0]},${H} L${pts[0][0]},${H} Z`;
  const [lx, ly] = pts.at(-1);
  const view = { once: true, margin: '0px 0px -15% 0px' };
  return (
    <Reveal className="card chart" delay={1}>
      <div className="chart-head">
        <span className="chip chip-ok">
          <TrendUp weight="bold" /> Example week
        </span>
        <span className="muted">Sample data</span>
      </div>
      <div className="chart-total">
        <Counter to={12.4} prefix="+₦" suffix="k" decimals={1} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img" aria-label="Example gains rising from Monday to Friday">
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={area} fill="url(#area)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={view} transition={{ duration: 1, delay: 1.2 }} />
        <motion.path d={line} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={view} transition={{ duration: 1.8, ease: EASE, delay: 0.2 }} />
        {pts.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="4.5" className="chart-dot" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={view} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.3 + i * 0.32 }} />
        ))}
        <circle cx={lx} cy={ly} r="10" className="chart-pulse" />
      </svg>
      <div className="chart-days" aria-hidden="true">
        {DAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </Reveal>
  );
}
