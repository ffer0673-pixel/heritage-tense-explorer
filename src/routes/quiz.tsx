import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ALL_QUIZZES } from "@/data/quizzes";
import { useProgress } from "@/lib/progress-store";
import { ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz Hub — Tenses Around Us" },
      { name: "description", content: "21 kuis: 16 per tense, 4 per kategori, dan 1 Final Assessment." },
      { property: "og:title", content: "Quiz Hub — Tenses Around Us" },
      { property: "og:description", content: "Pilih kuis. Soal selalu diacak setiap kamu buka." },
    ],
  }),
  component: QuizHub,
});

function QuizHub() {
  const [filter, setFilter] = useState<"all" | "tense" | "category">("all");
  const tenses = useProgress((s) => s.tenses);
  const cats = useProgress((s) => s.categoryQuiz);
  const final = useProgress((s) => s.finalAssessment);

  const filtered = ALL_QUIZZES.filter((q) =>
    filter === "all" ? q.type !== "final" : q.type === filter
  );
  const finalQuiz = ALL_QUIZZES.find((q) => q.type === "final")!;

  function statusFor(q: typeof ALL_QUIZZES[number]): { label: string; score: number | null } {
    if (q.type === "tense") {
      const s = tenses[q.tenseSlug!]?.quizScore ?? null;
      return { label: s === null ? "Belum dimulai" : `Selesai`, score: s };
    }
    if (q.type === "category") {
      const s = cats[q.categoryKey as keyof typeof cats] ?? null;
      return { label: s === null ? "Belum dimulai" : "Selesai", score: s };
    }
    return { label: final === null ? "Belum dimulai" : "Selesai", score: final };
  }

  return (
    <div className="pt-32 pb-20 mx-auto max-w-7xl px-6">
      <Reveal>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Quiz Hub</div>
        <h1 className="heading-display text-5xl sm:text-6xl mt-3 max-w-3xl">
          21 kuis. Soal diacak. Skor jadi cermin progress.
        </h1>
      </Reveal>

      {/* Featured Final */}
      <Reveal>
        <Link
          to="/quiz/$quizId"
          params={{ quizId: finalQuiz.id }}
          className="mt-12 block glass rounded-3xl p-8 sm:p-10 relative overflow-hidden bg-gradient-to-br from-primary-soft to-accent-soft"
        >
          <div className="absolute inset-0 motif-watermark opacity-30 pointer-events-none" />
          <div className="relative flex items-center gap-6 flex-wrap">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="text-xs uppercase tracking-widest text-primary font-semibold">Final Assessment</div>
              <h2 className="heading-display text-3xl mt-1">Uji semua 16 tenses sekaligus.</h2>
              <p className="mt-2 text-sm text-muted-foreground">{finalQuiz.subtitle}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Mulai Final <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </Reveal>

      {/* Filter */}
      <div className="mt-12 flex gap-2 flex-wrap">
        {(["all", "tense", "category"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              filter === f ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "Semua" : f === "tense" ? "Per Tense" : "Per Kategori"}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((q, i) => {
          const st = statusFor(q);
          return (
            <Reveal key={q.id} delay={Math.min(i * 0.03, 0.3)}>
              <Link
                to="/quiz/$quizId"
                params={{ quizId: q.id }}
                className="block glass rounded-2xl p-5 h-full hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{q.title}</h3>
                    <div className="text-xs text-muted-foreground mt-0.5">{q.subtitle}</div>
                  </div>
                  {st.score !== null && (
                    <span className={`rounded-full text-[10px] font-semibold px-2 py-1 ${st.score >= 80 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {st.score}%
                    </span>
                  )}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">{st.label}</div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
