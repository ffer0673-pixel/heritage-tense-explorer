import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ImageSequenceHero } from "@/components/ImageSequenceHero";
import { Reveal } from "@/components/Reveal";
import { CULTURAL_CARDS } from "@/data/cultural";
import { CATEGORIES, TENSES } from "@/data/tenses";
import { STORIES } from "@/data/stories";
import { AboutMarquee } from "@/components/AboutMarquee";
import { AboutDescriptions } from "@/components/AboutDescriptions";
import { TenseSplitHero, type TenseHeroData } from "@/components/TenseSplitHero";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tenses Around Us — Learning English Through Tangerang Local Wisdom" },
      { name: "description", content: "Learn 16 English tenses through the lens of Tangerang's rich cultural heritage." },
      { property: "og:title", content: "Tenses Around Us" },
      { property: "og:description", content: "Learning English Through Tangerang Local Wisdom." },
    ],
  }),
  component: Home,
});

/* ── Scroll animation variants ── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const vp = { once: true, margin: "-80px" as const };

function SectionHead({ kicker, title, link, cta }: { kicker: string; title: string; link: string; cta: string }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
      <div>
        <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
          <span className="h-px w-8 bg-accent/40" />
          {kicker}
        </div>
        <h2 className="heading-editorial text-3xl sm:text-4xl lg:text-[2.75rem] mt-3 max-w-2xl">{title}</h2>
      </div>
      <Link to={link} className="group inline-flex items-center gap-2 text-sm font-medium text-accent/80 hover:text-accent transition-colors">
        {cta} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

/* ── Foto per kategori tense (isi path di sini) ── */
const TENSE_HERO_IMAGES: Partial<Record<string, string>> = {
  // present: "/present-hero.png",
  // past: "/past.png",
  // future: "/future.png",
  // "past-future": "/past-future.png",
};

const TENSE_HERO_DATA: TenseHeroData[] = CATEGORIES.map((c) => {
  const subTenses = TENSES.filter((t) => t.category === c.key);
  return {
    key: c.key,
    word1: c.label,
    word2: "Tense",
    subline: c.description,
    tagline: `${subTenses.length} sub-tenses lengkap dengan rumus, contoh kalimat, dan latihan interaktif.`,
    byline: `${subTenses.length} sub-tenses`,
    imageAlt: `${c.label} Tenses`,
    imageSrc: TENSE_HERO_IMAGES[c.key],
    ctaLink: subTenses[0] ? `/tenses/${subTenses[0].slug}` : "/tenses",
  };
});

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero — scroll-driven image sequence (fixed canvas + spacer) */}
      <ImageSequenceHero />

      {/* Content wrapper — sits above the fixed hero canvas.
          As the user scrolls past the hero spacer, these sections
          slide up and cover the hero (Apple-style reveal). */}
      <div className="relative z-10">
        {/* About Tangerang — detail description cards */}
        <section className="py-20 bg-white light-scope">
          <div className="mx-auto max-w-4xl px-6 mb-10">
            <Reveal>
              <div className="text-xs uppercase tracking-widest text-neutral-500">Cerita Selengkapnya</div>
              <h2 className="heading-display text-3xl sm:text-4xl mt-2 text-neutral-900">
                Setiap tempat, setiap tense.
              </h2>
            </Reveal>
          </div>
          <AboutDescriptions />
        </section>

        {/* Marquee teks berjalan — antara cerita dan tenses */}
        <section className="relative py-10 overflow-hidden bg-white light-scope">
          <AboutMarquee />
        </section>

        {/* ═══════ Tenses preview — 4 hero sections, split-word scroll animation ═══════ */}
        <section className="relative bg-white light-scope">
          <TenseSplitHero items={TENSE_HERO_DATA} />
        </section>

        {/* ═══════ Quiz preview ═══════ */}
        <section className="py-28 bg-white light-scope">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}>
              <SectionHead kicker="Quiz" title="21 kuis: 16 per tense, 4 per kategori, 1 final." link="/quiz" cta="Lihat Semua Kuis" />
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Featured slides in from left */}
              <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}>
                <Link to="/quiz" className="group block relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-white p-8 h-full transition-all duration-500 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1.5">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-accent font-semibold">
                    ★ Featured
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">Final Assessment</h3>
                  <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">Uji pemahaman seluruh 16 tenses dalam satu kuis komprehensif.</p>
                </Link>
              </motion.div>

              {/* Per-tense slides in from right */}
              <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={vp}>
                <Link to="/quiz" className="group block relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-8 h-full transition-all duration-500 hover:border-accent/25 hover:bg-white hover:shadow-xl hover:-translate-y-1.5">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                  <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">Per Tense</div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">20 soal × 16 tenses</h3>
                  <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">Soal selalu diacak setiap kamu buka — fokus belajar, bukan hafalan urutan.</p>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════ Cerita preview — magazine layout ═══════ */}
        <section className="py-28 bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}>
              <SectionHead kicker="Cerita" title="Baca dulu. Identifikasi tense-nya setelahnya." link="/cerita" cta="Baca Cerita" />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Featured story — large card, spans 2 rows on desktop */}
              {STORIES[0] && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={vp}
                  className="lg:row-span-2"
                >
                  <Link to="/cerita/$slug" params={{ slug: STORIES[0].slug }} className="group block relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm h-full transition-all duration-500 hover:border-accent/25 hover:shadow-heritage hover:-translate-y-1.5">
                    <div className="relative h-64 lg:h-[60%] overflow-hidden">
                      <img
                        src={STORIES[0].image}
                        alt={STORIES[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-5">
                        <span className="inline-flex items-center rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-accent font-semibold">
                          {STORIES[0].tenseFocus}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 lg:p-8">
                      <h3 className="text-xl lg:text-2xl font-semibold font-serif tracking-tight">{STORIES[0].title}</h3>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{STORIES[0].summary}</p>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Stories 2 & 3 — horizontal cards stacked on right */}
              {STORIES.slice(1, 3).map((s, i) => (
                <motion.div
                  key={s.slug}
                  variants={slideRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={vp}
                  transition={{ delay: 0.15 * (i + 1) }}
                >
                  <Link to="/cerita/$slug" params={{ slug: s.slug }} className="group block relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm h-full transition-all duration-500 hover:border-accent/25 hover:shadow-heritage hover:-translate-y-1.5">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="relative sm:w-48 h-44 sm:h-auto overflow-hidden shrink-0">
                        <img
                          src={s.image}
                          alt={s.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 hidden sm:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-center">
                        <span className="inline-flex self-start items-center rounded-full bg-accent/15 border border-accent/25 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-accent font-semibold mb-3">
                          {s.tenseFocus}
                        </span>
                        <h3 className="text-lg font-semibold font-serif tracking-tight">{s.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{s.summary}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ Progress preview ═══════ */}
        <section className="py-28 bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}>
              <SectionHead kicker="Progress" title="Lihat seberapa jauh perjalananmu." link="/progress" cta="Buka Dashboard" />
            </motion.div>

            {/* Card scales in from center */}
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={vp}>
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-12">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

                {/* Stats stagger in one by one */}
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid sm:grid-cols-4 gap-8 text-center"
                >
                  {[
                    { v: "0/16", l: "Tenses dikuasai" },
                    { v: "0%", l: "Skor rata-rata" },
                    { v: "0", l: "Cerita selesai" },
                    { v: "0", l: "Streak hari" },
                  ].map((s) => (
                    <motion.div key={s.l} variants={fadeUp}>
                      <div className="text-4xl heading-editorial text-accent">{s.v}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">{s.l}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}