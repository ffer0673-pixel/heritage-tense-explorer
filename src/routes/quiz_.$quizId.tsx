import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, RotateCcw, Trophy, X } from "lucide-react";
import { ALL_QUIZZES, getQuestionsFor } from "@/data/quizzes";
import { TENSES_BY_SLUG } from "@/data/tenses";
import { shuffle } from "@/lib/shuffle";
import { useProgress } from "@/lib/progress-store";

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
      const final = next_score();
      if (meta.type === "tense" && meta.tenseSlug) setTenseQuiz(meta.tenseSlug, final);
      else if (meta.type === "category" && meta.categoryKey)
        setCategoryQuiz(meta.categoryKey as "present" | "past" | "future" | "past-future", final);
      else if (meta.type === "final") setFinal(final);
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
      <div className="pt-32 pb-20 mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Hasil</div>
          <h1 className="heading-display text-5xl mt-2">{meta.title}</h1>
          <div className="mt-8 inline-flex items-baseline gap-2">
            <span className="heading-display text-7xl text-primary">{percent}</span>
            <span className="text-2xl text-muted-foreground">%</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">{score} dari {total} jawaban benar</div>

          {percent >= 80 && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-soft text-accent-foreground px-4 py-2 text-sm font-medium">
              <Trophy className="h-4 w-4" /> Badge unlocked!
            </div>
          )}
        </div>

        {wrong.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold">Review</h2>
            <p className="text-xs text-muted-foreground mt-1">{wrong.length} jawaban yang perlu diulang.</p>
            <div className="mt-4 space-y-3">
              {wrong.map(({ qq, ans }) => (
                <div key={qq.id} className="glass rounded-2xl p-4">
                  <div className="text-sm">{qq.prompt}</div>
                  {ans !== null && (
                    <div className="mt-2 text-sm flex items-center gap-2 text-destructive">
                      <X className="h-4 w-4" /> {qq.options[ans]}
                    </div>
                  )}
                  <div className="mt-1 text-sm flex items-center gap-2 text-success">
                    <Check className="h-4 w-4" /> {qq.options[qq.correctIndex]}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{qq.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center gap-3 flex-wrap">
          <button onClick={restart} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            <RotateCcw className="h-4 w-4" /> Kerjakan lagi (acak ulang)
          </button>
          {meta.type === "tense" && meta.tenseSlug && TENSES_BY_SLUG[meta.tenseSlug] && (
            <Link to="/tenses/$tense" params={{ tense: meta.tenseSlug }} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium">
              Pelajari ulang
            </Link>
          )}
          <Link to="/quiz" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium">
            Quiz Hub
          </Link>
        </div>
      </div>
    );
  }

  if (!q) {
    return <div className="pt-32 pb-20 mx-auto max-w-3xl px-6 text-center text-muted-foreground">Memuat kuis…</div>;
  }

  return (
    <div className="pt-32 pb-20 mx-auto max-w-3xl px-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link to="/quiz" className="hover:text-foreground">← Quiz Hub</Link>
        <span>{step + 1} / {total}</span>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${(step / total) * 100}%` }} />
      </div>

      <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{meta.title}</div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step + ":" + mountKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 glass rounded-3xl p-8 sm:p-10"
        >
          <h2 className="text-xl sm:text-2xl font-semibold leading-snug">{q.prompt}</h2>
          <div className="mt-6 grid gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = picked !== null && i === q.correctIndex;
              const isWrong = picked === i && i !== q.correctIndex;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`text-left rounded-2xl border p-4 text-sm transition-colors
                    ${isCorrect ? "border-success bg-success/10" : ""}
                    ${isWrong ? "border-destructive bg-destructive/10" : ""}
                    ${picked === null ? "border-border hover:border-primary/40 hover:bg-primary-soft" : "border-border"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-grid h-5 w-5 place-items-center rounded-full bg-muted text-[11px] font-semibold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-5 rounded-xl bg-muted p-4 text-sm">
              <span className="font-semibold">Penjelasan: </span>{q.explanation}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={go}
              disabled={picked === null}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              {step + 1 >= total ? "Lihat hasil" : "Lanjut"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
