import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VimeoHero from "@/components/truus/VimeoHero";
import ServiceCards from "@/components/truus/ServiceCards";
import TransitionScribble from "@/components/truus/TransitionScribble";
import MotionCards from "@/components/truus/MotionCards";
import PersistentPortraits from "@/components/truus/PersistentPortraits";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heritage Tense Explorer — Learn English Through Tangerang Local Wisdom" },
      { name: "description", content: "Learn English through the rich cultural heritage and local wisdom of Tangerang. Explore tenses dynamically." },
      { property: "og:title", content: "Heritage Tense Explorer" },
      { property: "og:description", content: "Learn English through the rich cultural heritage and local wisdom of Tangerang. Explore tenses dynamically." },
    ],
  }),
  component: Home,
});

function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      // 1. Initial hidden sets
      gsap.set([".vimeo-hero__title", ".motion-card__underline-svg", ".homepage-portraits-wrapper", ".navbar-logo-container", ".nav-menu-right"], {
        opacity: 0
      });

      // 2. Animate heading title (fade and slide up)
      tl.fromTo(".vimeo-hero__title", 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2 }
      );

      // 3. Animate underline SVG (fade and grow from left to right)
      tl.fromTo(".motion-card__underline-svg", 
        { opacity: 0, scaleX: 0, transformOrigin: "left center" },
        { opacity: 1, scaleX: 1, duration: 0.8 },
        "-=0.6"
      );

      // 4. Animate persistent portraits layer wrapper (fade in and settle scale)
      tl.fromTo(".homepage-portraits-wrapper", 
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
        "-=0.4"
      );

      // 5. Animate navbar logo and menu links (slide down and fade in)
      tl.fromTo([".navbar-logo-container", ".nav-menu-right"],
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        "-=0.6"
      );

      // 6. Scroll animation to fade out portraits as we scroll down
      gsap.to(".persistent-portraits-layer", {
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        y: -150,
        ease: "none"
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="hero" className="main-header">
        <VimeoHero />
        <div className="homepage-portraits-wrapper" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
          <PersistentPortraits />
        </div>
      </section>

      <section id="image-reveal">
        <MotionCards />
      </section>

      <main>
        <div className="content-section service-cards-wrapper">
          <ServiceCards />
        </div>
      </main>
      <TransitionScribble />
    </>
  );
}
