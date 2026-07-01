import { useState } from 'react';
import { motion, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import type { TenseData } from './types';
import { AnimatedSentence } from './AnimatedSentence';

interface TenseCardProps {
  tense: TenseData;
  index: number;
  total: number;
  /** 0 → 1 progress across the WHOLE experience, shared by every card */
  scrollYProgress: MotionValue<number>;
  onLearnMore?: (tense: TenseData) => void;
}

export function TenseCard({ tense, index, total, scrollYProgress, onLearnMore }: TenseCardProps) {
  // p = -1 when this card was the previous one, 0 when centered/active,
  // +1 when it is the upcoming card waiting below. Clamped outside that range.
  const p = useTransform(
    scrollYProgress,
    [(index - 1) / total, index / total, (index + 1) / total],
    [-1, 0, 1],
  );

  const scale = useTransform(p, [-1, 0, 1], [0.92, 1, 0.85]);
  const opacity = useTransform(p, [-1, 0, 1], [0.12, 1, 0.3]);
  const blurPx = useTransform(p, [-1, 0, 1], [10, 0, 8]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const y = useTransform(p, [-1, 0, 1], [-120, 0, 140]);
  
  const zIndex = useTransform(p, (v) => Math.round(100 - Math.abs(v) * 40));

  // Subtle parallax drift on the photograph, independent of the card motion
  const imageY = useTransform(p, [-1, 0, 1], ['-4%', '0%', '4%']);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6 md:px-12"
      style={{ scale, opacity, filter, y, zIndex }}
    >
      <TenseCardBody tense={tense} imageY={imageY} p={p} onLearnMore={onLearnMore} total={total} />
    </motion.div>
  );
}

function TenseCardBody({
  tense,
  imageY,
  p,
  onLearnMore,
  total,
}: {
  tense: TenseData;
  imageY: MotionValue<string>;
  p: MotionValue<number>;
  onLearnMore?: (tense: TenseData) => void;
  total: number;
})  {
  // Derived React state so the word-by-word reveal actually re-renders
  // (motion values don't trigger renders on their own).
  const [isActive, setIsActive] = useState(Math.abs(p.get()) < 0.15);
  useMotionValueEvent(p, 'change', (latest) => {
    const next = Math.abs(latest) < 0.15;
    setIsActive((prev) => (prev === next ? prev : next));
  });
  return (
    <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0e12]/90 shadow-[0_8px_60px_-15px_rgba(0,0,0,0.6)] md:grid-cols-[1.05fr_1fr] md:gap-0">
      {/* Photograph */}
      <div className="relative h-[38vh] w-full overflow-hidden md:h-[68vh]">
        <motion.img
          src={tense.image}
          alt={tense.imageAlt}
          className="h-[110%] w-full object-cover"
          style={{ y: imageY }}
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 md:bg-gradient-to-r md:from-black/0 md:via-black/0 md:to-black/40" />

        <div className="absolute left-6 top-6 flex items-center gap-2 md:left-8 md:top-8">
          <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-white/80 backdrop-blur-md">
            {String(tense.number).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col justify-center gap-5 px-8 py-10 md:px-12 md:py-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[--tense-accent,#4c8dff]">
          {tense.category}
        </span>

        <h3 className="font-[var(--tense-font-display,'Fraunces',serif)] text-3xl leading-[1.05] tracking-tight text-white md:text-5xl">
          {tense.title}
        </h3>

        <span className="w-fit rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/50">
          {tense.structure}
        </span>

        <p className="max-w-md text-[15px] leading-relaxed text-white/60 md:text-base">
          {tense.explanation}
        </p>

        <div className="mt-1 max-w-md border-l border-[--tense-accent,#4c8dff]/40 pl-4">
          <AnimatedSentence
            sentence={tense.example}
            isActive={isActive}
            className="text-[15px] italic leading-relaxed text-white/85 md:text-[17px]"
          />
        </div>

        <button
          type="button"
          onClick={() => onLearnMore?.(tense)}
          className="group mt-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/90 transition-colors duration-300 hover:border-[--tense-accent,#4c8dff]/50 hover:bg-[--tense-accent,#4c8dff]/10"
        >
          Learn this tense
          <span className="translate-x-0 text-[--tense-accent,#4c8dff] transition-transform duration-300 ease-out group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
