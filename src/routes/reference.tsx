import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { REFERENCES } from "@/data/references";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Reference — Tenses Around Us" },
      { name: "description", content: "Sumber grammar, budaya, dan teknologi yang digunakan Tenses Around Us." },
      { property: "og:title", content: "Reference — Tenses Around Us" },
      { property: "og:description", content: "Semua referensi grammar, budaya, dan teknologi." },
    ],
  }),
  component: ReferencePage,
});

function ReferencePage() {
  const [open, setOpen] = useState<string | null>(REFERENCES[0]?.category ?? null);
  return (
    <div className="pt-32 pb-20 mx-auto max-w-4xl px-6">
      <Reveal>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Reference</div>
        <h1 className="heading-display text-5xl sm:text-6xl mt-3">Sumber & teknologi.</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Transparansi penting. Berikut semua referensi grammar, sumber budaya Tangerang, kredit gambar, dan tools yang dipakai membangun Tenses Around Us.
        </p>
      </Reveal>

      <div className="mt-12 space-y-3">
        {REFERENCES.map((g) => {
          const isOpen = open === g.category;
          return (
            <div key={g.category} className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : g.category)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-base font-semibold">{g.category}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-border"
                  >
                    <ul className="px-6 py-5 space-y-3">
                      {g.items.map((it) => (
                        <li key={it.title} className="text-sm">
                          {it.url ? (
                            <a href={it.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-foreground hover:text-primary group">
                              {it.title} <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                            </a>
                          ) : (
                            <span>{it.title}</span>
                          )}
                          {it.note && <div className="text-xs text-muted-foreground mt-0.5">{it.note}</div>}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
