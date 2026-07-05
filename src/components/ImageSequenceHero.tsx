import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/** Total number of frames in the sequence */
const FRAME_COUNT = 240;

/** How tall the scroll container is relative to viewport — controls scroll "duration" */
const SCROLL_HEIGHT_VH = 500;

/** Generate the ordered list of frame URLs */
function getFrameUrls(): string[] {
  const urls: string[] = [];
  for (let i = 1; i <= FRAME_COUNT; i++) {
    urls.push(`/fer/ezgif-frame-${String(i).padStart(3, "0")}.jpg`);
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
 *
 * Scroll logic: Framer Motion `useScroll` tracks progress (0→1) on the
 * 500vh spacer. Each text block uses `useTransform` to map progress to
 * opacity + translateY. Texts appear sequentially — each block occupies
 * its own corner of the screen (title top-left, description bottom-left,
 * third block top-right), fading/sliding in during its 1/3 scroll segment
 * and back out before the next one begins.
 * ──────────────────────────────────────────────────────── */

type ScrollProgress = ReturnType<typeof useScroll>["scrollYProgress"];

/** Fade in over [fadeInStart, fadeInEnd], hold, then fade out over [fadeOutStart, fadeOutEnd] */
function useFadeInOutSequence(
  scrollYProgress: ScrollProgress,
  range: [number, number, number, number],
  slideFrom = 36,
) {
  const [inStart, inEnd, outStart, outEnd] = range;
  
  const opacity = useTransform(
    scrollYProgress,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0]
  );
  
  const y = useTransform(
    scrollYProgress,
    [inStart, inEnd, outStart, outEnd],
    [slideFrom, 0, 0, -slideFrom]
  );
  
  return { opacity, y };
}

/** 1st — top left: title + line */
function HeroTextTitle({ scrollYProgress }: { scrollYProgress: ScrollProgress }) {
  // Segment 1 of 3 (0 – 1/3 of total scroll): 0-35% masuk, 35-65% hold, 65-100% keluar
  const { opacity, y } = useFadeInOutSequence(scrollYProgress, [0, 0.1167, 0.2167, 0.3333], 36);
  
  const lineScaleX = useTransform(
    scrollYProgress,
    [0, 0.1167, 0.2167, 0.3333],
    [0, 1, 1, 0]
  );

  return (
    <div className="absolute top-[14vh] sm:top-[12vh] left-0 px-8 sm:px-12 lg:px-20">
      <motion.div style={{ opacity, y }}>
        <h1
          className="text-white font-black tracking-tight leading-[0.9] select-none"
          style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
        >
          TensesAround
          <span
            className="relative text-white font-black"
            style={{
              fontSize: "clamp(1.2rem, 3.5vw, 3rem)",
              verticalAlign: "super",
              marginLeft: "0.1em",
            }}
          >
            US
          </span>
        </h1>
        <motion.div
          style={{ scaleX: lineScaleX, opacity }}
          className="mt-4 sm:mt-5 h-[2px] bg-white origin-left"
        />
      </motion.div>
    </div>
  );
}

/** 2nd — bottom left: interactive learning copy */
function HeroTextBottomLeft({ scrollYProgress }: { scrollYProgress: ScrollProgress }) {
  // Segment 2 of 3 (1/3 – 2/3 of total scroll): 0-35% masuk, 35-65% hold, 65-100% keluar
  const { opacity, y } = useFadeInOutSequence(scrollYProgress, [0.3333, 0.45, 0.55, 0.6667], 50);

  return (
    <div className="absolute bottom-[12%] sm:bottom-[16%] left-0 px-8 sm:px-12 lg:px-20 max-w-3xl">
      <motion.div style={{ opacity, y }}>
        <h2
          className="text-white font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          For Learn Interaktif
        </h2>
        <h2
          className="text-white font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          For Learn daily
        </h2>
        <div className="mt-6">
          <p
            className="text-white/90 text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Learn English Naturally
          </p>
          <p
            className="text-white/70 text-lg sm:text-xl lg:text-2xl mt-2 leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Explore tenses through real-life stories and local culture.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/** 3rd — top right: "Real Stories" */
function HeroTextRight({ scrollYProgress }: { scrollYProgress: ScrollProgress }) {
  // Segment 3 of 3 (2/3 – 1 of total scroll): 0-35% masuk, 35-65% hold, 65-100% keluar
  const { opacity, y } = useFadeInOutSequence(scrollYProgress, [0.6667, 0.7833, 0.8833, 1.0], 40);

  return (
    <div className="absolute top-[14vh] sm:top-[12vh] right-0 px-8 sm:px-12 lg:px-20">
      <motion.div style={{ opacity, y }} className="text-right max-w-xl ml-auto">
        <p
          className="text-white/95 font-black text-3xl sm:text-4xl lg:text-5xl leading-snug"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Real Stories
        </p>
        <p
          className="text-white/85 text-lg sm:text-xl lg:text-2xl mt-3 leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Discover grammar through
          <br />
          culture and daily life.
        </p>
      </motion.div>
    </div>
  );
}


/* ──────────────────────────────────────────────────────── */

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
      </div>

      {/* Fixed text overlay — above canvas (z-0), below page content (z-10) so white sections cover it */}
      {loaded && (
        <div
          className="fixed inset-0 z-[5] h-screen w-full overflow-hidden pointer-events-none"
          style={{ pointerEvents: "none" }}
        >
          <HeroTextTitle scrollYProgress={scrollYProgress} />
          <HeroTextBottomLeft scrollYProgress={scrollYProgress} />
          <HeroTextRight scrollYProgress={scrollYProgress} />
        </div>
      )}



      {/* Scroll spacer — provides scroll distance for the image sequence animation */}
      <div
        ref={sectionRef}
        style={{ height: `${SCROLL_HEIGHT_VH}vh`, position: "relative", zIndex: 0 }}
      />
    </>
  );
}
