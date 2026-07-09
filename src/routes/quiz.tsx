import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ALL_QUIZZES } from "@/data/quizzes";
import { useProgress } from "@/lib/progress-store";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Tenses Around Us" },
      { name: "description", content: "Uji pemahaman tenses kamu dengan kuis interaktif." },
      { property: "og:title", content: "Quiz Hub — Tenses Around Us" },
      { property: "og:description", content: "Dashboard kuis interaktif 16 tenses." },
    ],
  }),
  component: QuizHub,
});

const COLOR_SCHEMES = ["green", "lightblue", "orange", "maroon", "pink", "darkblue"] as const;
const STICKERS = ["smiley", "camera", "phone", "hand", "heart"] as const;

function QuizHub() {
  const [filter, setFilter] = useState<"all" | "tense" | "category">("all");
  const tenses = useProgress((s) => s.tenses);
  const cats = useProgress((s) => s.categoryQuiz);
  const final = useProgress((s) => s.finalAssessment);

  try {
    const filtered = ALL_QUIZZES.filter((q) =>
      filter === "all" ? q.type !== "final" : q.type === filter
    );
    const finalQuiz = ALL_QUIZZES.find((q) => q.type === "final")!;

    const statusFor = (q: typeof ALL_QUIZZES[number]) => {
      if (q.type === "tense") {
        const s = tenses[q.tenseSlug!]?.quizScore ?? null;
        return { label: s === null ? "belum dimulai" : `selesai`, score: s };
      }
      if (q.type === "category") {
        const s = cats[q.categoryKey as keyof typeof cats] ?? null;
        return { label: s === null ? "belum dimulai" : "selesai", score: s };
      }
      return { label: final === null ? "belum dimulai" : "selesai", score: final };
    };


  return (
    <div className="quiz-hub-container">
      <Reveal>
        <div className="quiz-title-container">
          <h1 className="quiz-main-title">
            21 quizes. <span className="italic-text">randomized.</span>
          </h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="280" viewBox="0 0 159 17" fill="none" className="quiz-title-underline-svg">
            <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </Reveal>

      {/* Featured Final Card */}
      <Reveal>
        <Link
          to="/quiz/$quizId"
          params={{ quizId: finalQuiz.id }}
          className="quiz-final-card"
          style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
        >
          <img
            src="/assets/Card-Sticker SVG/sticker-heart.svg"
            className="quiz-final-sticker"
            alt=""
            loading="lazy"
          />
          <div className="quiz-final-badge">Final Assessment</div>
          <h2 className="quiz-final-title">Uji semua 16 tenses sekaligus.</h2>
          <p className="quiz-final-desc">{finalQuiz.subtitle}</p>
          <div className="quiz-final-action">
            mulai final <ArrowRight className="h-4 w-4" />
          </div>
          {final !== null && (
            <div className="quiz-score-badge">
              {final}%
            </div>
          )}
        </Link>
      </Reveal>

      {/* Filter Section */}
      <div className="quiz-filters">
        {(["all", "tense", "category"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn("quiz-filter-btn", filter === f && "active")}
            style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
          >
            <span>{f === "all" ? "semua" : f === "tense" ? "per tense" : "per kategori"}</span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="quiz-cards-grid">
        {filtered.map((q, i) => {
          const st = statusFor(q);
          const colorClass = `quiz-card-${COLOR_SCHEMES[i % COLOR_SCHEMES.length]}`;
          const stickerName = STICKERS[i % STICKERS.length];
          const rotation = (i % 4 === 0) ? -2 : (i % 4 === 1) ? 1.5 : (i % 4 === 2) ? -1.5 : 2;

          return (
            <Reveal key={q.id} delay={Math.min(i * 0.03, 0.3)}>
              <Link
                to="/quiz/$quizId"
                params={{ quizId: q.id }}
                className={cn("quiz-card", colorClass)}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer"
                }}
              >
                <img
                  src={`/assets/Card-Sticker SVG/sticker-${stickerName}.svg`}
                  className={cn("quiz-card-sticker", `quiz-card-sticker-${stickerName}`)}
                  alt=""
                  loading="lazy"
                />
                <div className="quiz-card-header">
                  <h3 className="quiz-card-title">{q.title}</h3>
                  <div className="quiz-card-subtitle">{q.subtitle}</div>
                </div>
                <div className="quiz-card-footer">
                  <span className="quiz-card-status">{st.label}</span>
                  {st.score !== null && (
                    <span className="quiz-card-score">
                      {st.score}%
                    </span>
                  )}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
  } catch (e) {
    console.error("CRITICAL ERROR IN QUIZHUB RENDERING:", e);
    throw e;
  }
}

