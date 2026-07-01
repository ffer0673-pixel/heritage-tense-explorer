import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Reveal } from "@/components/Reveal";
import { CULTURAL_CARDS } from "@/data/cultural";
import { CATEGORIES, TENSES } from "@/data/tenses";
import { STORIES } from "@/data/stories";
import { AboutMarquee } from "@/components/AboutMarquee";
import { AboutDescriptions } from "@/components/AboutDescriptions";
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

function SectionHead({ kicker, title, link, cta }: { kicker: string; title: string; link: string; cta: string }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{kicker}</div>
        <h2 className="heading-display text-3xl sm:text-4xl mt-2 max-w-2xl">{title}</h2>
      </div>
      <Link to={link} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero */}
      <section className="hero-section relative pt-32 pb-44 sm:pt-40 sm:pb-52 overflow-hidden">
        <div className="absolute inset-0 bg-hero -z-10" />
        <div className="absolute inset-0 bg-dots opacity-50 -z-10" />
        <div className="mx-auto max-w-7xl px-6">
          <HeroCarousel />
        </div>
      </section>

      {/* About Tangerang — full experience */}
      <section className="section-white-to-dark relative py-20 overflow-hidden light-scope">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">About Tangerang</div>
            <h2 className="heading-display text-3xl sm:text-4xl mt-2 max-w-2xl mb-10 text-neutral-900">
              Lima fragmen budaya yang jadi pelajaran tenses.
            </h2>
          </Reveal>
        </div>
        <AboutMarquee />
      </section>

      {/* About Tangerang — detail description cards */}
      <section className="py-20 bg-neutral-950">
        <div className="mx-auto max-w-4xl px-6 mb-10">
          <Reveal>
            <div className="text-xs uppercase tracking-widest text-neutral-400">Cerita Selengkapnya</div>
            <h2 className="heading-display text-3xl sm:text-4xl mt-2 text-white">
              Setiap tempat, setiap tense.
            </h2>
          </Reveal>
        </div>
        <AboutDescriptions />
      </section>

      {/* 16 Tenses — immersive scroll experience */}
      

      {/* Tenses preview */}
      <section className="py-20 mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHead
            kicker="Tenses"
            title="Empat kategori. Enam belas tenses. Satu peta lengkap."
            link="/tenses"
            cta="Jelajahi Tenses"
          />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.08}>
              <Link to="/tenses" className="block glass rounded-2xl p-6 h-full hover:-translate-y-1 transition-all">
                <div className="text-xs uppercase tracking-widest text-primary font-medium">{c.label}</div>
                <h3 className="mt-2 text-xl font-semibold heading-display">{c.label} Tenses</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  {TENSES.filter((t) => t.category === c.key).length} sub-tenses
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>


      {/* Quiz preview */}
      <section className="py-20 mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHead kicker="Quiz" title="21 kuis: 16 per tense, 4 per kategori, 1 final." link="/quiz" cta="Lihat Semua Kuis" />
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-5">
          <Reveal>
            <Link to="/quiz" className="block glass rounded-2xl p-6 hover:-translate-y-1 transition-all">
              <div className="text-xs uppercase tracking-widest text-accent-foreground">Featured</div>
              <h3 className="mt-2 text-xl font-semibold">Final Assessment</h3>
              <p className="mt-2 text-sm text-muted-foreground">Uji pemahaman seluruh 16 tenses dalam satu kuis komprehensif.</p>
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link to="/quiz" className="block glass rounded-2xl p-6 hover:-translate-y-1 transition-all">
              <div className="text-xs uppercase tracking-widest text-primary">Per Tense</div>
              <h3 className="mt-2 text-xl font-semibold">20 soal × 16 tenses</h3>
              <p className="mt-2 text-sm text-muted-foreground">Soal selalu diacak setiap kamu buka — fokus belajar, bukan hafalan urutan.</p>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Cerita preview */}
      <section className="py-20 mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHead kicker="Cerita" title="Baca dulu. Identifikasi tense-nya setelahnya." link="/cerita" cta="Baca Cerita" />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STORIES.slice(0, 3).map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08}>
              <Link to="/cerita/$slug" params={{ slug: s.slug }} className="block glass rounded-2xl p-6 hover:-translate-y-1 transition-all">
               <div className="text-4xl">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                  ) : (
                    s.cover
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold font-serif">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.summary}</p>
                <div className="mt-3 text-xs text-primary font-medium">{s.tenseFocus}</div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Progress preview */}
      <section className="py-20 mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHead kicker="Progress" title="Lihat seberapa jauh perjalananmu." link="/progress" cta="Buka Dashboard" />
        </Reveal>
        <Reveal>
          <div className="glass rounded-3xl p-10 grid sm:grid-cols-4 gap-6 text-center">
            {[
              { v: "0/16", l: "Tenses dikuasai" },
              { v: "0%", l: "Skor rata-rata" },
              { v: "0", l: "Cerita selesai" },
              { v: "0", l: "Streak hari" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-4xl heading-display">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
