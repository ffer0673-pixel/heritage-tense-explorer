import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { CATEGORIES, TENSES, tensesByCategory, type TenseCategory } from "@/data/tenses";

export const Route = createFileRoute("/tenses")({
  head: () => ({
    meta: [
      { title: "Tenses — Tenses Around Us" },
      { name: "description", content: "Empat kategori, enam belas tenses bahasa Inggris dengan contoh dari budaya Tangerang." },
      { property: "og:title", content: "Tenses — Tenses Around Us" },
      { property: "og:description", content: "Explore all 16 English tenses across Present, Past, Future, and Past Future." },
    ],
  }),
  component: TensesPage,
});

function TensesPage() {
  const [openCat, setOpenCat] = useState<TenseCategory | null>(null);

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Tenses</div>
          <h1 className="heading-display text-5xl sm:text-6xl mt-3 max-w-3xl">
            Enam belas tenses, satu peta yang jelas.
          </h1>
        </Reveal>
      </div>

      {/* Quick-access marquee */}
      <div className="mt-14">
        <Marquee duration={55}>
          {TENSES.map((t) => (
            <Link
              key={t.slug}
              to="/tenses/$tense"
              params={{ tense: t.slug }}
              className="rounded-full glass px-5 py-2.5 text-sm font-medium whitespace-nowrap hover:text-primary"
            >
              {t.name}
            </Link>
          ))}
        </Marquee>
      </div>

      {/* Category cards */}
      <div className="mx-auto max-w-7xl px-6 mt-20 grid lg:grid-cols-2 gap-6 items-start">
        {CATEGORIES.map((c) => {
          const open = openCat === c.key;
          const subs = tensesByCategory(c.key);
          return (
            <motion.div
  key={c.key}
  className={`glass rounded-3xl overflow-hidden ${open ? "shadow-glow" : ""}`}
>
              <button
                onClick={() => setOpenCat(open ? null : c.key)}
                className="w-full text-left p-8 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary">{c.label}</div>
                  <h2 className="heading-display text-3xl mt-2">{c.label} Tenses</h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">{c.description}</p>
                </div>
                <motion.div animate={{ rotate: open ? 180 : 0 }} className="shrink-0 grid h-10 w-10 place-items-center rounded-full bg-muted">
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    layout
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-6 grid sm:grid-cols-2 gap-3">
                      {subs.map((t) => (
                        <Link
                          key={t.slug}
                          to="/tenses/$tense"
                          params={{ tense: t.slug }}
                          className="group flex items-center justify-between rounded-2xl bg-card border border-border p-4 hover:border-primary/40 hover:bg-primary-soft transition-all"
                        >
                          <div>
                            <div className="text-sm font-semibold">{t.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{t.indonesian}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
