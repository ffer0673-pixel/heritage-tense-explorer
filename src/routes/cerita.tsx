import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { STORIES } from "@/data/stories";
import { useProgress } from "@/lib/progress-store";
import { Check } from "lucide-react";


export const Route = createFileRoute("/cerita")({
  head: () => ({
    meta: [
      { title: "Cerita — Tenses Around Us" },
      { name: "description", content: "Cerita pendek dari Tangerang. Baca dulu, tebak tense-nya kemudian." },
      { property: "og:title", content: "Cerita — Tenses Around Us" },
      { property: "og:description", content: "Stories from Tangerang, with mini tense-analysis at the end." },
    ],
  }),
  component: CeritaPage,
});

function CeritaPage() {
  const stories = STORIES;
  const featured = stories[0];
  const rest = stories.slice(1);
  const storyProgress = useProgress((s) => s.stories);

  return (
    <div className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 motif-watermark opacity-30 -z-10 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Cerita</div>
          <h1 className="heading-display text-5xl sm:text-6xl mt-3 max-w-3xl font-serif italic">
            Sebuah kota. Beberapa cerita.
          </h1>
        </Reveal>

        {/* Featured */}
        <Reveal>
          <Link
            to="/cerita/$slug"
            params={{ slug: featured.slug }}
            className="mt-12 block glass rounded-3xl p-10 sm:p-14 hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start gap-8 flex-wrap">
              <div className="text-7xl sm:text-8xl">
  {featured.image ? (
    <img
      src={featured.image}
      alt={featured.title}
      className="w-24 h-24 object-cover rounded-xl"
    />
  ) : (
    featured.cover
  )}
</div>
              <div className="flex-1 min-w-[240px]">
                <div className="text-xs uppercase tracking-widest text-primary font-semibold">Featured Story</div>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl tracking-tight">{featured.title}</h2>
                <p className="mt-3 text-muted-foreground max-w-2xl">{featured.summary}</p>
                <div className="mt-4 text-xs text-muted-foreground">Tense focus: <span className="text-foreground font-medium">{featured.tenseFocus}</span></div>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Rest */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((s, i) => {
            const done = storyProgress[s.slug]?.read && storyProgress[s.slug]?.quizPassed;
            return (
              <Reveal key={s.slug} delay={i * 0.08}>
                <Link
                  to="/cerita/$slug"
                  params={{ slug: s.slug }}
                  className="block glass rounded-2xl p-6 h-full hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-start justify-between">
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
                    {done && <span className="grid h-7 w-7 place-items-center rounded-full bg-success/15 text-success"><Check className="h-3.5 w-3.5" /></span>}
                  </div>
                  <h3 className="mt-4 font-serif text-xl tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.summary}</p>
                  <div className="mt-3 text-xs text-primary font-medium">{s.tenseFocus}</div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
