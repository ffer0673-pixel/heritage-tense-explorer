import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw, ArrowRight } from "lucide-react";
import { shuffle } from "@/lib/shuffle";
import type { QuizQuestion } from "@/data/quizzes";
import { cn } from "@/lib/utils";

interface ExerciseBlockProps {
  questions: QuizQuestion[];
  onDone?: () => void;
}

export function ExerciseBlock({ questions, onDone }: ExerciseBlockProps) {
  const [mountKey, setMountKey] = useState(0);
  const [shuffled, setShuffled] = useState<QuizQuestion[]>(() => questions.slice(0, 5));
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setShuffled(shuffle(questions).slice(0, 5));
    setHydrated(true);
  }, [questions, mountKey]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = shuffled[step];
  if (!q) {
    return <div className="quiz-runner-card text-center text-muted-foreground p-6">Memuat soal…</div>;
  }

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
  }
  function next() {
    setPicked(null);
    if (step + 1 >= shuffled.length) {
      setDone(true);
      onDone?.();
    } else {
      setStep(step + 1);
    }
  }
  function reset() {
    setMountKey((k) => k + 1);
    setStep(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="quiz-final-card pt-10 pb-10 text-center max-w-xl mx-auto shadow-sm">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Latihan selesai</div>
        <div className="mt-6 inline-flex items-baseline gap-1">
          <span className="text-5xl font-extrabold text-foreground">{score}</span>
          <span className="text-muted-foreground text-xl">/{shuffled.length}</span>
        </div>
        <div className="mt-6">
          <button onClick={reset} className="truus-btn">
            <RotateCcw className="h-4 w-4" /> Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-final-card p-8 shadow-sm">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-4">
        <span>Soal {step + 1} / {shuffled.length}</span>
        <span>Skor: {score}</span>
      </div>
      <div className="quiz-progress-bar-bg mb-6">
        <div className="quiz-progress-bar-fill" style={{ width: `${(step / shuffled.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step + ":" + mountKey}
          initial={hydrated ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-lg font-bold mb-6 leading-snug">"{q.prompt}"</p>
          <div className="quiz-choices-grid">
            {q.options.map((opt, i) => {
              const isSelected = picked === i;
              const isCorrect = picked !== null && i === q.correctIndex;
              const isWrongPick = picked === i && i !== q.correctIndex;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={cn(
                    "quiz-choice-btn",
                    isWrongPick && "wrong",
                    isCorrect && "correct",
                    picked !== null && i === q.correctIndex && "correct",
                    isSelected && "selected"
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
              <span className="font-bold text-orange-600">Penjelasan: </span>
              {q.explanation}
            </div>
          )}

          {picked !== null && (
            <div className="quiz-runner-footer">
              <button onClick={next} className="quiz-next-btn">
                {step + 1 >= shuffled.length ? "Selesai" : "Soal berikutnya"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
