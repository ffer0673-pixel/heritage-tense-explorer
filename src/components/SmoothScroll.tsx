'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouterState } from "@tanstack/react-router";

export function SmoothScroll() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        // Dynamic Tab Title Change
        const originalTitle = document.title;
        const handleVisibility = () => {
            document.title = document.hidden ? "Hey, over here!👋" : originalTitle;
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // Store lenis on window so other components can access it
        (window as any).__lenis = lenis;

        return () => {
            lenis.destroy();
            document.removeEventListener('visibilitychange', handleVisibility);
            delete (window as any).__lenis;
        };
    }, []);

    // Reset scroll on route change
    useEffect(() => {
        if (typeof window === "undefined") return;
        const lenis = (window as any).__lenis;
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
