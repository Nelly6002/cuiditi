import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { MAIN, MORE, Logo } from './SiteHeader.jsx';

/** Deep green closing band. The giant wordmark rises letter by letter as the footer scrolls in. */
export default function SiteFooter() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  return (
    <footer ref={ref} className="ftr">
      <div className="wrap ftr-top">
        <div className="ftr-brand">
          <Logo light />
          <p>A jurisdiction first real estate platform for moving property in Nigeria.</p>
        </div>
        <div className="ftr-cols">
          <div>
            <h2 className="ftr-h">Product</h2>
            <ul>
              {MAIN.map(([to, l]) => (
                <li key={to}>
                  <Link to={to}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="ftr-h">Learn</h2>
            <ul>
              {MORE.map(([to, l]) => (
                <li key={to}>
                  <Link to={to}>{l}</Link>
                </li>
              ))}
              <li>
                <Link to="/credits">Photo credits</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="ftr-h">Contact</h2>
            <ul>
              <li>
                <a href="mailto:support@cuiditi.com">support@cuiditi.com</a>
              </li>
              <li>
                <a href="https://wa.me/2347070927044">WhatsApp +234 707 092 7044</a>
              </li>
              <li>
                <Link to="/signin">Sign in</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="ftr-word" aria-hidden="true">
        {'Cuiditi'.split('').map((c, i) => (
          <FooterLetter key={i} c={c} i={i} p={scrollYProgress} reduce={reduce} />
        ))}
      </div>
      <div className="wrap ftr-legal">
        <span>© {new Date().getFullYear()} Cuiditi. All rights reserved.</span>
        <span>Built in Nigeria, for Nigeria and beyond.</span>
      </div>
    </footer>
  );
}

function FooterLetter({ c, i, p, reduce }) {
  const start = 0.25 + i * 0.06;
  const y = useTransform(p, [start, Math.min(start + 0.4, 1)], reduce ? ['0%', '0%'] : ['70%', '0%']);
  return <motion.span style={{ y }}>{c}</motion.span>;
}
