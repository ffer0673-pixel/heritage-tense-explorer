import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

const SHOWCASE_SLIDES = [
  {
    number: "01",
    title: "Museum Benteng Heritage: rumah Cina-Benteng, warisan budaya Tionghoa Tangerang abad 17.",
    image: "/bentenghirarci.png",
    slug: "rumah-tua-benteng",
  },
  {
    number: "02",
    title: "Pasar Lama comes alive at dusk with fragrant laksa, sizzling dim sum, and lantern-lit century-old shophouses.",
    image: "/pasarlama.png",
    slug: "kisah-pasar-lama",
  },
  {
    number: "03",
    title: "Cisadane River, once a trade route, now blends morning runs, sunset markets, and Jembatan Berendeng.",
    image: "/sungaicisadane.png",
    slug: "sore-di-cisadane",
  },
  {
    number: "04",
    title: "Tangerang cuisine fuses Sundanese, Chinese, and Betawi flavors — laksa, sayur besan, and dodol.",
    image: "/kulinertangerang.png",
    slug: "kuliner-tangerang",
  },
  {
    number: "05",
    title: "Cina Benteng, descendants of 15th-century Chinese settlers, forged a distinct Peranakan identity in Tangerang.",
    image: "/budayacinabenteng.png",
    slug: "festival-cap-go-meh",
  },
];

