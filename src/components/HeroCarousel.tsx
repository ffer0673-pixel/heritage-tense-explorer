import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEVELOPERS } from "@/data/developers";

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const n = DEVELOPERS.length;

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % n), 5500);
    return () => clearInterval(id);
  }, [n]);

  const dev = DEVELOPERS[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 items-center">
      {/* Left — text */}
      <div className="space-y-7 max-w-xl min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          New · Tangerang Heritage Edition
        </span>
        <h1 className="heading-display text-balance text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl leading-[1.05]">
          Learning English <br />
          Through Tangerang <br />
          Local Wisdom
        </h1>
        <p className="max-w-xl text-base sm:text-lg text-muted-foreground text-balance">
          Tenses Around Us menggabungkan grammar Inggris dengan kisah Pasar Lama, Cisadane, dan komunitas Cina Benteng — satu pelajaran demi satu cerita.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="/tenses" className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5">
            Mulai Belajar
          </a>
          <a href="/about" className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors">
            Tentang Tangerang
          </a>
        </div>
      </div>

      {/* Right — stacked carousel */}
      <div className="relative">
        <div className="relative h-[300px] sm:h-[340px] flex items-center justify-center select-none">
          {DEVELOPERS.map((d, i) => {
            const offset = ((i - active + n) % n + Math.floor(n / 2)) % n - Math.floor(n / 2);
            const isActive = offset === 0;
            const x = offset * 210;
            const scale = isActive ? 1 : 0.72;
            const opacity = isActive ? 1 : 0.4;
            const zIndex = isActive ? 30 : 10 - Math.abs(offset);
            return (
              <motion.button
                key={d.name}
                onClick={() => go(i)}
                aria-label={`Show ${d.name}`}
                animate={{ x, scale, opacity }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                style={{ zIndex }}
                className="absolute flex flex-col items-center"
              >
                <div className={`h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] overflow-hidden rounded-full shadow-elegant ${isActive ? "ring-4 ring-white/30 shadow-glow" : ""}`}>
                  {d.image ? (
                    <img
                      src={d.image}
                      alt={d.name}
                      loading="eager"
                      decoding="sync"
                      fetchPriority="high"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${d.gradient} flex items-center justify-center`}>
                      <span className="text-3xl font-light text-white">{d.initials}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-white text-sm font-semibold drop-shadow">{d.name}</div>
                  <div className="text-white/80 text-[11px] uppercase tracking-widest mt-1">{d.role}</div>
                </div>
              </motion.button>
            );
          })}
        </div>

        

        {/* Made by — di bawah carousel */}
       {/* Made by — di bawah carousel */}
<div className="mt-10 h-[90px] flex flex-col items-center justify-start">
  <AnimatePresence mode="wait">
    <motion.div
      key={dev.name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <p>{dev.bio}</p>
    </motion.div>
  </AnimatePresence>
</div>
      </div>
    </div>
  );
}