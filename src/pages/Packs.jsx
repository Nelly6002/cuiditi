import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { AUDIENCES } from '../data/content.js';
import { Btn, CtaBand, Page, PageHero, SecHead } from '../components/Blocks.jsx';
import { Reveal } from '../components/Motion.jsx';

const KINDS = [
  ['Investment picks', 'Curated, verified properties chosen for steady yield.'],
  ['Sales bundles', 'Groups of listings packaged so you can buy in one move.'],
  ['Property plans', 'Pay toward a plot or home in stages that match your income.'],
];

export default function Packs() {
  usePageTitle('Cuid Packs');
  const [i, setI] = useState(0);
  const a = AUDIENCES[i];
  return (
    <Page>
      <PageHero photo={photos.island} eyebrow="Cuid Packs" title="Invest and buy your way." accent={['your']} lead="Not one size fits all. Packs are matched to how Nigerians actually earn, save and close deals." />
      <section className="section">
        <div className="wrap">
          <SecHead title="Who are you buying as?" />
          <div className="aud-tabs">
            <div className="aud-list" role="tablist" aria-label="Audiences" aria-orientation="vertical">
              {AUDIENCES.map((x, k) => (
                <button
                  type="button"
                  key={x.name}
                  role="tab"
                  id={`aud-tab-${k}`}
                  aria-selected={i === k}
                  aria-controls="aud-panel"
                  tabIndex={i === k ? 0 : -1}
                  className="aud-tab"
                  onClick={() => setI(k)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                      e.preventDefault();
                      const n = (k + 1) % AUDIENCES.length;
                      setI(n);
                      document.getElementById(`aud-tab-${n}`)?.focus();
                    }
                    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                      e.preventDefault();
                      const n = (k - 1 + AUDIENCES.length) % AUDIENCES.length;
                      setI(n);
                      document.getElementById(`aud-tab-${n}`)?.focus();
                    }
                  }}
                >
                  {i === k && <motion.span layoutId="aud-pill" className="aud-pill" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                  <span className="aud-tab-in">
                    <x.Icon weight={i === k ? 'fill' : 'duotone'} />
                    {x.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="aud-panel card" id="aud-panel" role="tabpanel" aria-labelledby={`aud-tab-${i}`}>
              <AnimatePresence mode="wait">
                <motion.div key={a.name} className="aud-panel-in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: EASE }}>
                  <motion.span className="aud-big-ic" initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
                    <a.Icon weight="duotone" />
                  </motion.span>
                  <h3>{a.name}</h3>
                  <p className="aud-panel-lead">{a.lead}</p>
                  <p className="muted">{a.text}</p>
                  <Btn to="/signup">Get started</Btn>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-tight">
        <div className="wrap">
          <SecHead title="Three kinds of Pack." />
          <ol className="kinds">
            {KINDS.map(([t, d], k) => (
              <Reveal as="li" key={t} delay={k} className="kind">
                <span className="kind-t">{t}</span>
                <span className="kind-d">{d}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand photo={photos.lagoon} title="Pick the Pack that fits you." />
    </Page>
  );
}
