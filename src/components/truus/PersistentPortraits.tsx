'use client';

import { motion, useMotionValue, useSpring, AnimatePresence, useDragControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';

interface Layout {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
}

const getLayoutForSection = (
  section: string,
  width: number,
  height: number,
  screenType: 'desktop' | 'tablet' | 'mobile',
  isPortraitActive: boolean
) => {
  const cardSize = screenType === 'mobile' ? 70 : (screenType === 'tablet' ? 94 : 116);
  const cardW = cardSize;
  const cardH = cardSize;

  let pA: Layout = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
  let pB: Layout = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
  let pC: Layout = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };

  if (screenType === 'desktop') {
    // DESKTOP LAYOUT (width >= 1024px)
    switch (section) {
      case "hero":
        // Frame the Hero title (Asymmetrically spaced to prevent overlapping text)
        pA = { x: width / 2 - cardW / 2, y: height * 0.74, scale: 1.0, rotate: -6, opacity: 1 };
        pB = { x: width / 2 - 420 - cardW / 2, y: height * 0.18, scale: 1.05, rotate: 8, opacity: 1 };
        pC = { x: width / 2 + 420 - cardW / 2, y: height * 0.40, scale: 0.95, rotate: -4, opacity: 1 };
        break;
      case "double-marquee":
        // Frame the horizontal marquee beautifully
        pA = { x: width * 0.05, y: height * 0.20, scale: 1.0, rotate: -5, opacity: 1 };
        pB = { x: width - cardW - width * 0.05, y: height * 0.25, scale: 1.02, rotate: 8, opacity: 1 };
        pC = { x: width * 0.12, y: height * 0.72, scale: 0.95, rotate: -3, opacity: 1 };
        break;
      case "learning-path": // Progress component on homepage
        // Frame the progress component/cards
        pA = { x: width * 0.05, y: height * 0.35, scale: 1.0, rotate: -8, opacity: 1 };
        pB = { x: width - cardW - width * 0.05, y: height * 0.25, scale: 1.02, rotate: 10, opacity: 1 };
        pC = { x: width - cardW - width * 0.08, y: height * 0.65, scale: 0.95, rotate: -5, opacity: 0.95 };
        break;
      case "progress": // Progress page
        pA = { x: width * 0.08, y: height * 0.20, scale: 1.0, rotate: -5, opacity: 1 };
        pB = { x: width - cardW - width * 0.08, y: height * 0.30, scale: 1.02, rotate: 6, opacity: 1 };
        pC = { x: width * 0.10, y: height * 0.68, scale: 0.95, rotate: -3, opacity: 0.95 };
        break;

      case "tenses": // Tenses grid page
        pA = { x: width * 0.04, y: height * 0.20, scale: 1.0, rotate: -5, opacity: 1 };
        pB = { x: width - cardW - width * 0.05, y: height * 0.25, scale: 1.05, rotate: 8, opacity: 1 };
        pC = { x: width * 0.06, y: height * 0.60, scale: 0.95, rotate: -3, opacity: 0.95 };
        break;
      case "stories": // Story pages
        // Surround the Story card without blocking text
        pA = { x: width * 0.05, y: height * 0.30, scale: 1.0, rotate: -6, opacity: 1 };
        pB = { x: width - cardW - width * 0.05, y: height * 0.20, scale: 1.05, rotate: 8, opacity: 1 };
        pC = { x: width * 0.44, y: height * 0.72, scale: 0.95, rotate: 4, opacity: 0.95 };
        break;
      case "quiz": // Quiz page
        // Reposition around the Quiz container
        pA = { x: width * 0.06, y: height * 0.15, scale: 0.95, rotate: -8, opacity: 1 };
        pB = { x: width - cardW - width * 0.06, y: height * 0.40, scale: 0.98, rotate: 6, opacity: 1 };
        pC = { x: width * 0.08, y: height * 0.65, scale: 0.9, rotate: -4, opacity: 0.95 };
        break;
      case "reference": // References page
        // Arrange around the Reference section
        pA = { x: width * 0.06, y: height * 0.25, scale: 0.95, rotate: -3, opacity: 0.95 };
        pB = { x: width - cardW - width * 0.06, y: height * 0.30, scale: 1.0, rotate: 4, opacity: 0.95 };
        pC = { x: width * 0.08, y: height * 0.62, scale: 0.9, rotate: -2, opacity: 0.9 };
        break;
      case "footer":
        // Gather them in the footer horizontally
        pA = { x: width * 0.38, y: height * 0.62, scale: 0.85, rotate: -4, opacity: 0.75 };
        pB = { x: width * 0.47, y: height * 0.60, scale: 0.9, rotate: 2, opacity: 0.8 };
        pC = { x: width * 0.56, y: height * 0.62, scale: 0.85, rotate: 6, opacity: 0.75 };
        break;
      default:
        pA = { x: 50, y: height * 0.48, scale: 1.0, rotate: -5, opacity: 1 };
        pB = { x: 50, y: height * 0.22, scale: 1.0, rotate: 8, opacity: 1 };
        pC = { x: 50, y: height * 0.74, scale: 1.0, rotate: -3, opacity: 1 };
    }
  } else if (screenType === 'tablet') {
    // TABLET LAYOUT (width 768px - 1023px)
    switch (section) {
      case "hero":
        // Frame the Hero title on tablet (Asymmetrically spaced to prevent overlapping text)
        pA = { x: width / 2 - cardW / 2, y: height * 0.72, scale: 0.85, rotate: -6, opacity: 1 };
        pB = { x: width / 2 - 340 - cardW / 2, y: height * 0.18, scale: 0.9, rotate: 8, opacity: 1 };
        pC = { x: width / 2 + 340 - cardW / 2, y: height * 0.38, scale: 0.8, rotate: -4, opacity: 1 };
        break;
      case "double-marquee":
        pA = { x: 20, y: height * 0.22, scale: 0.9, rotate: -5, opacity: 1 };
        pB = { x: width - cardW - 20, y: height * 0.25, scale: 0.9, rotate: 8, opacity: 1 };
        pC = { x: 20, y: height * 0.65, scale: 0.85, rotate: -3, opacity: 1 };
        break;
      case "learning-path":
        pA = { x: 20, y: height * 0.32, scale: 0.9, rotate: -8, opacity: 1 };
        pB = { x: width - cardW - 20, y: height * 0.22, scale: 0.9, rotate: 10, opacity: 1 };
        pC = { x: width - cardW - 30, y: height * 0.65, scale: 0.85, rotate: -5, opacity: 0.95 };
        break;
      case "progress":
        pA = { x: 20, y: height * 0.20, scale: 0.85, rotate: -5, opacity: 1 };
        pB = { x: width - cardW - 20, y: height * 0.25, scale: 0.9, rotate: 6, opacity: 1 };
        pC = { x: 20, y: height * 0.60, scale: 0.8, rotate: -3, opacity: 0.95 };
        break;

      case "tenses":
        pA = { x: 20, y: height * 0.15, scale: 0.85, rotate: -5, opacity: 1 };
        pB = { x: width - cardW - 25, y: height * 0.20, scale: 0.9, rotate: 8, opacity: 1 };
        pC = { x: 20, y: height * 0.65, scale: 0.8, rotate: -3, opacity: 0.95 };
        break;
      case "stories":
        pA = { x: 20, y: height * 0.25, scale: 0.9, rotate: -6, opacity: 1 };
        pB = { x: width - cardW - 20, y: height * 0.15, scale: 0.9, rotate: 8, opacity: 1 };
        pC = { x: width * 0.35, y: height * 0.72, scale: 0.85, rotate: 4, opacity: 0.95 };
        break;
      case "quiz":
        pA = { x: 20, y: height * 0.10, scale: 0.85, rotate: -8, opacity: 1 };
        pB = { x: width - cardW - 20, y: height * 0.35, scale: 0.85, rotate: 6, opacity: 1 };
        pC = { x: 20, y: height * 0.70, scale: 0.8, rotate: -4, opacity: 0.95 };
        break;
      case "reference":
        pA = { x: 20, y: height * 0.20, scale: 0.85, rotate: -3, opacity: 0.95 };
        pB = { x: width - cardW - 20, y: height * 0.25, scale: 0.9, rotate: 4, opacity: 0.95 };
        pC = { x: 20, y: height * 0.60, scale: 0.8, rotate: -2, opacity: 0.9 };
        break;
      case "footer":
        pA = { x: width * 0.28, y: height * 0.62, scale: 0.8, rotate: -4, opacity: 0.75 };
        pB = { x: width * 0.45, y: height * 0.60, scale: 0.85, rotate: 2, opacity: 0.8 };
        pC = { x: width * 0.62, y: height * 0.62, scale: 0.8, rotate: 6, opacity: 0.75 };
        break;
      default:
        pA = { x: 40, y: height * 0.48, scale: 0.95, rotate: -5, opacity: 1 };
        pB = { x: 40, y: height * 0.20, scale: 0.95, rotate: 8, opacity: 1 };
        pC = { x: 40, y: height * 0.76, scale: 0.95, rotate: -3, opacity: 1 };
    }
  } else {
    // MOBILE LAYOUT (width < 768px)
    const mobileY = isPortraitActive ? height - cardH - 350 : height - cardH - 30;
    const footerY = height - cardH - 40;

    switch (section) {
      case "hero":
        // Frame the Hero title on mobile (placed high/low vertically to prevent text overlap)
        pA = { x: width / 2 - 100 - cardW / 2, y: height * 0.74, scale: 0.75, rotate: -6, opacity: 1 };
        pB = { x: width / 2 - cardW / 2, y: height * 0.06, scale: 0.8, rotate: 8, opacity: 1 };
        pC = { x: width / 2 + 100 - cardW / 2, y: height * 0.74, scale: 0.7, rotate: -4, opacity: 1 };
        break;
      case "double-marquee":
        pA = { x: 10, y: mobileY, scale: 0.8, rotate: -5, opacity: 1 };
        pB = { x: width / 2 - cardW / 2, y: mobileY + 10, scale: 0.8, rotate: 8, opacity: 1 };
        pC = { x: width - cardW - 10, y: mobileY, scale: 0.8, rotate: -3, opacity: 1 };
        break;
      case "learning-path":
        pA = { x: width - cardW - 15, y: mobileY - 20, scale: 0.8, rotate: -5, opacity: 1 };
        pB = { x: 15, y: mobileY, scale: 0.85, rotate: 8, opacity: 1 };
        pC = { x: width / 2 - cardW / 2, y: mobileY + 15, scale: 0.8, rotate: -3, opacity: 1 };
        break;
      case "progress":
        pA = { x: 15, y: mobileY, scale: 0.8, rotate: -5, opacity: 1 };
        pB = { x: width * 0.5 - cardW / 2, y: mobileY + 15, scale: 0.85, rotate: 8, opacity: 1 };
        pC = { x: width - cardW - 15, y: mobileY, scale: 0.8, rotate: -3, opacity: 1 };
        break;

      case "tenses":
        pA = { x: 15, y: mobileY, scale: 0.8, rotate: -5, opacity: 1 };
        pB = { x: width / 2 - cardW / 2, y: mobileY + 15, scale: 0.85, rotate: 8, opacity: 1 };
        pC = { x: width - cardW - 15, y: mobileY, scale: 0.8, rotate: -3, opacity: 1 };
        break;
      case "stories":
        pA = { x: 15, y: mobileY + 20, scale: 0.8, rotate: -5, opacity: 1 };
        pB = { x: width - cardW - 15, y: mobileY - 15, scale: 0.85, rotate: 8, opacity: 1 };
        pC = { x: width * 0.4, y: mobileY, scale: 0.8, rotate: -3, opacity: 1 };
        break;
      case "quiz":
        pA = { x: width * 0.15, y: mobileY, scale: 0.8, rotate: -5, opacity: 1 };
        pB = { x: width * 0.5 - cardW / 2, y: mobileY + 20, scale: 0.85, rotate: 8, opacity: 1 };
        pC = { x: width * 0.85 - cardW, y: mobileY - 10, scale: 0.8, rotate: -3, opacity: 1 };
        break;
      case "reference":
        pA = { x: 15, y: mobileY, scale: 0.8, rotate: -5, opacity: 1 };
        pB = { x: width * 0.5 - cardW / 2, y: mobileY + 15, scale: 0.85, rotate: 8, opacity: 1 };
        pC = { x: width - cardW - 15, y: mobileY, scale: 0.8, rotate: -3, opacity: 1 };
        break;
      case "footer":
        pA = { x: width * 0.25 - cardW / 2, y: footerY, scale: 0.7, rotate: -4, opacity: 0.75 };
        pB = { x: width * 0.5 - cardW / 2, y: footerY, scale: 0.75, rotate: 2, opacity: 0.8 };
        pC = { x: width * 0.75 - cardW / 2, y: footerY, scale: 0.7, rotate: 6, opacity: 0.75 };
        break;
      default:
        pA = { x: width * 0.5 - cardW / 2, y: mobileY, scale: 0.8, rotate: -5, opacity: 1 };
        pB = { x: width * 0.18 - cardW / 2, y: mobileY, scale: 0.8, rotate: 8, opacity: 1 };
        pC = { x: width * 0.82 - cardW / 2, y: mobileY, scale: 0.8, rotate: -3, opacity: 1 };
    }
  }

  return { portraitA: pA, portraitB: pB, portraitC: pC };
};

