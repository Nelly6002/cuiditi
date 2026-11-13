# Cuiditi

Redesign of [cuiditi.com](https://cuiditi.com): buy, verify and trade Nigerian property.

Built with Bun, SvelteKit 3 and Svelte 5, Motion (motion.dev) for animation, Lenis smooth scrolling and Phosphor icons. Every page is prerendered and served by Vercel.

## Run it

You need [Bun](https://bun.sh) 1.3 or later.

```bash
bun install
bun run dev
```

The dev server runs at http://localhost:5190.

```bash
bun run build
```

## Structure

- `src/routes/+layout.svelte` sets up Lenis, the intro, the header and footer, the progress bar and the green page curtain between routes.
- `src/routes/<page>/+page.svelte` has one folder per route: verify, secure, shares, trade, earn, values, packs, cuids, signin, signup and credits. `+error.svelte` is the 404 page.
- `src/lib/motion.js` holds the motion toolkit: `use:reveal`, `use:parallax` and `use:magnetic` actions, scroll and in-view helpers, the card spotlight and the menu wipe transition.
- `src/lib/components/` holds the reusable pieces: word reveals, photo wipes, scroll-lit text, counters, the odometer, the velocity marquee, the photo hero, CTA band, expanding rows, sticky stack, horizontal pan and the title-check demo.
- `src/lib/data/photos.js` lists every photo with its credit and licence.
- `src/lib/assets/photos/` stores each photo as `.webp` in three widths: `-lg` (1920), `-md` (960) and `-sm` (480).

Imports use the `#lib` alias (for example `import Btn from '#lib/components/Btn.svelte'`).

All motion respects the system "reduce motion" setting.

## Still placeholder

- The Verify title records, the Secure confirmation and the Trade chart use sample data.
- The sign in and sign up forms validate but do not call a backend yet.
- There are no privacy policy or terms pages yet.

## Photo credits

The photos come from Wikimedia Commons under CC BY, CC BY-SA and CC0 licences. Most of these licences require attribution, so keep the `/credits` page whenever the photos are used. See `src/lib/data/photos.js` for each author and licence.

## Deploy

Vercel installs with `bun install` and builds with `bun run build` (see `vercel.json`). Every push to `main` deploys to production.
