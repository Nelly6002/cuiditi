# Cuiditi

Redesign of [cuiditi.com](https://cuiditi.com): buy, verify and trade Nigerian property.

Built with React 18, Vite, React Router, Framer Motion, Lenis smooth scrolling and Phosphor icons.

## Run it

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5190.

```bash
npm run build
npm run preview
```

## Structure

- `src/App.jsx` sets up the router, Lenis, the intro and the page transitions.
- `src/components/Motion.jsx` holds the shared motion pieces: word reveals, photo wipes, scroll-lit text, counters, the odometer, magnetic buttons, card spotlights and the velocity marquee.
- `src/components/Blocks.jsx` holds the page blocks: photo hero, CTA band, expanding rows, sticky stack, horizontal pan and the page curtain.
- `src/pages/` has one file per route.
- `src/data/photos.js` lists every photo with its credit and licence.
- `src/assets/photos/` stores each photo as `.webp` in three widths: `-lg` (1920), `-md` (960) and `-sm` (480).

All motion respects the system "reduce motion" setting.

## Still placeholder

- The Verify title records, the Secure confirmation and the Trade chart use sample data.
- The sign in and sign up forms validate but do not call a backend yet.
- There are no privacy policy or terms pages yet.

## Photo credits

The photos come from Wikimedia Commons under CC BY, CC BY-SA and CC0 licences. Most of these licences require attribution, so keep the `/credits` page whenever the photos are used. See `src/data/photos.js` for each author and licence.

## Deploy

Vercel builds the site from `main` using `vercel.json`. Every push to `main` deploys to production.
