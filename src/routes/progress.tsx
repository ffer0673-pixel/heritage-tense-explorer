import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { RotateCcw, Lock, Check, PlayCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useProgress } from "@/lib/progress-store";
import { CATEGORIES, TENSES, tensesByCategory } from "@/data/tenses";
import { STORIES } from "@/data/stories";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col items-center font-semibold text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e5e5" strokeWidth={8} fill="none" />
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
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl font-extrabold text-foreground">{percent}%</span>
        </div>
      </div>
      <div className="mt-3 text-sm font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">{label}</div>
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

  const stats = [
    { v: `${completed}/${total}`, l: "Tenses dikuasai", color: "pink" },
    { v: `${avg}%`, l: "Skor rata-rata", color: "green" },
    { v: `${storiesRead}/${STORIES.length}`, l: "Cerita selesai", color: "lightblue" },
    { v: `${streak}`, l: "Streak", color: "orange" },
  ];

  return (
    <div className="quiz-hub-container">
      <Reveal>
        <div className="quiz-title-container flex items-end justify-between flex-wrap gap-6 border-b border-border pb-8">
          <div>
            <h1 className="quiz-main-title">
              Progress.
            </h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="280" viewBox="0 0 159 17" fill="none" className="quiz-title-underline-svg">
              <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <button
            onClick={() => {
              if (confirm("Reset semua progress? Tindakan ini tidak bisa di-undo.")) reset();
            }}
            className="truus-btn truus-btn-outline"
          >
            <RotateCcw className="h-4 w-4" /> Reset Progress
          </button>
        </div>
      </Reveal>

      {/* Overview Rings Card */}
      <Reveal>
        <div className="quiz-final-card mt-12 pt-10 pb-10 flex flex-col md:flex-row gap-10 items-center justify-around">
          <Ring percent={overallPercent} color="var(--color-dark)" size={160} label="Keseluruhan" value={`${completed}/${total}`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center justify-center">
            {catPercent.map((c) => {
              const colors: Record<string, string> = {
                present: "var(--color-green)",
                past: "var(--color-orange)",
                future: "var(--color-darkblue)",
                "past-future": "var(--color-pink)"
              };
              return (
                <Ring
                  key={c.key}
                  percent={c.percent}
                  color={colors[c.key] || "var(--color-maroon)"}
                  label={c.label}
                  value={`${c.done}/${c.total}`}
                />
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Stats Cards */}
      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {stats.map((s, i) => {
            const rotation = (i % 2 === 0) ? -1.5 : 1.5;
            return (
              <div
                key={s.l}
                className={cn("quiz-card h-40 flex flex-col justify-center", `quiz-card-${s.color}`)}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="quiz-card-header">
                  <div className="text-4xl font-extrabold tracking-tight">{s.v}</div>
                  <div className="text-xs uppercase tracking-widest font-semibold opacity-75 mt-2">{s.l}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Learning Path */}
      <div className="mt-20 pb-12">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Learning Path</h2>
          <p className="text-sm text-muted-foreground mt-1">Selesaikan quiz dengan skor ≥80% untuk membuka badge.</p>
        </Reveal>

        <div className="mt-12 space-y-14">
          {CATEGORIES.map((c, catIdx) => (
            <div key={c.key}>
              <Reveal>
                <div className="text-xs uppercase tracking-widest text-orange-600 font-bold mb-6 border-b border-border pb-2">{c.label}</div>
              </Reveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {tensesByCategory(c.key).map((t, i) => {
                  const p = tenses[t.slug];
                  const status = !p ? "locked" : p.completed ? "done" : p.quizScore !== null ? "in-progress" : "locked";
                  
                  const colors = ["pink", "green", "lightblue", "orange", "maroon", "darkblue"];
                  const colorClass = `quiz-card-${colors[(i + catIdx) % colors.length]}`;
                  const rotation = (i % 2 === 0) ? -1.5 : 1.5;
                  
                  return (
                    <Reveal key={t.slug}>
                      <Link
                        to="/formula/$tense"
                        params={{ tense: t.slug }}
                        className={cn("quiz-card h-48", colorClass)}
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer"
                        }}
                      >
                        <div className="quiz-card-header h-full flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <div className={cn(
                              "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold",
                              status === "done" ? "bg-white/30 text-white" :
                              status === "in-progress" ? "bg-white/20 text-white" :
                              "bg-black/10 text-foreground"
                            )}>
                              {status === "done" ? <Check className="h-4 w-4" /> :
                               status === "in-progress" ? <PlayCircle className="h-4 w-4" /> :
                               <Lock className="h-4 w-4" />}
                            </div>
                            {p?.quizScore !== null && p?.quizScore !== undefined && (
                              <span className="text-xs font-extrabold bg-white/25 rounded-full px-2 py-0.5">{p.quizScore}%</span>
                            )}
                          </div>
                          <div className="quiz-card-title text-base line-clamp-2 mt-4 text-left font-bold">{t.name}</div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
