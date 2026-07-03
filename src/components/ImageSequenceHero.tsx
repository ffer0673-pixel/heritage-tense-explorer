import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

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
 *
 * Uses object-fit: contain logic — the image is fitted inside the canvas
 * at its original aspect ratio without upscaling beyond 1:1 pixel mapping.
 * High-quality image smoothing is enabled for any necessary downscaling.
 *
 * All coordinates are in PHYSICAL pixels (canvas.width / canvas.height),
 * NOT CSS pixels. No ctx.scale() is used — we draw directly at device
 * resolution to avoid any transform-based blurring.
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

  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;
  const imgRatio = imgW / imgH;
  const canvasRatio = physW / physH;

  let drawW: number;
  let drawH: number;

  // object-fit: cover — fill entire canvas, crop overflow to preserve aspect ratio
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

/**
 * Apple-style scroll-driven image sequence hero.
 *
 * - Preloads all frames before starting.
 * - Renders to <canvas> at native device pixel resolution for maximum sharpness.
 * - Scroll progress mapped to frame index via framer-motion useScroll.
 * - Section is pinned (sticky) while the sequence plays, then releases.
 * - No React state updates during scroll — fully imperative drawing.
 */
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
        // Still count errored frames so we don't block forever
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

    // Round to exact integers to avoid sub-pixel blurring
    const physW = Math.round(rect.width * dpr);
    const physH = Math.round(rect.height * dpr);

    // Set internal resolution to physical device pixels
    canvas.width = physW;
    canvas.height = physH;

    // NO ctx.scale() — we draw directly at physical pixel coordinates.
    // The browser downsamples from canvas.width/height to the CSS display
    // size, giving a 1:1 physical-pixel mapping on HiDPI screens.

    // Redraw current frame at new size
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

    // Only redraw when the frame actually changes
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

      // Always use the physical pixel dimensions — no CSS-pixel indirection
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

        {/* Canvas — sized via CSS to fill viewport, internal resolution set via JS */}
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

      {/* Scroll spacer — provides scroll distance for the image sequence animation.
          This div is invisible but its height drives the useScroll progress. */}
      <div
        ref={sectionRef}
        style={{ height: `${SCROLL_HEIGHT_VH}vh`, position: "relative", zIndex: 0 }}
      />
    </>
  );
}
