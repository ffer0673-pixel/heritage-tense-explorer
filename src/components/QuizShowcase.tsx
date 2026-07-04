import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Link } from "@tanstack/react-router";

/* ── Wavy ribbon SVG path ── */
function WavyRibbon({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg
      viewBox="0 0 1400 420"
      fill="none"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M-20,380 C100,380 160,300 280,260 C400,220 440,140 560,160 C680,180 720,320 840,280 C960,240 1000,100 1120,120 C1200,135 1300,170 1420,180"
        stroke="#1e3a5f"
        strokeWidth="42"
        strokeLinecap="round"
        fill="none"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

/* ── Floating Card Component ── */
function FloatingCard({
  title,
  quotes,
  rotation,
  className,
  style,
}: {
  title: string;
  quotes: string[];
  rotation: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-2xl ${className ?? ""}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        backgroundColor: "#1e3a5f",
        width: "clamp(260px, 28vw, 340px)",
        fontFamily: "'Playfair Display', 'Georgia', serif",
        ...style,
      }}
    >
      <div className="p-6 sm:p-8">
        <h3
          className="text-white font-bold text-lg sm:text-xl lg:text-2xl mb-5 tracking-tight"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          {title}
        </h3>
        <div className="space-y-4">
          {quotes.map((quote, i) => (
            <div key={i}>
              {i > 0 && <div className="h-px bg-white/30 mb-4" />}
              <p
                className="text-white/85 text-xs sm:text-sm leading-relaxed italic"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
              >
                {quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main QuizShowcase Component ── */
export function QuizShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ── Phase 1: Cards slide up (scroll 0% – 25%), no opacity fade ── */
  const card1Y = useTransform(scrollYProgress, [0, 0.18], [300, 0]);
  const card2Y = useTransform(scrollYProgress, [0.05, 0.22], [350, 0]);

  /* ── Phase 2: Wavy ribbon draws in (scroll 30% – 60%) ── */
  const ribbonProgress = useTransform(scrollYProgress, [0.28, 0.58], [0, 1]);

  /* ── Phase 3: Left text first (scroll 62% – 76%) ── */
  const textLeftOpacity = useTransform(scrollYProgress, [0.62, 0.76, 1], [0, 1, 1]);
  const textLeftY = useTransform(scrollYProgress, [0.62, 0.76, 1], [40, 0, 0]);

  /* ── Phase 4: Right text after left (scroll 80% – 92%) ── */
  const textRightOpacity = useTransform(scrollYProgress, [0.80, 0.92, 1], [0, 1, 1]);
  const textRightY = useTransform(scrollYProgress, [0.80, 0.92, 1], [40, 0, 0]);

  return (
    /* Tall scroll container — 3 "sections" worth of scroll */
    <div ref={sectionRef} className="relative bg-white light-scope" style={{ height: "300vh" }}>
      {/* Sticky viewport — stays pinned while user scrolls through the 300vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ── Wavy Ribbon — absolute, full width of viewport, BEHIND cards ── */}
        <div
          className="absolute pointer-events-none"
          style={{ zIndex: 1, left: 0, right: 0, top: "50%", transform: "translateY(-50%)", height: "60%" }}
        >
          <WavyRibbon progress={ribbonProgress} />
        </div>

        {/* ── Content — ABOVE ribbon ── */}
        <div className="relative w-full max-w-7xl mx-auto px-6" style={{ zIndex: 2, minHeight: "520px" }}>

          {/* Cards container */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-10 lg:gap-16">
            {/* Card 1: Final Assessment — tilted left, floating */}
            {/* Outer: scroll-driven entrance */}
            <motion.div style={{ y: card1Y }}>
              {/* Inner: infinite floating animation */}
              <motion.div
                animate={{
                  y: [0, -14, 0],
                  rotate: [-12, -15, -9, -12],
                }}
                transition={{
                  y: {
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  rotate: {
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }}
              >
                <Link to="/quiz">
                  <FloatingCard
                    title="Final assessment"
                    quotes={[
                      '"Satu kuis, sesudah menguasai semua."',
                      '"Ujian akhir dari perjalanan 16 tenses-mu."',
                      'Buktikan kamu benar-benar paham, bukan cuma hafal.',
                    ]}
                    rotation={0}
                    className="hover:shadow-3xl transition-shadow duration-500 cursor-pointer"
                    style={{ marginTop: "60px" }}
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Card 2: 16 tenses = 20 soal — tilted right, floating with delay */}
            {/* Outer: scroll-driven entrance */}
            <motion.div style={{ y: card2Y }}>
              {/* Inner: infinite floating animation */}
              <motion.div
                animate={{
                  y: [0, -18, 0],
                  rotate: [8, 12, 5, 8],
                }}
                transition={{
                  y: {
                    duration: 4.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.2,
                  },
                  rotate: {
                    duration: 5.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.8,
                  },
                }}
              >
                <Link to="/quiz">
                  <FloatingCard
                    title="16 tenses = 20 soal"
                    quotes={[
                      'Diacak tiap kali dibuka — fokus paham, bukan hafal urutan.',
                      '"Satu tense, dua puluh soal, nol ruang buat nebak."',
                      '"20 soal per tense. Semua diuji, semua diacak."',
                    ]}
                    rotation={0}
                    className="hover:shadow-3xl transition-shadow duration-500 cursor-pointer"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right text — positioned at right side, aligned with cards */}
          <motion.div
            style={{ opacity: textRightOpacity, y: textRightY }}
            className="absolute right-6 top-[45%] text-right max-w-sm"
          >
            <p
              className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Real Stories
            </p>
            <p
              className="mt-2 text-base sm:text-lg text-neutral-500 leading-relaxed"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Discover grammar through
              <br />
              culture and daily life.
            </p>
          </motion.div>

          {/* Left text — bottom left */}
          <div className="mt-16 sm:mt-20">
            <motion.div
              style={{ opacity: textLeftOpacity, y: textLeftY }}
              className="max-w-lg"
            >
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 leading-tight"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                For Learn Interaktif
              </h3>
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 leading-tight"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                For Learn daily
              </h3>
              <p
                className="mt-3 text-base sm:text-lg text-neutral-500 leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Learn English Naturally
              </p>
              <p
                className="text-base sm:text-lg text-neutral-400 leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Explore tenses through real-life stories and local culture.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
