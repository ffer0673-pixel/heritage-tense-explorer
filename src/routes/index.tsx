import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, type Variants, useScroll } from "framer-motion";
import { ImageSequenceHero } from "@/components/ImageSequenceHero";
import { Reveal } from "@/components/Reveal";
import { CATEGORIES, TENSES } from "@/data/tenses";
import { AboutMarquee } from "@/components/AboutMarquee";
import { AboutDescriptions } from "@/components/AboutDescriptions";
import { TenseSplitHero, type TenseHeroData } from "@/components/TenseSplitHero";
import { QuizShowcase } from "@/components/QuizShowcase";
import StoryShowcase from "@/components/StoryShowcase";
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
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn: Variants = {
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
  const quizTrackerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: quizScrollProgress } = useScroll({
    target: quizTrackerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div>
      {/* Hero — scroll-driven image sequence (fixed canvas + spacer) */}
      <ImageSequenceHero />

      {/* Content wrapper — sits above the fixed hero canvas.
          As the user scrolls past the hero spacer, these sections
          slide up and cover the hero (Apple-style reveal). */}
      <div className="relative z-10">
        {/* Apple Story Showcase (NEW) */}
        <StoryShowcase />

        {/* ═══════ Tenses preview — 4 hero sections, split-word scroll animation ═══════ */}
        <section className="relative bg-white light-scope">
          <TenseSplitHero items={TENSE_HERO_DATA} />
        </section>

        {/* ═══════ Quiz Showcase & Progress Preview Container ═══════ */}
        <div className="relative z-10 bg-white">
          {/* Absolute scroll tracker for QuizShowcase animations */}
          <div
            ref={quizTrackerRef}
            className="absolute top-0 left-0 w-full pointer-events-none"
            style={{ height: "300vh" }}
          />

          {/* Sticky container for QuizShowcase */}
          <div className="sticky top-0 left-0 right-0 h-screen w-full overflow-hidden z-10">
            <QuizShowcase scrollYProgress={quizScrollProgress} />
          </div>

          {/* Spacer to allow scrolling through the QuizShowcase animations (300vh total, minus 100vh viewport height = 200vh spacer) */}
          <div style={{ height: "200vh" }} className="pointer-events-none" />

          {/* ═══════ Progress preview ═══════
              relative + z-20 + solid bg-background: this section is a normal
              (non-pinned) block that sits later in normal document flow. Because
              it has a higher stacking context (z-20) than QuizShowcase's sticky
              layer (z-10) and an opaque background, it visually slides up and
              covers QuizShowcase as the user scrolls past the pinned 300vh
              scroll distance.
              
              We enforce min-h-screen to ensure the parent container is tall enough
              that the sticky QuizShowcase remains stationary until Progress Preview
              completely covers the viewport. */}
          <section className="relative z-20 min-h-screen py-28 bg-background">
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
    </div>
  );
}
