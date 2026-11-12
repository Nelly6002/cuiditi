import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowsLeftRight,
  Coins,
  Drop,
  Fingerprint,
  Handshake,
  LockKey,
  MagnifyingGlass,
  MapPinArea,
  Ruler,
  SealCheck,
  TrendUp,
  UserPlus,
  Wallet,
} from '@phosphor-icons/react';
import { EASE, usePageTitle, useSite } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { AUDIENCES, CORRIDORS } from '../data/content.js';
import { Btn, CtaBand, ExpandRows, HorizontalPan, Page, SecHead, StickyStack, TextLink } from '../components/Blocks.jsx';
import { Counter, Magnetic, Odometer, Reveal, RevealImage, RevealWords, ScrubText, VelocityMarquee, spotlight } from '../components/Motion.jsx';
import CheckSequence from '../components/CheckSequence.jsx';

export default function Home() {
  usePageTitle(null);
  return (
    <Page>
      <HomeHero />
      <VelocityMarquee>
        {['Verify', 'Secure', 'Shares', 'Trade', 'Earn', 'Values'].map((w) => (
          <span className="marquee-item" key={w}>
            {w}
            <Drop weight="fill" />
          </span>
        ))}
      </VelocityMarquee>
      <Statement />
      <VerifyFeature />
      <WalletBento />
      <section className="section section-tight">
        <div className="wrap">
          <SecHead title="Markets we watch." text="Spot the corridors where demand is rising before listings go live." />
          <ExpandRows rows={CORRIDORS} />
        </div>
      </section>
      <CuidsBand />
      <Audiences />
      <HowItWorks />
      <CtaBand photo={photos.bridge} />
    </Page>
  );
}

