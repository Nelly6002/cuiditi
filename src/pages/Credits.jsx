import { ArrowUpRight } from '@phosphor-icons/react';
import { usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { Page, PageHero } from '../components/Blocks.jsx';
import { Reveal } from '../components/Motion.jsx';

export default function Credits() {
  usePageTitle('Photo credits');
  return (
    <Page>
      <PageHero photo={photos.lagoon} title="Photo credits." lead="The photos on this site come from Wikimedia Commons. Thank you to the photographers below." />
      <section className="section">
        <div className="wrap">
          <ul className="credits">
            {Object.entries(photos).map(([k, p], i) => (
              <Reveal as="li" key={k} delay={i % 4} className="credit">
                <span className="credit-img graded">
                  <img src={p.src(330)} alt="" loading="lazy" />
                </span>
                <span className="credit-txt">
                  <b>{p.title}</b>
                  <span className="muted">
                    {p.credit}, {p.license}
                  </span>
                </span>
                <a className="tlink" href={p.page} target="_blank" rel="noreferrer">
                  Source <ArrowUpRight weight="bold" />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </Page>
  );
}