export default function StoryShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Add dynamic spring-based smoothing (inertia) to the scroll progress (approx. 30-50ms smoothing)
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 30,
    mass: 0.2,
  });

  // Track scroll progress to update activeIndex
  // Thresholds represent the 75% cover mark of the incoming slide
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let index = 0;
    if (latest >= 0.76) {
      index = 4;
    } else if (latest >= 0.57) {
      index = 3;
    } else if (latest >= 0.40) {
      index = 2;
    } else if (latest >= 0.23) {
      index = 1;
    }
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  // Positional y transforms with parallax effect for outgoing slides (30% speed) and 15% early overlap (as numeric values in vh units)
  // FIX: starting y set to 50 for slides 1-4 ONLY. No other values,
  // ranges, or timing were changed — this is a position-only adjustment.
  const slide0Y = useTransform(smoothScrollYProgress, [0.10, 0.27], [0, -30], { clamp: true });
  const slide1Y = useTransform(smoothScrollYProgress, [0.10, 0.27, 0.47], [50, 15, -30], { clamp: true });
  const slide2Y = useTransform(smoothScrollYProgress, [0.27, 0.44, 0.64], [50, 15, -30], { clamp: true });
  const slide3Y = useTransform(smoothScrollYProgress, [0.44, 0.61, 0.81], [50, 15, -30], { clamp: true });
  const slide4Y = useTransform(smoothScrollYProgress, [0.61, 1.0], [50, 0], { clamp: true });

  const slideTransforms = [
    slide0Y,
    slide1Y,
    slide2Y,
    slide3Y,
    slide4Y,
  ];

  // Derive translateY CSS string representations at the top level
  const slide0YStr = useTransform(slide0Y, (y) => `${y}vh`);
  const slide1YStr = useTransform(slide1Y, (y) => `${y}vh`);
  const slide2YStr = useTransform(slide2Y, (y) => `${y}vh`);
  const slide3YStr = useTransform(slide3Y, (y) => `${y}vh`);
  const slide4YStr = useTransform(slide4Y, (y) => `${y}vh`);

  const slideTransformsStr = [
    slide0YStr,
    slide1YStr,
    slide2YStr,
    slide3YStr,
    slide4YStr,
  ];

  // Dynamic shadow opacity transforms derived directly from numeric slideY position
  const slide1ShadowOpacity = useTransform(slide1Y, [60, 32.5, 15], [0, 1, 0], { clamp: true });
  const slide2ShadowOpacity = useTransform(slide2Y, [60, 32.5, 15], [0, 1, 0], { clamp: true });
  const slide3ShadowOpacity = useTransform(slide3Y, [60, 32.5, 15], [0, 1, 0], { clamp: true });
  const slide4ShadowOpacity = useTransform(slide4Y, [60, 32.5, 15], [0, 1, 0], { clamp: true });

  const shadowOpacities = [
    null, // Slide 1 (idx=0) has no shadow
    slide1ShadowOpacity,
    slide2ShadowOpacity,
    slide3ShadowOpacity,
    slide4ShadowOpacity,
  ];

  // Dynamic highlight opacity transforms derived directly from numeric slideY position
  const slide1HighlightOpacity = useTransform(slide1Y, [60, 32.5, 15], [0, 0.10, 0.04], { clamp: true });
  const slide2HighlightOpacity = useTransform(slide2Y, [60, 32.5, 15], [0, 0.10, 0.04], { clamp: true });
  const slide3HighlightOpacity = useTransform(slide3Y, [60, 32.5, 15], [0, 0.10, 0.04], { clamp: true });
  const slide4HighlightOpacity = useTransform(slide4Y, [60, 32.5, 15], [0, 0.10, 0.04], { clamp: true });

  const highlightOpacities = [
    0.04, // Slide 1 starts at 4%
    slide1HighlightOpacity,
    slide2HighlightOpacity,
    slide3HighlightOpacity,
    slide4HighlightOpacity,
  ];

  // Progressive physical surface reveal height: mathematically computed from numeric slideY
  const getDerivedHeight = (y: number): string => {
    const computedHeight = Math.max(0, Math.min(100, 100 - y));
    return `${computedHeight}dvh`;
  };

  const slide1Height = useTransform(slide1Y, getDerivedHeight);
  const slide2Height = useTransform(slide2Y, getDerivedHeight);
  const slide3Height = useTransform(slide3Y, getDerivedHeight);
  const slide4Height = useTransform(slide4Y, getDerivedHeight);

  const heights = [
    "100dvh",
    slide1Height,
    slide2Height,
    slide3Height,
    slide4Height,
  ];

  // Dynamic box-shadow transforms derived directly from shadow opacity
  const slide1BoxShadow = useTransform(slide1ShadowOpacity, (o) => `0 -8px 18px rgba(0, 0, 0, ${0.12 * o})`);
  const slide2BoxShadow = useTransform(slide2ShadowOpacity, (o) => `0 -8px 18px rgba(0, 0, 0, ${0.12 * o})`);
  const slide3BoxShadow = useTransform(slide3ShadowOpacity, (o) => `0 -8px 18px rgba(0, 0, 0, ${0.12 * o})`);
  const slide4BoxShadow = useTransform(slide4ShadowOpacity, (o) => `0 -8px 18px rgba(0, 0, 0, ${0.12 * o})`);

  const boxShadows = [
    "none",
    slide1BoxShadow,
    slide2BoxShadow,
    slide3BoxShadow,
    slide4BoxShadow,
  ];

  return (
    /* Tall scroll container — provides scroll distance (500vh total height) */
    <div ref={sectionRef} className="relative z-10 w-full bg-black" style={{ height: "500vh" }}>
      
      {/* Sticky viewport — stays pinned at top-0 h-screen while scrolling */}
      <div className="sticky top-0 left-0 right-0 h-screen w-full overflow-hidden z-10">
        
        {/* Background Image Slides (Stacking cards) */}
        {SHOWCASE_SLIDES.map((slide, idx) => {
          const y = slideTransformsStr[idx];
          const zIndex = 10 + idx; // Higher z-index for newer slides
          const isIncoming = idx > 0;

          const height = heights[idx];
          const boxShadow = boxShadows[idx];
          const highlightOpacity = highlightOpacities[idx];

          return (
            <motion.div
              key={slide.number}
              style={{ y, zIndex }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Reveal Wrapper: bottom-anchored dynamic height container with overflow-hidden and top boxShadow */}
              <motion.div 
                style={{ height, boxShadow }} 
                className="absolute bottom-0 left-0 w-full overflow-hidden z-20"
              >
                {/* Image: bottom-anchored, static relative to the slide */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute bottom-0 left-0 w-full object-cover"
                  style={{ height: "100dvh" }}
                />
                <div className="absolute inset-0 bg-black/45" />

                {/* 2. Top Edge Highlight: straight 1px white highlight line with dynamic opacity */}
                {isIncoming && (
                  <motion.div 
                    className="absolute top-0 left-0 right-0 pointer-events-none" 
                    style={{
                      height: "1px",
                      backgroundColor: "rgba(255, 255, 255, 1.0)",
                      opacity: highlightOpacity,
                      zIndex: 31,
                    }}
                  />
                )}

                {/* 3. Edge Gradient: subtle top dark scrim gradient (10% opacity) */}
                {isIncoming && (
                  <div 
                    className="absolute top-0 left-0 right-0 pointer-events-none" 
                    style={{
                      height: "60px",
                      background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
                      zIndex: 30,
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* ── Fixed Static Overlays (Never animate or fade) ── */}
        
        {/* Logo and Search Icon (Top Left) */}
        <div className="absolute top-10 left-[8vw] flex items-center gap-4 z-50 select-none">
          <span className="font-serif italic text-3xl font-semibold tracking-wide text-white">story</span>
          <Search className="h-6 w-6 text-white stroke-[2.5]" />
        </div>

        {/* Scroll to Explore Indicator (Bottom Center) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 select-none text-white/50 text-[11px] uppercase tracking-[0.2em] font-semibold">
          <span>Scroll to Explore</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-sm font-bold"
          >
            ↓
          </motion.span>
        </div>

        {/* Horizontal Scroll Progress Line (Centered/Top Center) */}
        <div className="absolute left-0 right-0 top-[45vh] h-[2px] bg-white/20 z-40">
          <motion.div
            style={{ scaleX: scrollYProgress, originX: 0 }}
            className="h-full bg-white"
          />
        </div>

        {/* ── Active Text Overlay (Animations on active index change) ── */}
        <div className="absolute inset-0 pointer-events-none z-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {/* Story Number (animates from top) */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: -80 },
                  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] } },
                  exit: { opacity: 0, transition: { duration: 0.2 } }
                }}
                className="absolute left-8 top-[34vh] text-6xl font-extrabold text-white leading-none font-sans"
              >
                {SHOWCASE_SLIDES[activeIndex].number}
              </motion.div>

              {/* Slide of Story text (animates from bottom) */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 80 },
                  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] } },
                  exit: { opacity: 0, transition: { duration: 0.2 } }
                }}
                className="absolute left-8 top-[48vh] text-xs font-bold uppercase tracking-widest text-white/80 font-sans"
              >
                Slide of story
              </motion.div>

              {/* Title & Preview Button Container (animates from bottom) */}
              <div className="absolute left-[25vw] right-[8vw] top-[48vh] flex flex-col items-start gap-8 pointer-events-auto">
                <motion.h2
                  variants={{
                    initial: { opacity: 0, y: 80 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] } },
                    exit: { opacity: 0, transition: { duration: 0.2 } }
                  }}
                  className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-4xl font-sans"
                >
                  {SHOWCASE_SLIDES[activeIndex].title}
                </motion.h2>

                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 80 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0], delay: 0.05 } },
                    exit: { opacity: 0, transition: { duration: 0.2 } }
                  }}
                >
                  <Link
                    to="/cerita/$slug"
                    params={{ slug: SHOWCASE_SLIDES[activeIndex].slug }}
                    className="inline-flex items-center justify-center rounded-full bg-white px-7 py-2.5 font-serif italic text-lg text-blue-950 hover:bg-neutral-100 transition-colors shadow-lg"
                  >
                    preview
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}