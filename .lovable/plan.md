# Cap Go Tense — Build Plan

A premium, multi-page English-learning web app teaching all 16 tenses through Tangerang's local culture. Apple/Linear/Stripe-grade polish, light-mode default with dark toggle, smooth inertia scroll, multi-route architecture.

## Stack & Foundations

- TanStack Start (existing template) + React 19 + Tailwind v4
- Routing: file-based under `src/routes/` (one route per major section)
- Smooth scroll: Lenis (`@studio-freight/lenis`) wired in `__root.tsx`, active on every page, resets on route change
- State: Zustand for dummy progress + theme; persists to `localStorage`
- Animations: Framer Motion (already standard) for reveals, expand-in-place, modal, carousel
- Fonts: Inter (UI) + Lora (story serif) via `<link>` in `__root.tsx`
- Icons: lucide-react
- Default browser cursor everywhere (no custom cursor component)

## Design System (src/styles.css)

Define semantic tokens in `@theme inline` + `:root` / `.dark`:
- `--background`, `--foreground`, `--card`, `--muted`, `--border`
- `--primary` = deep clean blue (oklch ~0.55 0.18 255)
- `--primary-foreground` = white
- `--accent` = warm orange/cream (oklch ~0.78 0.14 65)
- `--accent-foreground` = dark navy
- Custom: `--glass-bg`, `--glass-border`, `--shadow-elegant`, `--gradient-hero`
- Fonts: `--font-sans` (Inter), `--font-serif` (Lora)
- Thin/light weights for large headings, tight tracking
- Light mode = default; `.dark` class on `<html>` toggled by store

Reusable utility classes/components:
- `GlassCard` (glassmorphism), `Marquee` (seamless infinite, dual-row), `Reveal` (fade+slide on viewport enter), `SectionHeading` (mask reveal)

## Site Structure (routes)

```
src/routes/
  __root.tsx              — Lenis, theme, navbar, footer, Outlet
  index.tsx               — Home (hero + condensed previews)
  about.tsx               — Full About Tangerang marquee + modal
  tenses.tsx              — Tenses hub (marquee + 4 expand-in-place categories)
  tenses.$tense.tsx       — Detail page (3-col docs layout)
  latihan.tsx             — Practice Center (3 mode cards)
  quiz.tsx                — Quiz Hub (21 quiz cards, filters)
  quiz.$quizId.tsx        — Quiz runner (Typeform-style)
  cerita.tsx              — Stories magazine layout
  cerita.$slug.tsx        — Story reader + mini analysis quiz
  progress.tsx            — Progress dashboard + reset button
  reference.tsx           — Accordion references
```

## Components

- `Navbar` — floating glass pill, scroll-aware transparent→frosted, hamburger on mobile
- `Footer` — logo, copyright, socials, 3 link columns
- `HeroCarousel` — vertical stacked 3-card carousel with click-side-to-activate, drag/swipe, auto-rotate, synced text block
- `AboutMarquee` — dual-row infinite marquee, hover-pause, click→modal
- `CulturalCardModal` — glass modal with extended info + "Pelajari Tense Ini" link
- `TenseMarquee` — single infinite row of 16 tense names
- `TenseCategoryGrid` — 4 cards, expand-in-place revealing 4 sub-cards
- `TenseDetailLayout` — left sticky tense nav, main content, right sticky TOC
- `ExerciseBlock` — fill blank / MC / transformation w/ feedback
- `QuizRunner` — one-question-per-screen, progress bar, shuffled order on mount
- `QuizResults` — score, review, badge ≥80%
- `StoryCard`, `StoryReader`, `StoryAnalysisQuiz`
- `ProgressRings` (SVG Apple-watch style), `LearningPath` (winding skill-tree)
- `Accordion` (references)
- `ThemeToggle`

## Content Data (src/data/)

- `tenses.ts` — 16 tenses: id, slug, name, category, formula, positive[], negative[], interrogative[], **negativeInterrogative[]** (NEW), examples (Tangerang-themed), timeExpressions[], usage, overview
- `quizzes.ts` — 16 × 20 = 320 ORIGINAL MC questions (NOT lesson examples), plus 4 category quizzes (pull from pool), 1 final assessment. Each question: id, sentence with blank, 4 options, correctIndex, explanation. Shuffled on every mount via `useMemo(() => shuffle(qs), [mountKey])`.
- `cultural.ts` — 5 About cards (Benteng Heritage, Pasar Lama, Cisadane, Kuliner, Cina-Benteng) w/ example sentence + tense badge + extended modal content
- `stories.ts` — 4 stories (150–300 words each, Tangerang-themed) + analysis sentences with correct tense
- `references.ts` — grouped by 4 categories

Given the volume of original quiz content (320 questions), I'll generate them programmatically with templated patterns (subjects, verbs, time markers) per tense so they're genuinely different from lesson examples while remaining grammatically correct and on-topic.

## Progress State (Zustand + persist)

```
{
  tenses: { [slug]: { exerciseDone, quizScore, completed } }
  categories: { present|past|future|pastFuture: { quizScore } }
  finalAssessment: { score }
  stories: { [slug]: { read, quizPassed } }
  streak: number
  reset(): void
}
```

`Reset Progress` button on `/progress` calls `reset()` → wipes localStorage slice + re-renders.

## Animations

- Lenis init in `__root.tsx`, `requestAnimationFrame` loop, cleanup on unmount
- Route change → scroll to top (Lenis `scrollTo(0, { immediate: true })`)
- `Reveal` component uses Framer `whileInView` with `once: true`
- Section headlines: mask-reveal with clip-path or Framer text variants
- Marquees: CSS `@keyframes` with duplicated content; `:hover { animation-play-state: paused }`
- Tense category expand-in-place: Framer `layout` + `AnimatePresence`
- Carousel: spring transitions on scale/x/opacity

## 14.x Specific Fixes (applied during initial build)

1. **Negative Interrogative** form included on every tense detail page + TOC entry
2. **Quiz questions** = 20 original per tense, shuffled per mount, NOT reused from lesson examples
3. **Reset Progress** button on `/progress` wired to Zustand `reset()`
4. **No custom cursor** anywhere — default browser cursor

## Responsive

- Mobile navbar: glass hamburger sheet
- Hero carousel: simplified swipeable stack on `<md`
- Marquees: lighter (slower or single row) on small screens
- 3-col tense detail collapses to single column with collapsible sidebars

## Build Order

1. Design system (styles.css) + fonts + Lenis + theme store
2. Navbar + Footer + __root layout
3. Data files (tenses, quizzes, cultural, stories, references)
4. Home (hero + previews) + About + Tenses hub + Tense detail
5. Latihan + Quiz hub + Quiz runner
6. Cerita + Story reader + Progress + Reference
7. Polish pass: animations, reveals, motifs, dark mode contrast
8. Sitemap.xml + robots.txt + per-route SEO meta

## What's Out of Scope (this build)

- Real authentication / backend (progress is local dummy state per spec)
- Actual image assets beyond 3 generated developer portraits + a few cultural hero images; rest uses CSS illustrations/icons to keep build size manageable
- Lovable Cloud (not needed — no persistence beyond localStorage)

Estimated: ~40–50 new files. Significant build. I'll work in parallel batches.
