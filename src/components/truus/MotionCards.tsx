"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CULTURAL_CARDS } from "@/data/cultural";
import { Link } from "@tanstack/react-router";

gsap.registerPlugin(ScrollTrigger);

const getStorySlug = (cardSlug: string) => {
  switch (cardSlug) {
    case "benteng-heritage":
      return "rumah-tua-benteng";
    case "pasar-lama":
      return "kisah-pasar-lama";
    case "sungai-cisadane":
      return "sore-di-cisadane";
    case "budaya-cina-benteng":
      return "festival-cap-go-meh";
    case "kuliner-tangerang":
    default:
      return "kuliner-tangerang";
  }
};

export default function MotionCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia(section);

    // Desktop layout
    mm.add("(min-width: 768px)", () => {
      // Initialize starting values
      // Slide 0 is the base layer, visible initially
      gsap.set(slideRefs.current[0], { "--reveal": 0 });
      gsap.set(contentRefs.current[0], { autoAlpha: 1, y: 0 });
      
      // Slides 1-4 start hidden
      for (let i = 1; i < 5; i++) {
        gsap.set(slideRefs.current[i], { "--reveal": 100 });
        gsap.set(contentRefs.current[i], { autoAlpha: 0, y: 30 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=400%", // 400% of viewport height (4 transition steps)
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Transition to Slide 1
      tl.to(slideRefs.current[1], {
        "--reveal": 0,
        duration: 1.0,
        ease: "none",
      }, 0.0);
      tl.to(contentRefs.current[0], {
        autoAlpha: 0,
        y: -30,
        duration: 0.4,
        ease: "power1.inOut",
      }, 0.0);
      tl.to(contentRefs.current[1], {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 0.6);

      // 2. Transition to Slide 2
      tl.to(slideRefs.current[2], {
        "--reveal": 0,
        duration: 1.0,
        ease: "none",
      }, 1.0);
      tl.to(contentRefs.current[1], {
        autoAlpha: 0,
        y: -30,
        duration: 0.4,
        ease: "power1.inOut",
      }, 1.0);
      tl.to(contentRefs.current[2], {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 1.6);

      // 3. Transition to Slide 3
      tl.to(slideRefs.current[3], {
        "--reveal": 0,
        duration: 1.0,
        ease: "none",
      }, 2.0);
      tl.to(contentRefs.current[2], {
        autoAlpha: 0,
        y: -30,
        duration: 0.4,
        ease: "power1.inOut",
      }, 2.0);
      tl.to(contentRefs.current[3], {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 2.6);

      // 4. Transition to Slide 4
      tl.to(slideRefs.current[4], {
        "--reveal": 0,
        duration: 1.0,
        ease: "none",
      }, 3.0);
      tl.to(contentRefs.current[3], {
        autoAlpha: 0,
        y: -30,
        duration: 0.4,
        ease: "power1.inOut",
      }, 3.0);
      tl.to(contentRefs.current[4], {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 3.6);

      // 5. Image Pan & Zoom Parallax
      CULTURAL_CARDS.forEach((_, i) => {
        const startOffset = i === 0 ? 0 : i - 1;
        tl.to(imgRefs.current[i], {
          scale: 1.05,
          y: -40,
          duration: 1.5,
          ease: "none",
        }, startOffset);
      });

      // 6. Global horizontal progress line
      tl.to(progressBarRef.current, {
        width: "100%",
        duration: 4.0,
        ease: "none",
      }, 0);
    });

    // Mobile layout
    mm.add("(max-width: 767px)", () => {
      // Initialize starting values without large vertical translations for content
      gsap.set(slideRefs.current[0], { "--reveal": 0 });
      gsap.set(contentRefs.current[0], { autoAlpha: 1, y: 0 });
      
      // Slides 1-4 start hidden
      for (let i = 1; i < 5; i++) {
        gsap.set(slideRefs.current[i], { "--reveal": 100 });
        gsap.set(contentRefs.current[i], { autoAlpha: 0, y: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=400%", // 400% of viewport height (4 transition steps)
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Transition to Slide 1
      tl.to(slideRefs.current[1], {
        "--reveal": 0,
        duration: 1.0,
        ease: "none",
      }, 0.0);
      tl.to(contentRefs.current[0], {
        autoAlpha: 0,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 0.0);
      tl.to(contentRefs.current[1], {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 0.4); // Faster transition overlap for mobile cross-fade

      // 2. Transition to Slide 2
      tl.to(slideRefs.current[2], {
        "--reveal": 0,
        duration: 1.0,
        ease: "none",
      }, 1.0);
      tl.to(contentRefs.current[1], {
        autoAlpha: 0,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 1.0);
      tl.to(contentRefs.current[2], {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 1.4);

      // 3. Transition to Slide 3
      tl.to(slideRefs.current[3], {
        "--reveal": 0,
        duration: 1.0,
        ease: "none",
      }, 2.0);
      tl.to(contentRefs.current[2], {
        autoAlpha: 0,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 2.0);
      tl.to(contentRefs.current[3], {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 2.4);

      // 4. Transition to Slide 4
      tl.to(slideRefs.current[4], {
        "--reveal": 0,
        duration: 1.0,
        ease: "none",
      }, 3.0);
      tl.to(contentRefs.current[3], {
        autoAlpha: 0,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 3.0);
      tl.to(contentRefs.current[4], {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, 3.4);

      // 5. Image Pan & Zoom Parallax (y: -20 instead of -40 to remain safe within the expanded container height)
      CULTURAL_CARDS.forEach((_, i) => {
        const startOffset = i === 0 ? 0 : i - 1;
        tl.to(imgRefs.current[i], {
          scale: 1.05,
          y: -20,
          duration: 1.5,
          ease: "none",
        }, startOffset);
      });

      // 6. Global horizontal progress line
      tl.to(progressBarRef.current, {
        width: "100%",
        duration: 4.0,
        ease: "none",
      }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="motion-card-section floema-collections-section"
      id="motion-card-section"
    >
      <div className="floema-container">
        {/* Global Horizontal Dividing Line (Middle of screen) */}
        <div className="floema-global-divider">
          <div
            ref={progressBarRef}
            className="floema-global-progress"
          />
        </div>

        {/* Slide Deck */}
        <div className="floema-slides">
          {CULTURAL_CARDS.map((card, i) => (
            <div
              key={card.slug}
              className={`floema-slide floema-slide--${i}`}
            >
              {/* Media container with custom reveal property */}
              <div
                ref={(el) => { slideRefs.current[i] = el; }}
                className="floema-slide__media"
                style={{ "--reveal": 100 } as React.CSSProperties}
              >
                <div
                  ref={(el) => { imgRefs.current[i] = el; }}
                  className="floema-slide__media-inner"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="floema-slide__image"
                  />
                </div>
              </div>

              {/* Text content layout — structured on the Floema grid */}
              <div
                ref={(el) => { contentRefs.current[i] = el; }}
                className="floema-slide__content"
              >
                {/* Top Row: Index */}
                <span className="floema-slide__index">0{i + 1}</span>
                
                {/* Header group above the line containing Title inside capsule wrapper */}
                <div className="floema-slide__header-group">
                  <h3 className="floema-slide__title-capsule">{card.title}</h3>
                </div>

                {/* Bottom Row Left: Slogan / Sidetext */}
                <span className="floema-slide__progress-label">
                  Tenses Around Us
                </span>

                {/* Bottom Row Right: Description, Example, and CTA Button */}
                <div className="floema-slide__body">
                  <p className="floema-slide__desc">{card.short}</p>

                  <div className="floema-slide__cta-wrapper">
                    <Link
                      to="/cerita/$slug"
                      params={{ slug: getStorySlug(card.slug) }}
                      className="floema-slide__cta"
                      style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
                    >
                      <span className="floema-slide__cta-text">
                        baca cerita
                      </span>
                      <span className="floema-slide__cta-icon">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 9L9 1M9 1H3M9 1V7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating bottom prompt */}
        <div className="floema-bottom-prompt">
          <span className="floema-bottom-text">Scroll to explore ↓</span>
        </div>
      </div>
    </section>
  );
}
