import { ChartPieSlice, LockSimple, Prohibit } from '@phosphor-icons/react';
import { usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { Btn, CtaBand, Page, PageHero } from '../components/Blocks.jsx';
import { Magnetic, Odometer, Reveal, RevealWords } from '../components/Motion.jsx';

export default function Cuids() {
  usePageTitle('Cuids');
  return (
    <Page>
      <PageHero photo={photos.abuja} tall eyebrow="Cuids" title="Limited supply. Forever." accent={['Forever.']} lead="The earth has about 150 million square kilometres of land. Cuiditi mints one Cuid for each, then the supply locks.">
        <Magnetic>
          <Btn to="/signup">Claim Cuids</Btn>
        </Magnetic>
      </PageHero>
      <section className="cuids-band">
        <div className="wrap">
          <div className="cuids-num">
            <Odometer value="150,000,000" />
          </div>
          <div className="cuids-foot">
            <Reveal as="p" className="lead">
              Cuids for 150 million km² of land. When demand rises, nobody can print more.
            </Reveal>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap sticky-split">
          <div className="sticky-col">
            <RevealWords text="Scarce by design." />
          </div>
          <ul className="rows big-rows">
            {[
              [LockSimple, 'The cap never moves', '150 million Cuids for 150 million km² of land, fixed from day one.'],
              [Prohibit, 'No hidden minting', 'There is no switch to make more. The supply is locked.'],
              [ChartPieSlice, 'No surprise dilution', 'More people join, the same 150 million Cuids. That is the scarcity.'],
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
      <CtaBand photo={photos.market} title="Start earning your own Cuids." text="More will never be minted." label="Claim Cuids" />
    </Page>
  );
}