export default function PersistentPortraits() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [footerFullyVisible, setFooterFullyVisible] = useState(false);
  const [screenType, setScreenType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [activePortrait, setActivePortrait] = useState<'fardan' | 'bintang' | 'antoni' | null>(null);
  const [draggableId, setDraggableId] = useState<'fardan' | 'bintang' | 'antoni' | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragControls1 = useDragControls();
  const dragControls2 = useDragControls();
  const dragControls3 = useDragControls();

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Track responsive screen dimensions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWindowSize({ width: w, height: h });
      if (w < 768) {
        setScreenType('mobile');
      } else if (w < 1024) {
        setScreenType('tablet');
      } else {
        setScreenType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Section detector viewport observer (discrete transitions instead of scroll-following)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (pathname !== "/") {
      setFooterFullyVisible(false);
      if (pathname === "/tenses") {
        setActiveSection("tenses");
      } else if (pathname.startsWith("/cerita")) {
        setActiveSection("stories");
      } else if (pathname.startsWith("/quiz")) {
        setActiveSection("quiz");
      } else if (pathname.startsWith("/reference")) {
        setActiveSection("reference");
      } else if (pathname === "/progress") {
        setActiveSection("progress");
      } else {
        setActiveSection("hero");
      }
      return;
    }

    // Home page: lock to hero layout and skip observer to prevent scroll-based positioning
    setActiveSection("hero");
    setFooterFullyVisible(false);
  }, [pathname]);

  // Click Outside to Dismiss Card
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleDocumentClick = () => {
      setActivePortrait(null);
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  // ESC key handler
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePortrait(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Framer Motion spring config (0.8s - 1.2s transition duration feel)
  const springConfig = { stiffness: 45, damping: 15, mass: 1.0 };

  // Base layout coordinate MotionValues for each card
  const baseX1 = useMotionValue(0);
  const baseY1 = useMotionValue(0);
  const baseScale1 = useMotionValue(1);
  const baseRotate1 = useMotionValue(0);
  const baseOpacity1 = useMotionValue(1);

  const baseX2 = useMotionValue(0);
  const baseY2 = useMotionValue(0);
  const baseScale2 = useMotionValue(1);
  const baseRotate2 = useMotionValue(0);
  const baseOpacity2 = useMotionValue(1);

  const baseX3 = useMotionValue(0);
  const baseY3 = useMotionValue(0);
  const baseScale3 = useMotionValue(1);
  const baseRotate3 = useMotionValue(0);
  const baseOpacity3 = useMotionValue(1);

  // Apply smooth springs to base layout values
  const springX1 = useSpring(baseX1, springConfig);
  const springY1 = useSpring(baseY1, springConfig);
  const springScale1 = useSpring(baseScale1, springConfig);
  const springRotate1 = useSpring(baseRotate1, springConfig);
  const springOpacity1 = useSpring(baseOpacity1, springConfig);

  const springX2 = useSpring(baseX2, springConfig);
  const springY2 = useSpring(baseY2, springConfig);
  const springScale2 = useSpring(baseScale2, springConfig);
  const springRotate2 = useSpring(baseRotate2, springConfig);
  const springOpacity2 = useSpring(baseOpacity2, springConfig);

  const springX3 = useSpring(baseX3, springConfig);
  const springY3 = useSpring(baseY3, springConfig);
  const springScale3 = useSpring(baseScale3, springConfig);
  const springRotate3 = useSpring(baseRotate3, springConfig);
  const springOpacity3 = useSpring(baseOpacity3, springConfig);

  const customPos1 = useRef<{ x: number; y: number } | null>(null);
  const customPos2 = useRef<{ x: number; y: number } | null>(null);
  const customPos3 = useRef<{ x: number; y: number } | null>(null);

  // Update layout targets whenever activeSection, window size, or active portrait changes
  useEffect(() => {
    const layout = getLayoutForSection(
      activeSection,
      windowSize.width,
      windowSize.height,
      screenType,
      activePortrait !== null
    );

    const isHero = activeSection === "hero";

    baseX1.set(isHero && customPos1.current ? customPos1.current.x : layout.portraitA.x);
    baseY1.set(isHero && customPos1.current ? customPos1.current.y : layout.portraitA.y);
    baseScale1.set(layout.portraitA.scale);
    baseRotate1.set(layout.portraitA.rotate);
    baseOpacity1.set(layout.portraitA.opacity);

    baseX2.set(isHero && customPos2.current ? customPos2.current.x : layout.portraitB.x);
    baseY2.set(isHero && customPos2.current ? customPos2.current.y : layout.portraitB.y);
    baseScale2.set(layout.portraitB.scale);
    baseRotate2.set(layout.portraitB.rotate);
    baseOpacity2.set(layout.portraitB.opacity);

    baseX3.set(isHero && customPos3.current ? customPos3.current.x : layout.portraitC.x);
    baseY3.set(isHero && customPos3.current ? customPos3.current.y : layout.portraitC.y);
    baseScale3.set(layout.portraitC.scale);
    baseRotate3.set(layout.portraitC.rotate);
    baseOpacity3.set(layout.portraitC.opacity);
  }, [activeSection, windowSize, screenType, activePortrait]);

  // Global mouse position tracking for parallax offsets
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx * 20);
      mouseY.set(ny * 20);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [mouseX, mouseY]);

  // Final animation output values bound directly to DOM nodes
  const x1 = useMotionValue(0);
  const y1 = useMotionValue(0);
  const scale1 = useMotionValue(1);
  const rotate1 = useMotionValue(0);
  const opacity1 = useMotionValue(1);

  const x2 = useMotionValue(0);
  const y2 = useMotionValue(0);
  const scale2 = useMotionValue(1);
  const rotate2 = useMotionValue(0);
  const opacity2 = useMotionValue(1);

  const x3 = useMotionValue(0);
  const y3 = useMotionValue(0);
  const scale3 = useMotionValue(1);
  const rotate3 = useMotionValue(0);
  const opacity3 = useMotionValue(1);

  const footerFullyVisibleRef = useRef(false);
  useEffect(() => {
    footerFullyVisibleRef.current = footerFullyVisible;
  }, [footerFullyVisible]);

  // Sync state reference inside high-frequency RAF loop
  const activePortraitRef = useRef<string | null>(null);
  const draggableIdRef = useRef<string | null>(null);
  useEffect(() => {
    activePortraitRef.current = activePortrait;
  }, [activePortrait]);

  useEffect(() => {
    draggableIdRef.current = draggableId;
  }, [draggableId]);

  // continuous RAF loop to drive float offsets & mouse parallax
  useEffect(() => {
    let rafId: number;

    const floatA = {
      ampX: 12, ampY: 12, ampRotate: 3, ampScale: 0.015,
      speedX: 0.8, speedY: 0.9, speedRot: 0.6, speedScale: 0.5,
      phX: 0, phY: 1, phRot: 2, phScale: 3,
      depth: 1.0 // Bintang (front)
    };

    const floatB = {
      ampX: 8, ampY: 8, ampRotate: 2, ampScale: 0.01,
      speedX: 0.6, speedY: 0.7, speedRot: 0.5, speedScale: 0.4,
      phX: 1.5, phY: 2.5, phRot: 0.5, phScale: 1.2,
      depth: 0.6 // Fardan (middle)
    };

    const floatC = {
      ampX: 6, ampY: 6, ampRotate: 1.5, ampScale: 0.008,
      speedX: 0.5, speedY: 0.4, speedRot: 0.3, speedScale: 0.3,
      phX: 3.0, phY: 0.5, phRot: 1.8, phScale: 2.2,
      depth: 0.3 // Antoni (back)
    };

    const tick = () => {
      const time = Date.now() * 0.001;
      
      const isGathered = activeSection === "footer";
      const decay = footerFullyVisibleRef.current ? 0.0 : (isGathered ? 0.2 : 1.0);

      const pmX = springMouseX.get();
      const pmY = springMouseY.get();

      // Card 1: Bintang (Portrait A)
      const isActive1 = activePortraitRef.current === 'bintang';
      const isDragging1 = draggableIdRef.current === 'bintang';
      const fX1 = Math.sin(time * floatA.speedX + floatA.phX) * floatA.ampX * decay;
      const fY1 = Math.cos(time * floatA.speedY + floatA.phY) * floatA.ampY * decay;
      const fR1 = Math.sin(time * floatA.speedRot + floatA.phRot) * floatA.ampRotate * decay;
      const fS1 = Math.sin(time * floatA.speedScale + floatA.phScale) * floatA.ampScale * decay;
      if (!isDragging1) {
        x1.set(springX1.get() + fX1 + pmX * floatA.depth * decay);
        y1.set(springY1.get() + fY1 + pmY * floatA.depth * decay);
      } else {
        const targetX = x1.get() - fX1 - pmX * floatA.depth * decay;
        const targetY = y1.get() - fY1 - pmY * floatA.depth * decay;
        customPos1.current = { x: targetX, y: targetY };
        baseX1.set(targetX);
        baseY1.set(targetY);
        springX1.set(targetX);
        springY1.set(targetY);
      }
      scale1.set(springScale1.get() * (1 + fS1) * (isActive1 ? 1.1 : 1.0));
      rotate1.set(springRotate1.get() + fR1);
      opacity1.set(springOpacity1.get() * (footerFullyVisibleRef.current ? 0.85 : 1));

      // Card 2: Fardan (Portrait B)
      const isActive2 = activePortraitRef.current === 'fardan';
      const isDragging2 = draggableIdRef.current === 'fardan';
      const fX2 = Math.sin(time * floatB.speedX + floatB.phX) * floatB.ampX * decay;
      const fY2 = Math.cos(time * floatB.speedY + floatB.phY) * floatB.ampY * decay;
      const fR2 = Math.sin(time * floatB.speedRot + floatB.phRot) * floatB.ampRotate * decay;
      const fS2 = Math.sin(time * floatB.speedScale + floatB.phScale) * floatB.ampScale * decay;
      if (!isDragging2) {
        x2.set(springX2.get() + fX2 + pmX * floatB.depth * decay);
        y2.set(springY2.get() + fY2 + pmY * floatB.depth * decay);
      } else {
        const targetX = x2.get() - fX2 - pmX * floatB.depth * decay;
        const targetY = y2.get() - fY2 - pmY * floatB.depth * decay;
        customPos2.current = { x: targetX, y: targetY };
        baseX2.set(targetX);
        baseY2.set(targetY);
        springX2.set(targetX);
        springY2.set(targetY);
      }
      scale2.set(springScale2.get() * (1 + fS2) * (isActive2 ? 1.1 : 1.0));
      rotate2.set(springRotate2.get() + fR2);
      opacity2.set(springOpacity2.get() * (footerFullyVisibleRef.current ? 0.85 : 1));

      // Card 3: Antoni (Portrait C)
      const isActive3 = activePortraitRef.current === 'antoni';
      const isDragging3 = draggableIdRef.current === 'antoni';
      const fX3 = Math.sin(time * floatC.speedX + floatC.phX) * floatC.ampX * decay;
      const fY3 = Math.cos(time * floatC.speedY + floatC.phY) * floatC.ampY * decay;
      const fR3 = Math.sin(time * floatC.speedRot + floatC.phRot) * floatC.ampRotate * decay;
      const fS3 = Math.sin(time * floatC.speedScale + floatC.phScale) * floatC.ampScale * decay;
      if (!isDragging3) {
        x3.set(springX3.get() + fX3 + pmX * floatC.depth * decay);
        y3.set(springY3.get() + fY3 + pmY * floatC.depth * decay);
      } else {
        const targetX = x3.get() - fX3 - pmX * floatC.depth * decay;
        const targetY = y3.get() - fY3 - pmY * floatC.depth * decay;
        customPos3.current = { x: targetX, y: targetY };
        baseX3.set(targetX);
        baseY3.set(targetY);
        springX3.set(targetX);
        springY3.set(targetY);
      }
      scale3.set(springScale3.get() * (1 + fS3) * (isActive3 ? 1.1 : 1.0));
      rotate3.set(springRotate3.get() + fR3);
      opacity3.set(springOpacity3.get() * (footerFullyVisibleRef.current ? 0.85 : 1));

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [
    activeSection,
    springX1, springY1, springScale1, springRotate1, springOpacity1,
    springX2, springY2, springScale2, springRotate2, springOpacity2,
    springX3, springY3, springScale3, springRotate3, springOpacity3,
    springMouseX, springMouseY
  ]);

  const lastPointerDownRef = useRef<{ [key: string]: number }>({});

  const handlePointerDown = (e: React.PointerEvent, id: 'fardan' | 'bintang' | 'antoni', controls: any) => {
    e.stopPropagation();
    const now = Date.now();
    const lastTime = lastPointerDownRef.current[id] || 0;

    if (now - lastTime < 300) {
      // Double click / pointer down detected!
      // Cancel any pending single-click action
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      setDraggableId(id);
      // Start drag session immediately on this second pointer down
      controls.start(e);
    } else {
      // Single press: queue the single-click bio toggle
      lastPointerDownRef.current[id] = now;
      
      // If we are already dragging this card, don't trigger bio
      // If we are already dragging this card, single click locks it and opens bio
      if (draggableId === id) {
        setDraggableId(null);
        setActivePortrait(prev => prev === id ? null : id);
        return;
      }

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        setActivePortrait(prev => prev === id ? null : id);
      }, 250);
    }
  };

  const profiles = {
    fardan: {
      name: "Fardan",
      role: "Project Leader",
      desc: "Responsible for UI Design, React Development, Content Planning, Website Architecture."
    },
    bintang: {
      name: "Nursyahidah Hanifah",
      role: "Visual Designer",
      desc: "Crafted the visual identity, typography, color system, and overall aesthetics to create a modern and cohesive learning experience."
    },
    antoni: {
      name: "Novita Anggraini",
      role: "Curriculum Design",
      desc: "Responsible for curriculum design, preparing learning materials, grammar validation, exercise design, and learning activities."
    }
  };

  const isDesktopOrTablet = screenType === 'desktop' || screenType === 'tablet';

  const size = screenType === 'mobile' ? '70px' : (screenType === 'tablet' ? '94px' : '116px');

  return (
    <div ref={containerRef} className="persistent-portraits-layer" style={{ zIndex: activeSection === 'hero' ? 2 : 99 }}>
      {/* Portrait A: Bintang (Front portrait - Middle in list) */}
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls1}
        dragConstraints={containerRef}
        dragElastic={0.2}
        dragMomentum={true}
        className={`floating-portrait-card ${activePortrait === 'bintang' ? 'is-active' : ''} ${draggableId === 'bintang' ? 'is-dragging-mode' : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          x: x1,
          y: y1,
          scale: scale1,
          rotate: rotate1,
          opacity: opacity1,
          zIndex: activePortrait === 'bintang' ? 6 : 5,
          cursor: draggableId === 'bintang' 
            ? "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, grab" 
            : "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer"
        }}
        onPointerDown={(e) => handlePointerDown(e, 'bintang', dragControls1)}
      >
        <div className="floating-portrait-card__inner" style={{ width: '100%', height: '100%' }}>
          <img
            src="/assets/hijab-woman.jpg"
            className="floating-portrait-card__image"
            alt="Nursyahidah Hanifah - Visual Designer"
          />
        </div>

        {/* Desktop/Tablet Bio Card Panel */}
        <AnimatePresence>
          {isDesktopOrTablet && activePortrait === 'bintang' && (
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, scale: 0.95, x: 15, y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: 15, y: "-50%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button className="profile-card__close-btn" onClick={() => setActivePortrait(null)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 1L11 11M1 11L11 1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h3 className="profile-card__name">{profiles.bintang.name}</h3>
              <p className="profile-card__role">{profiles.bintang.role}</p>
              <div className="profile-card__divider" />
              <p className="profile-card__desc">{profiles.bintang.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Portrait B: Fardan (Middle portrait - Top in list) */}
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls2}
        dragConstraints={containerRef}
        dragElastic={0.2}
        dragMomentum={true}
        className={`floating-portrait-card ${activePortrait === 'fardan' ? 'is-active' : ''} ${draggableId === 'fardan' ? 'is-dragging-mode' : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          x: x2,
          y: y2,
          scale: scale2,
          rotate: rotate2,
          opacity: opacity2,
          zIndex: activePortrait === 'fardan' ? 6 : 4,
          cursor: draggableId === 'fardan' 
            ? "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, grab" 
            : "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer"
        }}
        onPointerDown={(e) => handlePointerDown(e, 'fardan', dragControls2)}
      >
        <div className="floating-portrait-card__inner" style={{ width: '100%', height: '100%' }}>
          <img
            src="/ferdian.png"
            className="floating-portrait-card__image"
            alt="Fardan - Project Leader"
          />
        </div>

        {/* Desktop/Tablet Bio Card Panel */}
        <AnimatePresence>
          {isDesktopOrTablet && activePortrait === 'fardan' && (
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, scale: 0.95, x: 15, y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: 15, y: "-50%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button className="profile-card__close-btn" onClick={() => setActivePortrait(null)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 1L11 11M1 11L11 1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h3 className="profile-card__name">{profiles.fardan.name}</h3>
              <p className="profile-card__role">{profiles.fardan.role}</p>
              <div className="profile-card__divider" />
              <p className="profile-card__desc">{profiles.fardan.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Portrait C: Antoni (Back portrait - Bottom in list) */}
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls3}
        dragConstraints={containerRef}
        dragElastic={0.2}
        dragMomentum={true}
        className={`floating-portrait-card ${activePortrait === 'antoni' ? 'is-active' : ''} ${draggableId === 'antoni' ? 'is-dragging-mode' : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          x: x3,
          y: y3,
          scale: scale3,
          rotate: rotate3,
          opacity: opacity3,
          zIndex: activePortrait === 'antoni' ? 6 : 3,
          cursor: draggableId === 'antoni' 
            ? "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, grab" 
            : "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer"
        }}
        onPointerDown={(e) => handlePointerDown(e, 'antoni', dragControls3)}
      >
        <div className="floating-portrait-card__inner" style={{ width: '100%', height: '100%' }}>
          <img
            src="/assets/hijab-woman-2.jpg"
            className="floating-portrait-card__image"
            alt="Novita Anggraini - Curriculum Design"
          />
        </div>

        {/* Desktop/Tablet Bio Card Panel */}
        <AnimatePresence>
          {isDesktopOrTablet && activePortrait === 'antoni' && (
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, scale: 0.95, x: 15, y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: 15, y: "-50%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button className="profile-card__close-btn" onClick={() => setActivePortrait(null)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 1L11 11M1 11L11 1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h3 className="profile-card__name">{profiles.antoni.name}</h3>
              <p className="profile-card__role">{profiles.antoni.role}</p>
              <div className="profile-card__divider" />
              <p className="profile-card__desc">{profiles.antoni.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Profile Bottom Sheet */}
      <AnimatePresence>
        {!isDesktopOrTablet && activePortrait && (
          <motion.div
            className="profile-card"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button className="profile-card__close-btn" onClick={() => setActivePortrait(null)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1L13 13M1 13L13 1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h3 className="profile-card__name">{profiles[activePortrait].name}</h3>
            <p className="profile-card__role">{profiles[activePortrait].role}</p>
            <div className="profile-card__divider" />
            <p className="profile-card__desc">{profiles[activePortrait].desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
