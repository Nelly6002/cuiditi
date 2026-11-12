import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HourglassMedium, MagnifyingGlass, Polygon, SealCheck, UserCheck, Warning } from '@phosphor-icons/react';
import { EASE, usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { Btn, CtaBand, Page, PageHero, SecHead } from '../components/Blocks.jsx';
import { Reveal, RevealWords } from '../components/Motion.jsx';

// Placeholder records for the prototype. Swap for the real registry lookup.
const SAMPLES = {
  'LA-2231-0457': { s: 'ok', label: 'Verified', title: 'Plot 14, Ajah Phase 2', owner: 'Adeyemi Holdings Ltd', area: '648 m²', where: 'Eti-Osa, Lagos', note: 'Title matches the survey plan. No encumbrances on record.', pos: [6.4698, 3.5852] },
  'OG-8810-0092': { s: 'wait', label: 'Pending', title: 'Block C, Lufasi Layout', owner: 'Transfer in progress', area: '450 m²', where: 'Abeokuta South, Ogun', note: 'Consent application filed. Wait for approval before you pay.', pos: [7.1475, 3.3619] },
  'FC-0045-1187': { s: 'bad', label: 'Disputed', title: 'Plot 902, Karsana', owner: 'Two claimants on record', area: '1,200 m²', where: 'Abuja Municipal, FCT', note: 'Competing certificates found. Do not send money.', pos: [9.0765, 7.3986] },
};
const ICON = { ok: SealCheck, wait: HourglassMedium, bad: Warning };
const mapUrl = ([la, lo]) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lo - 0.012},${la - 0.008},${lo + 0.012},${la + 0.008}&layer=mapnik&marker=${la},${lo}`;

const STATES = [
  { key: 'ok', label: 'Verified', what: 'The title matches the registry and the survey plan, and nothing is pending against it.', todo: 'You can pay, ideally through Cuid Cecure escrow.' },
  { key: 'wait', label: 'Pending', what: 'A transfer, consent or registration is still being processed.', todo: 'Wait for approval. Do not release money until it clears.' },
  { key: 'bad', label: 'Disputed', what: 'More than one claim, a court case or a mismatch with the survey was found.', todo: 'Do not send money. Ask the seller to resolve the dispute first.' },
];

export default function Verify() {
  usePageTitle('Verify a title');
  return (
    <Page>
      <PageHero
        photo={photos.skyline}
        eyebrow="Cuid Verify"
        title="See the land before you pay."
        accent={['land']}
        lead="Property fraud wins when buyers skip checks. Look up any Certificate of Occupancy or file number and catch fake titles before you send money."
      />
      <VerifyTool />
      <StatesExplainer />
      <section className="section section-tight">
        <div className="wrap sticky-split">
          <div className="sticky-col">
            <RevealWords text="What a check tells you." />
          </div>
          <ul className="rows big-rows">
            {[
              [UserCheck, 'Who owns it', 'The registered holder and any gaps in the ownership chain.'],
              [Polygon, 'Where it sits', 'The parcel drawn on a live map, with streets around it.'],
              [Warning, 'What is wrong with it', 'Competing certificates, pending transfers and disputes.'],
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
      <CtaBand photo={photos.lagoon} title="Checked it? Now pay safely." text="Hold the money in escrow until the title transfers." to="/secure" label="Secure a payment" />
    </Page>
  );
}

function VerifyTool() {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | found | missing
  const [error, setError] = useState('');
  const [key, setKey] = useState('');
  const [pos, setPos] = useState([6.4698, 3.5852]);

  const run = (raw) => {
    const k = raw.trim().toUpperCase();
    if (!k) return setError('Enter a Certificate of Occupancy or file number.');
    if (!/^[A-Z]{2}-\d{3,5}-\d{3,5}$/.test(k)) return setError('Use the format on your certificate, for example LA-2231-0457.');
    setError('');
    setStatus('loading');
    setKey(k);
    setTimeout(() => {
      const r = SAMPLES[k];
      setStatus(r ? 'found' : 'missing');
      if (r) setPos(r.pos);
    }, 900);
  };
  const r = SAMPLES[key];
  const Icon = r ? ICON[r.s] : null;

  return (
    <section className="section">
      <div className="wrap tool">
        <Reveal className="card tool-panel">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
            }}
          >
            <div className={`field${error ? ' invalid' : ''}`}>
              <label htmlFor="co">C of O or file number</label>
              <input id="co" autoComplete="off" placeholder="LA-2231-0457" value={value} onChange={(e) => setValue(e.target.value)} aria-describedby="co-help co-err" aria-invalid={!!error} />
              <span className="help" id="co-help">
                Found on the certificate or the registry receipt.
              </span>
              <AnimatePresence>
                {error && (
                  <motion.span id="co-err" className="err" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {error}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <Btn type="submit">{status === 'loading' ? 'Checking' : 'Check title'}</Btn>
            <div className="samples">
              <span>Try a sample:</span>
              {Object.entries(SAMPLES).map(([k, v]) => (
                <button
                  type="button"
                  key={k}
                  onClick={() => {
                    setValue(k);
                    run(k);
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </form>

          <div className="result" aria-live="polite">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.p key="idle" className="muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Results appear here. The three samples are placeholder records for this prototype.
                </motion.p>
              )}
              {status === 'loading' && (
                <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="skel" style={{ width: '32%' }} />
                  <div className="skel" style={{ width: '74%', height: 22 }} />
                  <div className="skel" style={{ width: '58%' }} />
                  <div className="skel" style={{ width: '66%' }} />
                </motion.div>
              )}
              {status === 'found' && r && (
                <motion.div key={key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: EASE }}>
                  <motion.span className={`chip chip-${r.s}`} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                    <Icon weight="fill" /> {r.label}
                  </motion.span>
                  <h3 className="result-title">{r.title}</h3>
                  <motion.dl className="result-dl" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.06 } } }}>
                    {[
                      ['Reference', key],
                      ['Owner', r.owner],
                      ['Area', r.area],
                      ['Location', r.where],
                    ].map(([a, b]) => (
                      <motion.div key={a} variants={{ h: { opacity: 0, x: -10 }, s: { opacity: 1, x: 0 } }}>
                        <dt>{a}</dt>
                        <dd>{b}</dd>
                      </motion.div>
                    ))}
                  </motion.dl>
                  <p className="result-note">{r.note}</p>
                </motion.div>
              )}
              {status === 'missing' && (
                <motion.div key="miss" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <span className="chip chip-wait">No record</span>
                  <h3 className="result-title">We could not find {key}</h3>
                  <p className="result-note">Check the number against your certificate. If it is right, ask the seller for the registry receipt before you pay anything.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <motion.div
          className="tool-map"
          initial={{ clipPath: 'inset(10% 8% 10% 8% round 18px)', opacity: 0 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 18px)', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <AnimatePresence mode="popLayout">
            <motion.iframe key={pos.join(',')} title="Parcel map" loading="lazy" src={mapUrl(pos)} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
          </AnimatePresence>
          <div className="tool-legend">
            <span className="chip chip-ok">Verified</span>
            <span className="chip chip-wait">Pending</span>
            <span className="chip chip-bad">Disputed</span>
          </div>
          <span className="tool-scan" aria-hidden="true">
            <MagnifyingGlass weight="bold" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function StatesExplainer() {
  const [active, setActive] = useState('ok');
  const s = STATES.find((x) => x.key === active);
  return (
    <section className="section section-tight">
      <div className="wrap">
        <SecHead title="Three results, three next moves." />
        <Reveal className="card states">
          <div className="seg" role="tablist" aria-label="Check results">
            {STATES.map((x) => (
              <button type="button" key={x.key} role="tab" aria-selected={active === x.key} className="seg-btn" onClick={() => setActive(x.key)}>
                {active === x.key && <motion.span layoutId="seg-pill" className={`seg-pill seg-${x.key}`} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="seg-label">{x.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={s.key} className="states-body" role="tabpanel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
              <div>
                <h3>What it means</h3>
                <p>{s.what}</p>
              </div>
              <div>
                <h3>What to do</h3>
                <p>{s.todo}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
