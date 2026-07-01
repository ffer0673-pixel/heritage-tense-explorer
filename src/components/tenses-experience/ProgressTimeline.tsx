import { useState } from 'react';
import { motion, useMotionValueEvent, type MotionValue } from 'framer-motion';
import type { TenseData } from './types';

interface ProgressTimelineProps {
  tenses: TenseData[];
  scrollYProgress: MotionValue<number>;
}

/**
 * A slim rail, fixed to the right edge of the sticky viewport, that mirrors
 * scroll position as an index (1–16) and lets the user jump straight to a
 * tense by clicking its dot. Grouped visually by category with a subtle
 * divider, mirroring how the cards themselves are grouped.
 */
export function ProgressTimeline({ tenses, scrollYProgress }: ProgressTimelineProps) {
  const total = tenses.length;
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const idx = Math.min(total - 1, Math.max(0, Math.round(latest * total)));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const handleJump = (index: number) => {
    const container = document.getElementById('tenses-experience-track');
    if (!container) return;
    const targetTop =
      container.offsetTop + (index / total) * (container.offsetHeight - window.innerHeight);
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  let lastCategory = '';

  return (
    <div className="pointer-events-auto absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 md:right-10 lg:flex">
      {tenses.map((tense, i) => {
        const showLabel = tense.category !== lastCategory;
        lastCategory = tense.category;

        return (
          <div key={tense.id} className="flex items-center gap-2.5">
            {showLabel && (
              <span className="mr-1 select-none text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">
                {tense.category}
              </span>
            )}
            <button
              type="button"
              aria-label={`Jump to ${tense.title}`}
              onClick={() => handleJump(i)}
              className="group relative flex h-4 w-4 items-center justify-center"
            >
              <motion.span
                className="rounded-full bg-white/25"
                animate={
                  i === activeIndex
                    ? { width: 8, height: 8, backgroundColor: 'var(--tense-accent, #4c8dff)' }
                    : { width: 4, height: 4, backgroundColor: 'rgba(255,255,255,0.25)' }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
              <span className="absolute inset-0 scale-150 rounded-full transition-colors duration-200 group-hover:bg-white/5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
