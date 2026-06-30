import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CULTURAL_CARDS, type CulturalCard } from "@/data/cultural";
import { Marquee } from "./Marquee";

function Card({ card, onClick }: { card: CulturalCard; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-[320px] sm:w-[360px] glass rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
       <div className="text-4xl">
  {card.image ? (
    <img
      src={card.image}
      alt={card.title}
      className="w-16 h-16 object-cover rounded-xl"
    />
  ) : (
    card.emoji
  )}
</div>
        <span className="rounded-full bg-accent-soft text-accent-foreground text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
          {card.tense}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{card.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{card.short}</p>
      <p className="mt-4 text-sm font-serif italic border-l-2 border-primary/40 pl-3 text-foreground/85">
        "{card.exampleEn}"
      </p>
    </button>
  );
}

export function AboutMarquee() {
  const [open, setOpen] = useState<CulturalCard | null>(null);
  const row1 = CULTURAL_CARDS;
  const row2 = [...CULTURAL_CARDS].reverse();

  return (
    <div className="space-y-6">
      <Marquee direction="left" duration={70}>
        {row1.map((c) => (
          <Card key={"r1-" + c.slug} card={c} onClick={() => setOpen(c)} />
        ))}
      </Marquee>
      <Marquee direction="right" duration={80}>
        {row2.map((c) => (
          <Card key={"r2-" + c.slug} card={c} onClick={() => setOpen(c)} />
        ))}
      </Marquee>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative w-full max-w-2xl rounded-3xl p-8 shadow-elegant"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="text-5xl">
  {open.image ? (
    <img
      src={open.image}
      alt={open.title}
      className="w-20 h-20 object-cover rounded-xl"
    />
  ) : (
    open.emoji
  )}
</div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{open.title}</h3>
              <p className="mt-3 text-muted-foreground">{open.extended}</p>

              <div className="mt-6 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Example sentences
                </div>
                <div className="rounded-xl bg-primary-soft p-4">
                  <p className="font-serif italic">"{open.exampleEn}"</p>
                  <div className="mt-1 text-xs text-primary font-medium">{open.tense}</div>
                </div>
                {open.extraExamples.map((ex, i) => (
                  <div key={i} className="rounded-xl bg-muted p-4">
                    <p className="font-serif italic">"{ex.en}"</p>
                    <div className="mt-1 text-xs text-muted-foreground font-medium">{ex.tense}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/tenses/$tense"
                params={{ tense: open.tenseSlug }}
                onClick={() => setOpen(null)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Pelajari Tense Ini <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
