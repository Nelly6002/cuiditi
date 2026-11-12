import { Files, Ruler, SealCheck } from '@phosphor-icons/react';
import { usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { CtaBand, Page, PageHero, SecHead } from '../components/Blocks.jsx';
import { Reveal, RevealImage, ScrubText, spotlight } from '../components/Motion.jsx';

export default function Values() {
  usePageTitle('Appraised values');
  return (
    <Page>
      <PageHero photo={photos.survey} eyebrow="Cuid Values" title="Appraised values, not inflated quotes." accent={['Appraised']} lead="Every price on Cuiditi is tied to a registered surveyor's appraisal, so you negotiate from evidence." />
      <section className="section">
        <div className="wrap">
          <ScrubText parts={['Too many listings carry prices pumped up by agents.', photos.skyline, 'Quotes built to impress, not to be trusted.', photos.lekki, 'Buyers often learn the real number only after money has moved.']} />
        </div>
      </section>
      <section className="section section-tight">
        <div className="wrap split">
          <RevealImage photo={photos.lekki} className="split-media tall" />
          <div>
            <SecHead title="Negotiate from evidence." text="Cuid Values ties every price to verified records, so you start from the actual value and not a middleman's markup." />
            <ul className="rows">
              {[
                [Ruler, 'Survey grade parcels', 'Boundaries are locked to surveyed beacons.'],
                [SealCheck, 'Appraised by registered surveyors', 'Prices come from appraisals, not agent quotations.'],
                [Files, 'Verified records', 'Each value links back to the title and survey it rests on.'],
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
        </div>
      </section>
      <section className="section section-tight">
        <div className="wrap">
          <SecHead title="Backed by the professional bodies." />
          <div className="bodies">
            {[
              ['SURCON', 'Surveyors Registration Council of Nigeria'],
              ['NIS', 'Nigerian Institution of Surveyors'],
            ].map(([a, b], i) => (
              <Reveal key={a} delay={i} className="card spot body-card" onPointerMove={spotlight}>
                <span className="body-abbr">{a}</span>
                <span className="body-name">{b}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand photo={photos.eko} title="Know the real number first." />
    </Page>
  );
}
