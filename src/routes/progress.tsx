import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, Lock, Check, PlayCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useProgress } from "@/lib/progress-store";
import { CATEGORIES, TENSES, tensesByCategory } from "@/data/tenses";
import { STORIES } from "@/data/stories";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Tenses Around Us" },
      { name: "description", content: "Pantau perjalanan belajar tenses kamu. Reset kapan saja." },
      { property: "og:title", content: "Progress — Tenses Around Us" },
      { property: "og:description", content: "Dashboard kemajuan belajar tenses." },
    ],
  }),
  component: ProgressPage,
});

function Ring({ percent, color, size = 110, label, value }: { percent: number; color: string; size?: number; label: string; value: string }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className="text-muted" strokeWidth={8} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="mt-2 text-sm font-semibold">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function ProgressPage() {
  const tenses = useProgress((s) => s.tenses);
  const stories = useProgress((s) => s.stories);
  const streak = useProgress((s) => s.streak);
  const reset = useProgress((s) => s.reset);

  const completed = Object.values(tenses).filter((t) => t.completed).length;
  const total = TENSES.length;
  const overallPercent = Math.round((completed / total) * 100);

  const catPercent = CATEGORIES.map((c) => {
    const arr = tensesByCategory(c.key);
    const done = arr.filter((t) => tenses[t.slug]?.completed).length;
    return { key: c.key, label: c.label, percent: Math.round((done / arr.length) * 100), done, total: arr.length };
  });

  const scores = Object.values(tenses).map((t) => t.quizScore).filter((x): x is number => x !== null);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const storiesRead = Object.values(stories).filter((s) => s.read).length;

  return (
    <div className="pt-32 pb-20 mx-auto max-w-7xl px-6">
      <Reveal>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Progress</div>
            <h1 className="heading-display text-5xl sm:text-6xl mt-3">Perjalananmu.</h1>
          </div>
          <button
            onClick={() => {
              if (confirm("Reset semua progress? Tindakan ini tidak bisa di-undo.")) reset();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/30 text-destructive px-4 py-2 text-sm font-medium hover:bg-destructive/10 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Reset Progress
          </button>
        </div>
      </Reveal>

      {/* Overview */}
      <Reveal>
        <div className="mt-12 glass rounded-3xl p-8 grid lg:grid-cols-[auto_1fr] gap-10 items-center">
          <Ring percent={overallPercent} color="oklch(0.52 0.19 258)" size={180} label="Keseluruhan" value={`${completed}/${total}`} />
          <div className="grid sm:grid-cols-4 gap-6">
            {catPercent.map((c) => (
              <Ring
                key={c.key}
                percent={c.percent}
                color={c.key === "present" ? "oklch(0.6 0.18 200)" : c.key === "past" ? "oklch(0.78 0.14 65)" : c.key === "future" ? "oklch(0.55 0.19 258)" : "oklch(0.65 0.18 320)"}
                label={c.label}
                value={`${c.done}/${c.total}`}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal>
        <div className="mt-6 grid sm:grid-cols-4 gap-4">
          {[
            { v: `${completed}/${total}`, l: "Tenses dikuasai" },
            { v: `${avg}%`, l: "Skor rata-rata" },
            { v: `${storiesRead}/${STORIES.length}`, l: "Cerita selesai" },
            { v: `${streak}`, l: "Streak" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-5">
              <div className="heading-display text-3xl">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Learning path */}
      <Reveal>
        <div className="mt-14">
          <h2 className="text-xl font-semibold">Learning Path</h2>
          <p className="text-sm text-muted-foreground mt-1">Setiap node = satu tense. Selesaikan quiz dengan skor ≥80% untuk membuka badge.</p>

          <div className="mt-8 space-y-10">
            {CATEGORIES.map((c) => (
              <div key={c.key}>
                <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">{c.label}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {tensesByCategory(c.key).map((t, i) => {
                    const p = tenses[t.slug];
                    const status = !p ? "locked" : p.completed ? "done" : p.quizScore !== null ? "in-progress" : "locked";
                    return (
                      <Link
                        key={t.slug}
                        to="/tenses/$tense"
                        params={{ tense: t.slug }}
                        className={`relative glass rounded-2xl p-4 hover:-translate-y-1 transition-all ${i % 2 === 1 ? "sm:translate-y-4" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${
                            status === "done" ? "bg-success/15 text-success" :
                            status === "in-progress" ? "bg-primary-soft text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {status === "done" ? <Check className="h-4 w-4" /> :
                             status === "in-progress" ? <PlayCircle className="h-4 w-4" /> :
                             <Lock className="h-4 w-4" />}
                          </div>
                          {p?.quizScore !== null && p?.quizScore !== undefined && (
                            <span className="text-[10px] font-semibold text-muted-foreground">{p.quizScore}%</span>
                          )}
                        </div>
                        <div className="mt-3 text-sm font-semibold leading-tight">{t.name}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
