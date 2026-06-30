import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
import { shuffle } from "@/lib/shuffle";
import type { QuizQuestion } from "@/data/quizzes";

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
    return <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">Memuat soal…</div>;
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
      <div className="glass rounded-2xl p-6 text-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Latihan selesai</div>
        <div className="heading-display text-5xl mt-3">{score}<span className="text-muted-foreground text-2xl">/{shuffled.length}</span></div>
        <button onClick={reset} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
          <RotateCcw className="h-4 w-4" /> Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Soal {step + 1} / {shuffled.length}</span>
        <span>Skor: {score}</span>
      </div>
      <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${((step) / shuffled.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step + ":" + mountKey}
          initial={hydrated ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <p className="mt-5 text-base font-medium">{q.prompt}</p>
          <div className="mt-4 grid gap-2">
            {q.options.map((opt, i) => {
              const isCorrect = picked !== null && i === q.correctIndex;
              const isWrongPick = picked === i && i !== q.correctIndex;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`text-left rounded-xl border p-3 text-sm transition-colors
                    ${isCorrect ? "border-success bg-success/10" : ""}
                    ${isWrongPick ? "border-destructive bg-destructive/10" : ""}
                    ${picked === null ? "border-border hover:border-primary/40 hover:bg-primary-soft" : "border-border"}`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect && <Check className="h-4 w-4 text-success" />}
                    {isWrongPick && <X className="h-4 w-4 text-destructive" />}
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
              <span className="font-semibold">Penjelasan: </span>
              {q.explanation}
            </div>
          )}

          {picked !== null && (
            <div className="mt-4 flex justify-end">
              <button onClick={next} className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
                {step + 1 >= shuffled.length ? "Selesai" : "Soal berikutnya"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