/** Hero: the photo sits in a rounded frame that pulls in as you scroll, with glass cards floating on top. */
function HomeHero() {
  const ref = useRef(null);
  const { introDone } = useSite();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const clip = useTransform(
    scrollYProgress,
    [0, 0.8],
    reduce
      ? ['inset(10px 10px 0px 10px round 28px)', 'inset(10px 10px 0px 10px round 28px)']
      : ['inset(10px 10px 0px 10px round 28px)', 'inset(90px 72px 140px 72px round 44px)']
  );
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '20%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.16]);
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '55%']);
  const textO = useTransform(scrollYProgress, [0, 0.5], [1, reduce ? 1 : 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-60%']);
  const fade = (d) => ({
    initial: { opacity: 0, y: 20 },
    animate: introDone ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, ease: EASE, delay: d },
  });
  const float = (d) => ({
    initial: { opacity: 0, y: 60, scale: 0.92 },
    animate: introDone ? { opacity: 1, y: 0, scale: 1 } : {},
    transition: { type: 'spring', stiffness: 70, damping: 16, delay: d },
  });
  return (
    <section ref={ref} className="hhero">
      <motion.div className="hhero-frame" style={{ clipPath: clip }}>
        <motion.div className="phero-move" style={{ y: imgY, scale: imgScale }}>
          <motion.img
            className="phero-img"
            src={photos.lagoon.src(1920)}
            alt={photos.lagoon.alt}
            fetchpriority="high"
            initial={{ scale: 1.25 }}
            animate={introDone ? { scale: 1 } : {}}
            transition={{ duration: 2.6, ease: EASE }}
          />
        </motion.div>
        <span className="phero-shade" aria-hidden="true" />
      </motion.div>

      <motion.div className="hhero-cards" style={{ y: cardY }} aria-hidden="true">
        <motion.div className="glass hcard hcard-a" {...float(0.9)}>
          <motion.div className="hcard-float" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <span className="hcard-ring">
              <svg viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="20" className="ring-bg" />
                <motion.circle cx="22" cy="22" r="20" className="ring-fg" initial={{ pathLength: 0 }} animate={introDone ? { pathLength: 1 } : {}} transition={{ duration: 1.6, delay: 1.3, ease: EASE }} />
              </svg>
              <SealCheck weight="fill" />
            </span>
            <span>
              <b>Title check complete</b>
              <small>C of O matched to the parcel</small>
            </span>
          </motion.div>
        </motion.div>
        <motion.div className="glass hcard hcard-b" {...float(1.1)}>
          <motion.div className="hcard-float" animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
            <span className="hcard-ic">
              <Coins weight="fill" />
            </span>
            <span>
              <b>From ₦1,000</b>
              <small>Own a share of a verified plot</small>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="wrap hhero-content" style={{ y: textY, opacity: textO }}>
        <RevealWords as="h1" text="Buy, verify and trade Nigerian property." accent={['property.']} show={introDone} delay={2} className="hhero-title" />
        <motion.p className="phero-lead" {...fade(0.6)}>
          Start from ₦1,000. Check any title before you pay and sell when you choose.
        </motion.p>
        <motion.div className="phero-actions" {...fade(0.78)}>
          <Magnetic>
            <Btn to="/signup">Get started</Btn>
          </Magnetic>
          <Btn to="/verify" variant="ghost">
            Try a title check
          </Btn>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Statement() {
  return (
    <section className="section">
      <div className="wrap">
        <ScrubText
          parts={['Your cash should not freeze in land.', photos.lekki, 'Check the title,', photos.survey, 'lock the payment', photos.bridge, 'and sell the day you need out.']}
        />
        <div className="stats">
          <Reveal className="stat">
            <span className="stat-num">
              <Counter to={100} prefix="₦" suffix="B+" />
            </span>
            <p>lost to property fraud in Nigeria every year, according to the EFCC.</p>
          </Reveal>
          <Reveal className="stat" delay={1}>
            <span className="stat-num">
              <Counter to={90} />
              <span className="stat-dash">-</span>
              <Counter to={180} />
            </span>
            <p>days a typical property deal takes to close. Your money waits the whole time.</p>
          </Reveal>
          <Reveal className="stat" delay={2}>
            <span className="stat-num">
              <Counter to={1000} prefix="₦" />
            </span>
            <p>is all it takes to own a share of a verified plot on Cuiditi.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function VerifyFeature() {
  return (
    <section className="section section-tight">
      <div className="wrap split">
        <RevealImage photo={photos.lekki} className="split-media tall">
          <CheckSequence className="split-overlay" />
        </RevealImage>
        <div>
          <SecHead title="See the land before you pay." accent={['land']} />
          <ul className="rows">
            {[
              [MagnifyingGlass, 'Look up any title', 'Enter a Certificate of Occupancy or file number.'],
              [MapPinArea, 'See the parcel on a live map', 'Check boundaries and ownership before you commit.'],
              [LockKey, 'Pay through escrow', 'Funds are released only when your conditions are met.'],
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
          <Reveal delay={3} className="mt-32">
            <TextLink to="/verify">Open Verify</TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const BENTO = [
  { to: '/shares', Icon: Coins, t: 'Buy fractions from ₦1,000', d: 'Own a share of a verified plot instead of paying for all of it up front.', cls: 'b-photo', photo: photos.market },
  { to: '/trade', Icon: TrendUp, t: 'Earn yield while you wait', d: 'Collect your share of rent on the properties you hold.', cls: 'b-2' },
  { to: '/trade', Icon: ArrowsLeftRight, t: 'Trade on live markets', d: 'Flip stakes and follow demand in fast corridors.', cls: 'b-2' },
  { to: '/verify', Icon: Fingerprint, t: 'Verify titles and ownership', d: 'Run the checks a lawyer would, in minutes.', cls: 'b-2 b-tint' },
  { to: '/earn', Icon: Handshake, t: 'Get paid for property work', d: 'Take paid tasks that prepare and move listings.', cls: 'b-2' },
  { to: '/values', Icon: Ruler, t: 'Prices backed by registered surveyors', d: 'Negotiate from appraised values instead of agent quotes.', cls: 'b-wide' },
];

function WalletBento() {
  return (
    <section className="section section-tight">
      <div className="wrap">
        <SecHead title="One wallet for every property move." text="Buy, earn, trade and sell without leaving the app." />
        <div className="bento">
          {BENTO.map(({ to, Icon, t, d, cls, photo }, i) => (
            <Reveal key={t} delay={i % 3} className={`bento-cell ${cls}`}>
              <Link to={to} className={`card spot bento-link${photo ? ' graded' : ''}`} onPointerMove={spotlight}>
                {photo && <img className="bento-bg" src={photo.src(1280)} alt={photo.alt} loading="lazy" />}
                <span className="ic bento-ic">
                  <Icon weight="duotone" />
                </span>
                <span className="bento-txt">
                  <h3>{t}</h3>
                  <p>{d}</p>
                </span>
                <span className="bento-go" aria-hidden="true">
                  <ArrowUpRight weight="bold" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CuidsBand() {
  return (
    <section className="cuids-band">
      <div className="wrap">
        <p className="eyebrow">Cuids</p>
        <div className="cuids-num">
          <Odometer value="150,000,000" />
        </div>
        <div className="cuids-foot">
          <Reveal as="p" className="lead">
            One Cuid for each of the roughly 150 million square kilometres of land on earth. Then the supply locks for good.
          </Reveal>
          <Reveal delay={2}>
            <TextLink to="/cuids">How Cuids work</TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Audiences() {
  return (
    <HorizontalPan
      head={
        <div className="hpan-headrow">
          <RevealWords text="Invest and buy your way." />
          <Reveal delay={3}>
            <TextLink to="/packs">See all Packs</TextLink>
          </Reveal>
        </div>
      }
    >
      {AUDIENCES.map(({ name, Icon, lead, text, photo }, i) => (
        <article key={name} className={`aud-card${photo ? ' aud-photo graded' : i % 2 ? ' aud-tint' : ''}`} onPointerMove={spotlight}>
          {photo && <img src={photo.src(960)} alt={photo.alt} loading="lazy" />}
          <span className="aud-ic">
            <Icon weight="duotone" />
          </span>
          <div className="aud-txt">
            <h3>{name}</h3>
            <p className="aud-lead">{lead}</p>
            <p>{text}</p>
          </div>
        </article>
      ))}
    </HorizontalPan>
  );
}

const STEPS = [
  { Icon: UserPlus, t: 'Create your account', d: 'Sign up with your email in a couple of minutes.', photo: photos.skyline },
  { Icon: Wallet, t: 'Fund your wallet', d: 'Add money by bank transfer or card.', photo: photos.island },
  { Icon: ArrowsLeftRight, t: 'Invest, trade or list', d: 'Pick a verified property, trade a position or list your own.', photo: photos.market },
  { Icon: Coins, t: 'Get paid', d: 'Withdraw yield and profit straight to your bank.', photo: photos.lagoon },
];

function HowItWorks() {
  return (
    <section className="section">
      <div className="wrap">
        <SecHead title="Four steps from sign up to payout." text="No months of paperwork. Create an account, fund it and start putting capital to work." />
        <StickyStack
          items={STEPS}
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
  );
}
