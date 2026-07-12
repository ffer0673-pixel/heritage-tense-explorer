import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Volume2, Square } from "lucide-react";
import { STORIES } from "@/data/stories";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

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
    <div className="story-reader-container">
      <div className="story-reader-card">
        {/* Decal stickers */}
        <img
          src="/assets/Card-Sticker SVG/sticker-smiley.svg"
          className="quiz-runner-decor quiz-decor-smiley"
          alt=""
          loading="lazy"
        />
        <img
          src="/assets/Card-Sticker SVG/sticker-heart.svg"
          className="quiz-runner-decor quiz-decor-star"
          alt=""
          loading="lazy"
        />

        <div className="quiz-runner-meta">
          <Link to="/cerita" className="quiz-runner-back">← Semua cerita</Link>
          {!showQuiz && !done && (
            <button
              onClick={toggleNarration}
              aria-label={isSpeaking ? "Stop narration" : "Play narration"}
              className="truus-btn truus-btn-outline shrink-0 py-1.5 px-4 text-xs font-semibold rounded-full flex items-center gap-2 border border-border"
            >
              {isSpeaking ? (
                <>
                  <Square className="h-3 w-3" /> Stop
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" /> Dengarkan
                </>
              )}
            </button>
          )}
          {showQuiz && !done && <span>{step + 1} / {analysis.length}</span>}
        </div>

        {showQuiz && !done && (
          <div className="quiz-progress-bar-bg">
            <div className="quiz-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        {!showQuiz && !done && (
          <div className="pt-2">
            {/* Centered cover image */}
            <div className="story-reader-cover-container">
              {story.image ? (
                <img
                  src={story.image}
                  alt={story.title}
                  className="story-reader-cover-img"
                />
              ) : (
                <div className="story-reader-cover-emoji">{story.cover}</div>
              )}
            </div>

            <h1 className="story-reader-title">{story.title}</h1>
            
            {/* Premium badge */}
            <div className="flex justify-center">
              {(() => {
                const parts = story.tenseFocus.split(/\s*&\s*/);
                return (
                  <div className="story-reader-badge">
                    <span>📖 {parts[0]}</span>
                    {parts[1] && (
                      <>
                        <span className="story-reader-badge-ampersand">&</span>
                        <span>{parts[1]}</span>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            <article className="story-reader-body border-t border-border/40 pt-10">
              {story.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>

            <div className="story-reader-cta">
              <button
                onClick={() => setShowQuiz(true)}
                className="truus-btn py-4 px-8 text-base font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Mulai analisis tense <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {showQuiz && !done && (
          <section className="pt-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Mini Analysis</div>
            <h2 className="text-xl font-bold mt-1 mb-6">Tense apa yang dipakai?</h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-serif italic text-2xl mb-8 leading-snug">"{cur.sentence}"</p>
                <div className="quiz-choices-grid">
                  {options.map((opt, i) => {
                    const isSelected = picked === opt;
                    const isCorrect = picked && opt === cur.tense;
                    const isWrong = picked === opt && opt !== cur.tense;
                    
                    return (
                      <button
                        key={opt}
                        onClick={() => pick(opt)}
                        disabled={!!picked}
                        className={cn(
                          "quiz-choice-btn",
                          isWrong && "wrong",
                          isCorrect && "correct",
                          picked && opt === cur.tense && "correct",
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

                {picked && (
                  <div className="quiz-explanation-box">
                    <span className="font-bold text-orange-600">Penjelasan: </span>{cur.explanation}
                  </div>
                )}

                {picked && (
                  <div className="quiz-runner-footer">
                    <button onClick={next} className="quiz-next-btn">
                      {step + 1 >= analysis.length ? "Selesai" : "Selanjutnya"} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        )}

        {done && (
          <div className="quiz-done-container pt-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Selesai</div>
            <h2 className="quiz-done-title mt-2">Analisis Tense Selesai</h2>
            <div className="mt-8 inline-flex items-baseline gap-2">
              <span className="quiz-percent-large">{Math.round((score / analysis.length) * 100)}</span>
              <span className="text-2xl text-muted-foreground">%</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground font-semibold">{score} dari {analysis.length} jawaban benar</div>
            <div className="quiz-btn-group mt-10">
              <Link to="/cerita" className="quiz-action-btn-dark">
                Kembali ke Cerita
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}