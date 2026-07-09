import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, RotateCcw, Trophy, X } from "lucide-react";
import { ALL_QUIZZES, getQuestionsFor } from "@/data/quizzes";
import { TENSES_BY_SLUG } from "@/data/tenses";
import { shuffle } from "@/lib/shuffle";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz_/$quizId")({
  loader: ({ params }) => {
    const meta = ALL_QUIZZES.find((q) => q.id === params.quizId);
    if (!meta) throw notFound();
    return {};
  },
  head: ({ params }) => {
    const meta = ALL_QUIZZES.find((q) => q.id === params.quizId);
    const title = meta ? `${meta.title} — Tenses Around Us` : "Quiz";
    return {
      meta: [
        { title },
        { name: "description", content: meta?.subtitle ?? "Kuis tenses bahasa Inggris." },
      ],
    };
  },
  component: QuizRunner,
});

function QuizRunner() {
  const { quizId } = Route.useParams();
  const meta = ALL_QUIZZES.find((q) => q.id === quizId)!;
  const [mountKey, setMountKey] = useState(0);
  const [questions, setQuestions] = useState<ReturnType<typeof getQuestionsFor>>(() => getQuestionsFor(quizId));
  useEffect(() => {
    setQuestions(shuffle(getQuestionsFor(quizId)));
  }, [quizId, mountKey]);
  const total = questions.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const setTenseQuiz = useProgress((s) => s.setTenseQuiz);
  const setCategoryQuiz = useProgress((s) => s.setCategoryQuiz);
  const setFinal = useProgress((s) => s.setFinal);

  const q = questions[step];
  const score = answers.reduce<number>((acc, a, i) => acc + (a === questions[i]?.correctIndex ? 1 : 0), 0);
  const percent = total ? Math.round((score / total) * 100) : 0;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
  }

  function go() {
    setPicked(null);
    if (step + 1 >= total) {
      setDone(true);
      const finalVal = next_score();
      if (meta.type === "tense" && meta.tenseSlug) setTenseQuiz(meta.tenseSlug, finalVal);
      else if (meta.type === "category" && meta.categoryKey)
        setCategoryQuiz(meta.categoryKey as "present" | "past" | "future" | "past-future", finalVal);
      else if (meta.type === "final") setFinal(finalVal);
    } else setStep(step + 1);
  }
  function next_score() {
    const s = answers.reduce<number>((acc, a, i) => acc + (a === questions[i]?.correctIndex ? 1 : 0), 0);
    return Math.round((s / total) * 100);
  }
  function restart() {
    setMountKey((k) => k + 1);
    setStep(0);
    setAnswers(Array(total).fill(null));
    setPicked(null);
    setDone(false);
  }

  if (done) {
    const wrong = questions.map((qq, i) => ({ qq, ans: answers[i] })).filter((x) => x.ans !== x.qq.correctIndex);
    return (
      <div className="quiz-runner-container">
        <div className="quiz-runner-card">
          <div className="quiz-done-container">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Hasil</div>
            <h1 className="quiz-done-title">{meta.title}</h1>
            <div className="mt-8 inline-flex items-baseline gap-2">
              <span className="quiz-percent-large">{percent}</span>
              <span className="text-2xl text-muted-foreground">%</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground font-semibold">{score} dari {total} jawaban benar</div>

            {percent >= 80 && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fef2f2] text-orange-600 px-4 py-2 text-sm font-semibold border border-orange-200">
                <Trophy className="h-4 w-4 text-orange-500" /> Badge unlocked!
              </div>
            )}

            {wrong.length > 0 && (
              <div className="quiz-wrong-review-list">
                <h2 className="text-lg font-bold">Review Jawaban</h2>
                <p className="text-xs text-muted-foreground mt-1">{wrong.length} jawaban yang perlu diulang.</p>
                <div className="mt-4 space-y-3">
                  {wrong.map(({ qq, ans }) => (
                    <div key={qq.id} className="quiz-wrong-item">
                      <div className="text-base font-semibold">{qq.prompt}</div>
                      {ans !== null && (
                        <div className="mt-2 text-sm flex items-center gap-2 text-red-600 font-medium">
                          <X className="h-4 w-4" /> {qq.options[ans]}
                        </div>
                      )}
                      <div className="mt-1 text-sm flex items-center gap-2 text-green-600 font-medium">
                        <Check className="h-4 w-4" /> {qq.options[qq.correctIndex]}
                      </div>
                      <div className="quiz-explanation-box mt-3">
                        <span className="font-bold text-orange-600">Penjelasan: </span>{qq.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="quiz-btn-group mt-10">
              <button onClick={restart} className="quiz-action-btn-dark">
                <RotateCcw className="h-4 w-4" /> Kerjakan lagi (acak ulang)
              </button>
              {meta.type === "tense" && meta.tenseSlug && TENSES_BY_SLUG[meta.tenseSlug] && (
                <Link to="/formula/$tense" params={{ tense: meta.tenseSlug }} className="quiz-action-btn-outline">
                  Pelajari ulang
                </Link>
              )}
              <Link to="/quiz" className="quiz-action-btn-outline">
                Quiz Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!q) {
    return <div className="quiz-runner-container text-center text-muted-foreground">Memuat kuis…</div>;
  }

  return (
    <div className="quiz-runner-container">
      <div className="quiz-runner-card">
        {/* Decorative elements */}
        <img
          src="/assets/Card-Sticker SVG/sticker-heart.svg"
          className="quiz-runner-decor quiz-decor-star"
          alt=""
          loading="lazy"
        />
        <img
          src="/assets/Card-Sticker SVG/sticker-smiley.svg"
          className="quiz-runner-decor quiz-decor-smiley"
          alt=""
          loading="lazy"
        />

        <div className="quiz-runner-meta">
          <Link to="/quiz" className="quiz-runner-back">← Quiz Hub</Link>
          <span>{step + 1} / {total}</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="quiz-progress-bar-bg">
          <div className="quiz-progress-bar-fill" style={{ width: `${(step / total) * 100}%` }} />
        </div>

        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{meta.title}</div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step + ":" + mountKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="quiz-runner-question">{q.prompt}</h2>
            <div className="quiz-choices-grid">
              {q.options.map((opt, i) => {
                const isSelected = picked === i;
                const isCorrect = picked !== null && i === q.correctIndex;
                const isWrong = picked === i && i !== q.correctIndex;

                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    className={cn(
                      "quiz-choice-btn",
                      isSelected && picked === i && i !== q.correctIndex && "wrong",
                      isSelected && i === q.correctIndex && "correct",
                      picked !== null && i === q.correctIndex && "correct",
                      isSelected && picked !== null && "selected"
                    )}
                  >
                    <span className="quiz-choice-badge">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="quiz-explanation-box">
                <span className="font-bold text-orange-600">Penjelasan: </span>{q.explanation}
              </div>
            )}

            <div className="quiz-runner-footer">
              <button
                onClick={go}
                disabled={picked === null}
                className="quiz-next-btn"
              >
                {step + 1 >= total ? "Lihat hasil" : "Lanjut"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
