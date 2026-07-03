import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/** Total number of frames in the sequence */
const FRAME_COUNT = 192;

/** How tall the scroll container is relative to viewport — controls scroll "duration" */
const SCROLL_HEIGHT_VH = 500;

/** Generate the ordered list of frame URLs */
function getFrameUrls(): string[] {
  const urls: string[] = [];
  for (let i = 1; i <= FRAME_COUNT; i++) {
    urls.push(`/image_squence/ezgif-frame-${String(i).padStart(3, "0")}.jpg`);
  }
  return urls;
}

/**
 * Draw an image on the canvas at native physical pixel resolution.
 * Uses object-fit: cover — fills entire canvas, crops overflow.
 * All coordinates are in PHYSICAL pixels (canvas.width / canvas.height).
 */
function drawFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  physW: number,
  physH: number,
) {
  ctx.clearRect(0, 0, physW, physH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = physW / physH;

  let drawW: number;
  let drawH: number;

  if (imgRatio > canvasRatio) {
    drawH = physH;
    drawW = physH * imgRatio;
  } else {
    drawW = physW;
    drawH = physW / imgRatio;
  }

  const x = (physW - drawW) / 2;
  const y = (physH - drawH) / 2;

  ctx.drawImage(img, x, y, drawW, drawH);
}

/* ────────────────────────────────────────────────────────
 * Text overlay groups — scroll-driven, positioned over canvas
 * ──────────────────────────────────────────────────────── */

/**
 * Group 1: "TensesAround US" title + line + subtexts
 * Appears at scroll progress 0.02–0.22, fades out by 0.28
 */
function HeroTextGroup1({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  // Title "TensesAroundUs" + line — fade in fast, hold long, fade out slowly
  const titleOpacity = useTransform(scrollYProgress, [0.02, 0.07, 0.28, 0.38], [0, 1, 1, 0]);
  const lineScaleX = useTransform(scrollYProgress, [0.03, 0.10, 0.28, 0.38], [0, 1, 1, 0]);

  // Left subtext "For Learn Interaktif" — slide up fast, hold long, fade out slowly
  const leftOpacity = useTransform(scrollYProgress, [0.06, 0.12, 0.28, 0.38], [0, 1, 1, 0]);
  const leftY = useTransform(scrollYProgress, [0.06, 0.12, 0.28, 0.38], [40, 0, 0, -30]);

  // Right subtext "Real Stories..." — slide up fast, hold long, fade out slowly
  const rightOpacity = useTransform(scrollYProgress, [0.08, 0.14, 0.28, 0.38], [0, 1, 1, 0]);
  const rightY = useTransform(scrollYProgress, [0.08, 0.14, 0.28, 0.38], [40, 0, 0, -30]);

  return (
    <div className="absolute inset-0 flex flex-col justify-start pt-[14vh] sm:pt-[12vh] px-8 sm:px-12 lg:px-20">
      {/* Title: TensesAround + US superscript */}
      <motion.div style={{ opacity: titleOpacity }}>
        <h1 className="text-white font-black tracking-tight leading-[0.9] select-none"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "clamp(2.5rem, 8vw, 7rem)" }}>
          TensesAround
          <span className="relative text-white font-black"
                style={{ fontSize: "clamp(1.2rem, 3.5vw, 3rem)", verticalAlign: "super", marginLeft: "0.1em" }}>
            US
          </span>
        </h1>
      </motion.div>

      {/* Horizontal line */}
      <motion.div
        style={{ scaleX: lineScaleX, opacity: titleOpacity }}
        className="mt-4 sm:mt-5 h-[2px] bg-white origin-left"
      />

      {/* Bottom row: left text + right text */}
      <div className="mt-6 sm:mt-8 flex items-start justify-between gap-8 flex-wrap">
        {/* Left: "For Learn Interaktif" */}
        <motion.div style={{ opacity: leftOpacity, y: leftY }}>
          <p className="text-white font-bold text-sm sm:text-base lg:text-lg leading-snug"
             style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            For Learn Interaktif
          </p>
        </motion.div>

        {/* Right: "Real Stories..." */}
        <motion.div style={{ opacity: rightOpacity, y: rightY }} className="text-right max-w-[280px]">
          <p className="text-white/90 font-semibold text-sm sm:text-base leading-snug"
             style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Real Stories
          </p>
          <p className="text-white/70 text-xs sm:text-sm mt-1 leading-relaxed"
             style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Discover grammar through<br />culture and daily life.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Group 2: "For Learn Interaktif / For Learn daily" + descriptions
 * Appears at scroll progress 0.30–0.48, fades out by 0.55
 */
function HeroTextGroup2({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const line1Opacity = useTransform(scrollYProgress, [0.30, 0.35], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.30, 0.35], [50, 0]);

  const line2Opacity = useTransform(scrollYProgress, [0.32, 0.37], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.32, 0.37], [50, 0]);

  const descOpacity = useTransform(scrollYProgress, [0.35, 0.40], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.35, 0.40], [40, 0]);

  return (
    <div className="absolute bottom-[12%] sm:bottom-[16%] left-0 px-8 sm:px-12 lg:px-20">
      <motion.h2
        style={{ opacity: line1Opacity, y: line1Y, fontFamily: "'Inter', system-ui, sans-serif" }}
        className="text-white font-extrabold text-xl sm:text-2xl lg:text-3xl leading-tight"
      >
        For Learn Interaktif
      </motion.h2>

      <motion.h2
        style={{ opacity: line2Opacity, y: line2Y, fontFamily: "'Inter', system-ui, sans-serif" }}
        className="text-white font-extrabold text-xl sm:text-2xl lg:text-3xl leading-tight"
      >
        For Learn daily
      </motion.h2>

      <motion.div style={{ opacity: descOpacity, y: descY }} className="mt-4">
        <p className="text-white/80 text-sm sm:text-base leading-relaxed"
           style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          Learn English Naturally
        </p>
        <p className="text-white/60 text-xs sm:text-sm mt-1 leading-relaxed"
           style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          Explore tenses through real-life stories and local culture.
        </p>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
 * Main component
 * ──────────────────────────────────────────────────────── */

export function ImageSequenceHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(0);

  const [loaded, setLoaded] = useState(false);

  // ── Preload all frames ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urls = getFrameUrls();
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    urls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        images[i] = img;
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          framesRef.current = images;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          framesRef.current = images;
          setLoaded(true);
        }
      };
    });
  }, []);

  // ── Resize handler — set canvas to native physical pixel resolution ──
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    const physW = Math.round(rect.width * dpr);
    const physH = Math.round(rect.height * dpr);

    canvas.width = physW;
    canvas.height = physH;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = framesRef.current[currentFrameRef.current];
      if (img) drawFrame(ctx, img, physW, physH);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    updateCanvasSize();

    const ro = new ResizeObserver(() => updateCanvasSize());
    const parent = canvasRef.current?.parentElement;
    if (parent) ro.observe(parent);

    return () => ro.disconnect();
  }, [loaded, updateCanvasSize]);

  // ── Draw first frame once loaded ──
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = framesRef.current[0];
    if (!img) return;

    drawFrame(ctx, img, canvas.width, canvas.height);
  }, [loaded]);

  // ── Scroll-driven frame progression ──
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!loaded) return;

    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(v * (FRAME_COUNT - 1))),
    );

    if (frameIndex === currentFrameRef.current) return;
    currentFrameRef.current = frameIndex;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = framesRef.current[frameIndex];
      if (!img) return;

      drawFrame(ctx, img, canvas.width, canvas.height);
    });
  });

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      {/* Fixed canvas layer — stays locked to viewport, behind content */}
      <div
        className="fixed inset-0 z-0 h-screen w-full overflow-hidden bg-black"
        style={{ pointerEvents: "none" }}
      >
        {/* Loading indicator */}
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
              <span className="text-xs text-white/60 tracking-widest uppercase">
                Loading…
              </span>
            </div>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Text overlays — positioned on top of canvas, animated by scroll */}
        {loaded && (
          <>
            <HeroTextGroup1 scrollYProgress={scrollYProgress} />
            <HeroTextGroup2 scrollYProgress={scrollYProgress} />
          </>
        )}
      </div>

      {/* Scroll spacer — provides scroll distance for the image sequence animation */}
      <div
        ref={sectionRef}
        style={{ height: `${SCROLL_HEIGHT_VH}vh`, position: "relative", zIndex: 0 }}
      />
    </>
  );
}
