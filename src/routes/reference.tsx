import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { REFERENCES } from "@/data/references";
import { cn } from "@/lib/utils";

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
    <div className="quiz-hub-container max-w-4xl">
      <Reveal>
        <div className="quiz-title-container">
          <h1 className="quiz-main-title">
            Sumber & teknologi. <span className="italic-text">referensi.</span>
          </h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="280" viewBox="0 0 159 17" fill="none" className="quiz-title-underline-svg">
            <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
        <p className="mt-6 text-muted-foreground text-base max-w-2xl font-serif">
          Transparansi penting. Berikut semua referensi grammar, sumber budaya Tangerang, kredit gambar, dan teknologi yang dipakai membangun Tenses Around Us.
        </p>
      </Reveal>

      <div className="mt-12 space-y-6">
        {REFERENCES.map((g, i) => {
          const isOpen = open === g.category;
          return (
            <Reveal key={g.category}>
              <div className="quiz-final-card p-0 overflow-hidden" style={{ transform: isOpen ? 'rotate(0deg)' : `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}>
                <button
                  onClick={() => setOpen(isOpen ? null : g.category)}
                  className="w-full flex items-center justify-between px-8 py-6 text-left border-none bg-none outline-none font-bold"
                  style={{
                    fontFamily: 'Epilogue, sans-serif',
                    fontSize: '1.25rem',
                    cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer"
                  }}
                >
                  <span className="text-foreground">{g.category}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t border-border bg-[#faf9f6]"
                    >
                      <ul className="px-8 py-6 space-y-4 font-serif">
                        {g.items.map((it) => (
                          <li key={it.title} className="text-base text-foreground leading-relaxed">
                            {it.url ? (
                              <a
                                href={it.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-foreground hover:underline font-semibold"
                                style={{
                                  color: `var(--color-dark)`,
                                  cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer"
                                }}
                              >
                                {it.title} <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                              </a>
                            ) : (
                              <span className="font-semibold">{it.title}</span>
                            )}
                            {it.note && <div className="text-sm text-muted-foreground mt-1 leading-relaxed font-sans">{it.note}</div>}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
