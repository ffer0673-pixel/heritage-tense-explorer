'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// ─── SVG shapes ───
const OpenBook = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <path d="M40 60V18" />
    <path d="M12 22c7 0 16-4 28-4s21 4 28 4v38c-7 0-16-4-28-4s-21 4-28 4V22z" fill="rgba(26,26,26,0.04)" />
    <path d="M18 30h12M18 38h12M18 46h12" opacity="0.4" strokeWidth="1.5" />
    <path d="M48 30h12M48 38h12M48 46h12" opacity="0.4" strokeWidth="1.5" />
  </svg>
);

const ClosedBook = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <rect x="22" y="15" width="36" height="50" rx="3" fill="rgba(26,26,26,0.04)" />
    <path d="M28 15v50" />
    <path d="M38 27h12M38 37h12M38 47h12" opacity="0.4" strokeWidth="1.5" />
  </svg>
);

const Pencil = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <path d="M15 65l10-40 40-10-10 40z" fill="rgba(26,26,26,0.04)" />
    <path d="M15 65l5-15 10 10z" fill="var(--bg-color)" />
    <path d="M15 65l2-6 4 4z" fill="currentColor" />
    <path d="M55 25l10-10 5 5-10 10z" fill="rgba(26,26,26,0.12)" />
  </svg>
);

const SheetOfPaper = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <path d="M22 12h28l14 14v42H22z" fill="rgba(26,26,26,0.04)" />
    <path d="M50 12v14h14" />
    <path d="M30 32h24M30 42h24M30 52h24" opacity="0.4" strokeWidth="1.5" />
  </svg>
);

const FlashcardA = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <rect x="18" y="22" width="44" height="36" rx="4" fill="rgba(26,26,26,0.04)" />
    <text x="40" y="47" fontFamily="Epilogue, sans-serif" fontSize="20" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none">A</text>
  </svg>
);

const FlashcardB = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <rect x="18" y="22" width="44" height="36" rx="4" fill="rgba(26,26,26,0.04)" />
    <text x="40" y="47" fontFamily="Epilogue, sans-serif" fontSize="20" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none">B</text>
  </svg>
);

const FlashcardC = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <rect x="18" y="22" width="44" height="36" rx="4" fill="rgba(26,26,26,0.04)" />
    <text x="40" y="47" fontFamily="Epilogue, sans-serif" fontSize="20" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none">C</text>
  </svg>
);

const Notebook = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <rect x="24" y="14" width="36" height="52" rx="3" fill="rgba(26,26,26,0.04)" />
    <path d="M18 20h8M18 28h8M18 36h8M18 44h8M18 52h8M18 60h8" strokeWidth="2.5" />
  </svg>
);

const Pen = () => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-dark)' }}>
    <path d="M25 60l5-5 35-35-5-5-35 35-5 5z" fill="rgba(26,26,26,0.04)" />
    <path d="M25 60l-5 5 1-4z" fill="currentColor" />
    <path d="M50 25l7 7" strokeWidth="1.5" />
  </svg>
);

const SHAPE_MAP = {
  'book-open': OpenBook,
  'book-closed': ClosedBook,
  'pencil': Pencil,
  'paper': SheetOfPaper,
  'flashcard-a': FlashcardA,
  'flashcard-b': FlashcardB,
  'flashcard-c': FlashcardC,
  'notebook': Notebook,
  'pen': Pen,
};

interface FloatObject {
  id: number;
  type: keyof typeof SHAPE_MAP;
  startX: number; // %
  startY: number; // %
  duration: number; // s
  delay: number; // s
  scale: number;
  rotation: number;
  driftX: number;
  driftY: number;
  opacity: number;
  blur: number;
}

