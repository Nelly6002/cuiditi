import { AirplaneTilt, Armchair, Briefcase, Flag, GraduationCap, Heart } from '@phosphor-icons/react';
import { photos } from './photos.js';

// Copy for the six audiences comes from the original cuiditi.com Cuid Packs section.
export const AUDIENCES = [
  { name: 'Students', Icon: GraduationCap, lead: 'Start building from campus with small tickets.', text: 'Own verified fractions while you study.' },
  { name: 'Corps members', Icon: Flag, lead: 'Serving with NYSC?', text: 'Put part of your allowance into real assets before posting ends.' },
  { name: 'Working class', Icon: Briefcase, lead: 'Salary earners grow wealth without buying a full plot.', text: 'Stack Cuids monthly like savings.' },
  { name: 'Newly weds', Icon: Heart, lead: 'Build a home plan together.', text: 'Transparent records and shared stakes from day one.' },
  { name: 'Diasporans', Icon: AirplaneTilt, lead: 'Buy into Nigerian property from abroad.', text: 'Proof, escrow and a live view of your portfolio.', photo: photos.lagoon },
  { name: 'Retirees', Icon: Armchair, lead: 'Turn retirement savings into yield.', text: 'Property stakes that pay, with a clear payout history.', photo: photos.abuja },
];

export const CORRIDORS = [
  { name: 'Lekki', text: 'The fast-growing corridor east of the islands.', photo: photos.lekki, to: '/trade' },
  { name: 'Lagos Island', text: 'Dense, established and always trading.', photo: photos.island, to: '/trade' },
  { name: 'Eko Atlantic', text: 'New land reclaimed from the Atlantic.', photo: photos.eko, to: '/trade' },
  { name: 'Abuja', text: 'The capital and its growing districts.', photo: photos.abuja, to: '/trade' },
];
