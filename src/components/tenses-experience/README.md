# 16 Tenses Experience

A single, self-contained new section: nothing outside `components/tenses-experience/`
was touched. Drop the folder in as-is.

## Install

```
components/
  tenses-experience/
    index.ts
    types.ts
    tenses.data.ts
    TenseExperience.tsx
    TenseCard.tsx
    ProgressTimeline.tsx
    AnimatedSentence.tsx
    README.md   (this file, safe to delete)
```

No new dependencies — it only uses `react` and `framer-motion`, which are
already in your stack.

## Wire it into the Home page

```tsx
import { TenseExperience } from '@/components/tenses-experience';

// ...inside your Home route component, unchanged apart from this one insertion:

<Hero />
<AboutDescription />
<TenseExperience
  onLearnMore={(tense) => navigate({ to: `/tenses/${tense.id}` })}
/>
<Marquee />
<Story />
<Quiz />
<Progress />
```

`onLearnMore` is optional — omit it and the button simply does nothing, or
wire it to your TanStack Router navigation / a modal, whatever the rest of
the site does for tense detail pages.

## Matching your existing theme (do this before shipping)

I don't have access to your actual `tailwind.config` or design tokens, so the
components default to a generic blue (`#4c8dff`) and a placeholder display
font (`Fraunces`) via two CSS variables, both overridable globally so the
section inherits your real branding instead of introducing a second one:

```css
/* in your global stylesheet, e.g. index.css / globals.css */
:root {
  --tense-accent: #YOUR_EXISTING_BLUE_ACCENT;
  --tense-font-display: 'YOUR_EXISTING_DISPLAY_FONT', serif;
}
```

If your project already exposes these as Tailwind theme tokens (e.g.
`theme.colors.accent`, `theme.fontFamily.display`), it's cleaner to swap the
literal `[--tense-accent,#4c8dff]` / `[var(--tense-font-display,'Fraunces',serif)]`
arbitrary values in `TenseCard.tsx`, `TenseExperience.tsx` and
`ProgressTimeline.tsx` for your actual token classes (`text-accent`,
`font-display`, etc.) — a quick find-and-replace.

## Images

Each entry in `tenses.data.ts` ships with a `picsum.photos` seeded
placeholder so the section renders correctly out of the box. Replace
`image` with your own curated, large-format cultural photography before
shipping — the seeds were chosen to loosely match each tense's mood
(sunrise for the "always true" Present Simple, a runner for Future Perfect
Continuous, etc.), so keep that pairing in mind when swapping.

## How the scroll interaction works

- `TenseExperience` renders a tall track (`16 × 140vh`) with a `sticky
  top-0 h-screen` wrapper inside it — the classic "pin and scrub" pattern,
  no scroll-jacking libraries required.
- `useScroll({ target: trackRef, offset: ['start start', 'end end'] })`
  produces one `scrollYProgress` MotionValue (0 → 1) for the whole track.
- Each `TenseCard` derives its own local progress `p` from that shared
  value (`-1` = it was just the previous card, `0` = centered/active,
  `1` = it's the next card, still waiting below), then maps `p` through
  `useTransform` into `scale`, `opacity`, `blur`, `y` and `rotateX` — which
  is exactly the "previous / current / next" behavior you asked for.
- `ProgressTimeline` listens to the same `scrollYProgress` and renders a
  clickable dot rail, grouped by category (Present / Past / Future /
  Future in the Past), that jumps the scroll position on click.
- `AnimatedSentence` reveals the example sentence word-by-word, staggered,
  only while its card is within the "active" window — driven by local
  React state derived from the same progress value via
  `useMotionValueEvent`, not a re-render on every scroll tick.

## Performance notes

- Only `transform`, `opacity` and `filter` are animated — no layout
  properties — so this stays on the compositor.
- `scrollYProgress` is a single shared MotionValue; the 16 cards each
  derive their own `useTransform` off it, so there's one scroll listener
  for the whole section, not sixteen.
- Images use `loading="lazy"`; consider swapping to `next/image`-style
  responsive sources or your existing image component if you have one
  with built-in optimization.
- The desktop-only side rail (`ProgressTimeline`) is hidden below `lg:`
  to keep mobile markup light.
