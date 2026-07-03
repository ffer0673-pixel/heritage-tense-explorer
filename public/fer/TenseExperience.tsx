import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { TENSE_CATEGORIES } from './categories.data';
import { TenseCard } from './TenseCard';
import { ProgressTimeline } from './ProgressTimeline';
import type { TenseData } from './types';

/** Scroll distance dedicated to each card, in viewport-heights. Higher = slower, more deliberate pacing. */
const VH_PER_CARD = 140;

/**
 * How many cards to keep mounted on either side of the active one.
 * This is the single biggest performance lever in this component: with
 * all 16 cards, blur/scale/opacity are recalculated on EVERY scroll frame
 * for every card, even the ones sitting fully off-window. Mounting only
 * a small window around the active card cuts that by roughly two-thirds
 * and keeps `filter: blur()` — the most expensive property here — limited
 * to a handful of elements at any given time. 2 leaves enough lead-in for
 * the next/previous card to already be in the DOM before it needs to animate.
 */
const RENDER_WINDOW = 2;

export interface TenseExperienceProps {
  onLearnMore?: (tense: TenseData) => void;
}

/**
 * Immersive, Apple-style scroll section covering all 16 English tenses.
 * Renders a tall pinned track: the viewport stays fixed while cards
 * scale, blur and glide past underneath the cursor.
 *
 * Drop-in usage on the Home page, directly after <AboutDescription />:
 *
 *   <AboutDescription />
 *   <TenseExperience onLearnMore={(tense) => navigate({ to: `/tenses/${tense.id}` })} />
 *   <Marquee />
 */
export function TenseExperience({ onLearnMore }: TenseExperienceProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const introOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0]);
  const topBarScaleX = scrollYProgress;

  const total = TENSE_CATEGORIES.length;
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const idx = Math.min(total - 1, Math.max(0, Math.round(latest * total)));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });


  return (
    <section
      aria-label="The 16 English tenses, an interactive journey"
      className="relative w-full bg-[#08090C]"
    >
      {/* ---------- Lead-in ---------- */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pb-28 pt-32 text-center md:pt-40">
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[--tense-accent,#4c8dff]">
          The Full Journey
        </span>
        <h2 className="font-[var(--tense-font-display,'Fraunces',serif)] text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
          Sixteen tenses.
          <br />
          One fluent mind.
        </h2>
        <p className="max-w-lg text-balance text-base leading-relaxed text-white/50 md:text-lg">
          Scroll to travel through every English tense — from a simple truth to a future imagined
          from the past. Each one told through a single image, a single sentence.
        </p>
        <motion.div
          className="mt-6 flex flex-col items-center gap-2 text-white/30"
          style={{ opacity: introOpacity }}
        >
          <span className="text-[11px] uppercase tracking-[0.24em]">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </div>

      {/* ---------- Pinned track ---------- */}
      <div
        id="tenses-experience-track"
        ref={trackRef}
        style={{ height: `${TENSE_CATEGORIES.length * VH_PER_CARD}vh` }}
        className="relative"
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          
        >
          {/* ambient background glow, matches site's dark/glass language */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,rgba(76,141,255,0.08),transparent_70%)]" />

          {/* top progress line */}
          <div className="absolute inset-x-0 top-0 z-30 h-px w-full bg-white/[0.06]">
            <motion.div
              className="h-full origin-left bg-[--tense-accent,#4c8dff]"
              style={{ scaleX: topBarScaleX }}
            />
          </div>

          {TENSE_CATEGORIES.map((tense, i) => {
            // Only mount cards inside the active window (see RENDER_WINDOW
            // above) — everything else is fully clamped/invisible anyway,
            // so skipping the mount avoids paying for it every scroll frame.
            if (Math.abs(i - activeIndex) > RENDER_WINDOW) return null;
            return (
              <TenseCard
                key={tense.id}
                tense={tense}
                index={i}
                total={total}
                scrollYProgress={scrollYProgress}
                onLearnMore={onLearnMore}
              />
            );
          })}

          <ProgressTimeline tenses={TENSE_CATEGORIES} scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