// Exactly 18 varied items distributed through 3D space
const OBJECTS: FloatObject[] = [
  { id: 1, type: 'book-open', startX: 10, startY: 15, duration: 15, delay: 0, scale: 0.9, rotation: 15, driftX: 30, driftY: -40, opacity: 0.28, blur: 0 },
  { id: 2, type: 'pencil', startX: 85, startY: 20, duration: 12, delay: 3, scale: 0.8, rotation: -20, driftX: -40, driftY: -30, opacity: 0.25, blur: 0.5 },
  { id: 3, type: 'paper', startX: 75, startY: 65, duration: 18, delay: 1, scale: 1.0, rotation: 10, driftX: -30, driftY: -50, opacity: 0.22, blur: 0 },
  { id: 4, type: 'flashcard-a', startX: 20, startY: 75, duration: 14, delay: 5, scale: 0.7, rotation: -12, driftX: 20, driftY: -30, opacity: 0.32, blur: 0.2 },
  { id: 5, type: 'notebook', startX: 45, startY: 80, duration: 20, delay: 2, scale: 1.1, rotation: 25, driftX: 10, driftY: -60, opacity: 0.18, blur: 0 },
  { id: 6, type: 'pen', startX: 90, startY: 50, duration: 16, delay: 7, scale: 0.65, rotation: 45, driftX: -35, driftY: -35, opacity: 0.26, blur: 0.8 },
  { id: 7, type: 'book-closed', startX: 15, startY: 45, duration: 22, delay: 4, scale: 0.95, rotation: -30, driftX: 40, driftY: -25, opacity: 0.15, blur: 1.2 },
  { id: 8, type: 'flashcard-b', startX: 30, startY: 25, duration: 13, delay: 9, scale: 0.85, rotation: 8, driftX: 15, driftY: -45, opacity: 0.30, blur: 0 },
  { id: 9, type: 'flashcard-c', startX: 65, startY: 10, duration: 17, delay: 6, scale: 0.75, rotation: -18, driftX: -20, driftY: -35, opacity: 0.24, blur: 0.4 },
  { id: 10, type: 'book-open', startX: 80, startY: 85, duration: 19, delay: 8, scale: 0.9, rotation: 22, driftX: -25, driftY: -55, opacity: 0.20, blur: 0.3 },
  { id: 11, type: 'pencil', startX: 5, startY: 80, duration: 15, delay: 11, scale: 0.75, rotation: -35, driftX: 35, driftY: -40, opacity: 0.28, blur: 0.7 },
  { id: 12, type: 'paper', startX: 50, startY: 15, duration: 21, delay: 10, scale: 1.05, rotation: 5, driftX: -5, driftY: -45, opacity: 0.16, blur: 1.5 },
  { id: 13, type: 'notebook', startX: 70, startY: 40, duration: 16, delay: 13, scale: 0.8, rotation: -15, driftX: -30, driftY: -30, opacity: 0.27, blur: 0 },
  { id: 14, type: 'pen', startX: 35, startY: 60, duration: 14, delay: 12, scale: 0.7, rotation: 30, driftX: 25, driftY: -35, opacity: 0.29, blur: 0.2 },
  { id: 15, type: 'book-closed', startX: 60, startY: 75, duration: 18, delay: 14, scale: 1.0, rotation: -8, driftX: -15, driftY: -40, opacity: 0.22, blur: 0.1 },
  { id: 16, type: 'flashcard-a', startX: 95, startY: 15, duration: 12, delay: 15, scale: 0.75, rotation: 18, driftX: -45, driftY: -25, opacity: 0.31, blur: 0 },
  { id: 17, type: 'flashcard-b', startX: 40, startY: 35, duration: 17, delay: 5, scale: 0.8, rotation: -22, driftX: 5, driftY: -50, opacity: 0.23, blur: 0.9 },
  { id: 18, type: 'flashcard-c', startX: 25, startY: 90, duration: 20, delay: 3, scale: 0.85, rotation: 12, driftX: 30, driftY: -60, opacity: 0.19, blur: 0.5 },
];

function ObjectRenderer({ obj }: { obj: FloatObject }) {
  const ShapeComponent = SHAPE_MAP[obj.type];
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${obj.startX}%`,
        top: `${obj.startY}%`,
        width: 64,
        height: 64,
        willChange: 'transform, opacity, filter',
      }}
      animate={{
        x: [0, obj.driftX * 0.4, obj.driftX, obj.driftX * 1.3],
        y: [40, 0, obj.driftY, obj.driftY - 40],
        opacity: [0, obj.opacity, obj.opacity, 0],
        scale: [obj.scale * 0.3, obj.scale, obj.scale, obj.scale * 1.5],
        filter: [
          `blur(8px)`,
          `blur(${obj.blur}px)`,
          `blur(${obj.blur}px)`,
          `blur(6px)`
        ],
        rotate: [obj.rotation - 10, obj.rotation, obj.rotation + 5, obj.rotation + 15],
      }}
      transition={{
        duration: obj.duration,
        delay: obj.delay,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'linear',
        times: [0, 0.35, 0.75, 1],
      }}
    >
      <ShapeComponent />
    </motion.div>
  );
}

export default function FloatingObjects({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.02; // max ~20px drift
      const y = (e.clientY - rect.top - rect.height / 2) * 0.015;
      mouseX.set(x);
      mouseY.set(y);
    };

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [containerRef, mouseX, mouseY]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        x: springX,
        y: springY,
      }}
    >
      {OBJECTS.map((obj) => (
        <ObjectRenderer key={obj.id} obj={obj} />
      ))}
    </motion.div>
  );
}
