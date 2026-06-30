import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Volume2, Square } from "lucide-react";
import { STORIES } from "@/data/stories";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/cerita_/$slug")({
  loader: ({ params }) => {
    const s = STORIES.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return {};
  },
  head: ({ params }) => {
    const s = STORIES.find((x) => x.slug === params.slug);
    const title = s ? `${s.title} — Tenses Around Us` : "Cerita";
    return {
      meta: [
        { title },
        { name: "description", content: s?.summary ?? "Cerita pendek dari Tangerang." },
      ],
    };
  },
  component: StoryPage,
});

const TENSE_CHOICES = [
  "Simple Present",
  "Present Continuous",
  "Present Perfect",
  "Present Perfect Continuous",
  "Simple Past",
  "Past Continuous",
  "Past Perfect",
  "Past Perfect Continuous",
  "Simple Future",
  "Future Continuous",
  "Future Perfect",
  "Future Perfect Continuous",
  "Past Future",
  "Past Future Continuous",
  "Past Future Perfect",
  "Past Future Perfect Continuous",
];

function StoryPage() {
  const { slug } = Route.useParams();
  const story = STORIES.find((s) => s.slug === slug)!;
  const markStoryRead = useProgress((s) => s.markStoryRead);
  const markStoryQuiz = useProgress((s) => s.markStoryQuiz);

  useEffect(() => {
    markStoryRead(slug);
  }, [slug, markStoryRead]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const analysis = story.analysis;
  const cur = analysis[step];

  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    if (!cur) return;
    const others = TENSE_CHOICES.filter((t) => t !== cur.tense)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setOptions([...others, cur.tense].sort(() => Math.random() - 0.5));
  }, [cur]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function toggleNarration() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }
  const fullText = story.body.join(" ");
  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.lang = "en-US";
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const femaleVoice =
    voices.find((v) => v.lang.startsWith("en") && /female|zira|samantha|susan|karen|moira|tessa/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-US" && v.name.toLowerCase().includes("female")) ||
    voices.find((v) => v.lang.startsWith("en"));
  if (femaleVoice) utterance.voice = femaleVoice;

  utterance.onend = () => setIsSpeaking(false);
  utterance.onerror = () => setIsSpeaking(false);
  utteranceRef.current = utterance;
  window.speechSynthesis.speak(utterance);
  setIsSpeaking(true);
}

  function pick(t: string) {
    if (picked) return;
    setPicked(t);
    if (t === cur.tense) setScore((s) => s + 1);
  }
  function next() {
    setPicked(null);
    if (step + 1 >= analysis.length) {
      setDone(true);
      if (score + (picked === cur.tense ? 1 : 0) > 0) markStoryQuiz(slug);
    } else setStep(step + 1);
  }

  const progressPercent = showQuiz && !done ? Math.round((step / analysis.length) * 100) : done ? 100 : 0;

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/cerita" className="text-sm text-muted-foreground hover:text-foreground">← Semua cerita</Link>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div className="text-7xl">
            {story.image ? (
              <img
                src={story.image}
                alt={story.title}
                className="w-24 h-24 object-cover rounded-xl"
              />
            ) : (
              story.cover
            )}
          </div>
          <button
            onClick={toggleNarration}
            aria-label={isSpeaking ? "Stop narration" : "Play narration"}
            className="shrink-0 inline-flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm font-medium hover:shadow-glow transition-all"
          >
            {isSpeaking ? (
              <>
                <Square className="h-4 w-4" /> Stop
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" /> Dengarkan
              </>
            )}
          </button>
        </div>

        <h1 className="mt-4 font-serif italic text-4xl sm:text-5xl tracking-tight">{story.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tense focus: {story.tenseFocus}</p>

        <article className="font-serif text-lg leading-[1.85] mt-10 space-y-6 text-foreground/90">
          {story.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {!showQuiz && !done && (
          <button
            onClick={() => setShowQuiz(true)}
            className="mt-12 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Mulai analisis tense <ArrowRight className="h-4 w-4" />
          </button>
        )}

        {showQuiz && !done && (
          <section className="mt-14">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Mini Analysis</div>
            <h2 className="mt-2 text-xl font-semibold">Tense apa yang dipakai?</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xs text-muted-foreground shrink-0">{step + 1} / {analysis.length}</span>
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{progressPercent}%</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="mt-4 glass rounded-2xl p-6"
              >
                <p className="font-serif italic text-lg">"{cur.sentence}"</p>
                <div className="mt-5 grid sm:grid-cols-2 gap-2">
                  {options.map((opt) => {
                    const isCorrect = picked && opt === cur.tense;
                    const isWrong = picked === opt && opt !== cur.tense;
                    return (
                      <button
                        key={opt}
                        onClick={() => pick(opt)}
                        disabled={!!picked}
                        className={`text-left rounded-xl border p-3 text-sm transition-colors
                          ${isCorrect ? "border-success bg-success/10" : ""}
                          ${isWrong ? "border-destructive bg-destructive/10" : ""}
                          ${!picked ? "border-border hover:border-primary/40 hover:bg-primary-soft" : "border-border"}`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrect && <Check className="h-4 w-4 text-success" />}
                          {isWrong && <X className="h-4 w-4 text-destructive" />}
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {picked && (
                  <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
                    <span className="font-semibold">Kenapa: </span>{cur.explanation}
                  </div>
                )}
                {picked && (
                  <div className="mt-4 flex justify-end">
                    <button onClick={next} className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
                      {step + 1 >= analysis.length ? "Selesai" : "Selanjutnya"}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        )}

        {done && (
          <section className="mt-14 text-center glass rounded-3xl p-10">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Selesai</div>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
              <motion.div
                className="h-full rounded-full bg-success"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="heading-display text-6xl mt-5 text-primary">{score}<span className="text-2xl text-muted-foreground">/{analysis.length}</span></div>
            <p className="mt-3 text-sm text-muted-foreground">Mantap. Lanjut cerita lain?</p>
            <Link to="/cerita" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Kembali ke Cerita
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}