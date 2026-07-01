import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import { CATEGORIES, TENSES, TENSES_BY_SLUG, tensesByCategory, getPronounFormulas } from "@/data/tenses";
import { QUIZZES } from "@/data/quizzes";
import { ExerciseBlock } from "@/components/ExerciseBlock";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/tenses_/$tense")({
  head: ({ params }) => {
    const t = TENSES_BY_SLUG[params.tense];
    const title = t ? `${t.name} — Tenses Around Us` : "Tense — Tenses Around Us";
    const desc = t ? `${t.overview}` : "Pelajari tense bahasa Inggris.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    if (!TENSES_BY_SLUG[params.tense]) throw notFound();
    return {};
  },
  component: TenseDetailPage,
});

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "formula", label: "Formula" },
  { id: "positive", label: "Positive Form" },
  { id: "negative", label: "Negative Form" },
  { id: "interrogative", label: "Interrogative Form" },
  { id: "negative-interrogative", label: "Negative Interrogative" },
  { id: "examples", label: "Example Sentences" },
  { id: "time-expressions", label: "Time Expressions" },
  { id: "usage", label: "Usage" },
  { id: "exercise", label: "Exercise" },
  { id: "quiz", label: "Quiz" },
];

function TenseDetailPage() {
  const { tense } = Route.useParams();
  const t = TENSES_BY_SLUG[tense];
  const questions = useMemo(() => QUIZZES[tense] ?? [], [tense]);

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[220px_1fr_220px] gap-10">
        {/* Left sidebar — tense nav */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">All Tenses</div>
            <nav className="space-y-5">
              {CATEGORIES.map((c) => (
                <div key={c.key}>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5">{c.label}</div>
                  <ul className="space-y-1">
                    {tensesByCategory(c.key).map((tt) => (
                      <li key={tt.slug}>
                        <Link
                          to="/tenses/$tense"
                          params={{ tense: tt.slug }}
                          className={`block text-[13px] py-1 px-2 -mx-2 rounded hover:bg-muted transition ${tt.slug === t.slug ? "text-primary font-semibold bg-primary-soft" : "text-muted-foreground"}`}
                        >
                          {tt.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <article className="light-scope min-w-0 rounded-3xl p-6 sm:p-10">
          <Reveal>
            <div className="text-xs uppercase tracking-widest text-primary">{t.category.replace("-", " ")}</div>
            <h1 className="heading-display text-4xl sm:text-5xl mt-2">{t.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.indonesian}</p>
          </Reveal>

          <section id="overview" className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{t.overview}</p>
          </section>

          <section id="formula" className="mt-12">
  
  <div className="mt-6">
   <h2 className="text-xl font-semibold tracking-tight">Formula</h2>
    <div className="mt-4 overflow-x-auto rounded-2xl glass">
      <table className="w-full text-sm">
        <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Subject</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Positive (+)</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Negative (–)</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Interrogative (?)</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Neg. Interrogative</th>
          </tr>
        </thead>
        <tbody>
          {getPronounFormulas(t).map((row) => (
            <tr key={row.pronoun} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-semibold text-primary">{row.pronoun}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.positive}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.negative}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.interrogative}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.negativeInterrogative}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </table>
    </div>
  </div>
</section>

          {([
            ["positive", "Positive Form", t.positive],
            ["negative", "Negative Form", t.negative],
            ["interrogative", "Interrogative Form", t.interrogative],
            ["negative-interrogative", "Negative Interrogative Form", t.negativeInterrogative],
          ] as const).map(([id, label, arr]) => (
            <section id={id} key={id} className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight">{label}</h2>
              <ul className="mt-3 space-y-2">
                {arr.map((s, i) => (
                  <li key={i} className="rounded-xl bg-muted px-4 py-3 text-sm font-serif">
                    "{s}"
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section id="examples" className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">Example Sentences</h2>
            <div className="mt-4 space-y-3">
              {t.examples.map((s, i) => (
                <div key={i} className="glass rounded-xl p-4 font-serif italic text-foreground/90">
                  "{s}"
                </div>
              ))}
            </div>
          </section>

          <section id="time-expressions" className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">Common Time Expressions</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {t.timeExpressions.map((e) => (
                <span key={e} className="rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-medium">
                  {e}
                </span>
              ))}
            </div>
          </section>

          <section id="usage" className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">When to Use</h2>
            <ul className="mt-3 list-disc list-inside text-muted-foreground space-y-1">
              {t.usage.map((u) => <li key={u}>{u}</li>)}
            </ul>
          </section>

          <section id="exercise" className="mt-14">
            <h2 className="text-xl font-semibold tracking-tight">Exercise</h2>
            <p className="text-sm text-muted-foreground mt-1">Cek pemahaman cepat. Lima soal acak setiap kali.</p>
            <div className="mt-4">
              <ExerciseBlock questions={questions} />
            </div>
          </section>

          <section id="quiz" className="mt-14">
            <h2 className="text-xl font-semibold tracking-tight">Quiz</h2>
            <p className="text-sm text-muted-foreground mt-1">Siap diuji? Kerjakan 20 soal khusus tense ini.</p>
            <Link
              to="/quiz/$quizId"
              params={{ quizId: `tense-${t.slug}` }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Mulai Quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </article>

        {/* Right TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">On this page</div>
            <ul className="space-y-1.5 text-[13px]">
              {TOC.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary transition-colors">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
