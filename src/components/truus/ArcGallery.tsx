'use client';

import { useEffect, useRef, useCallback, ReactNode } from 'react';
import { useScroll, useSpring, useMotionValueEvent, useInView } from 'framer-motion';

interface ArcGalleryProps {
    itemsCount: number;
    scrollMultiplier?: number;
    arcAmplitude?: number;
    cardWidth?: number;
    cardGap?: number;
    children: (index: number) => ReactNode;
}

export default function ArcGallery({
    itemsCount,
    scrollMultiplier = 1.2,
    arcAmplitude = 70,
    cardWidth = 220,
    cardGap = 20,
    children,
}: ArcGalleryProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Viewport visibility observer to avoid performance overhead off-screen
    const isInView = useInView(viewportRef, { margin: "200px 0px" });

    const CARD_STRIDE = cardWidth + cardGap;
    const totalTrack = itemsCount * CARD_STRIDE;

    // ── Drag state ────────────────────────────────────────────────────────
    const isDragging = useRef(false);
    const dragStartXRef = useRef(0);
    const dragOffsetRef = useRef(0);
    const dragStartSavedRef = useRef(0);

    // ── Scroll-driven movement ────────────────────────────────────────────
    const { scrollY } = useScroll();
    const smoothedScrollY = useSpring(scrollY, {
        damping: 40,
        stiffness: 300,
        mass: 0.3,
    });

    // ── Card position updater (imperative, runs on every scroll/drag tick) ──
    const updateCardsRef = useRef<() => void>(() => {});
    updateCardsRef.current = () => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const offset =
            -(smoothedScrollY.get() * scrollMultiplier) + dragOffsetRef.current;

        const vpWidth = viewport.offsetWidth;
        const viewportCenter = vpWidth / 2;
        const centeringShift = -totalTrack / 2 + viewportCenter - cardWidth / 2;

        for (let i = 0; i < itemsCount; i++) {
            const wrapper = wrapperRefs.current[i];
            if (!wrapper) continue;

            const baseX = i * CARD_STRIDE;
            const rawX =
                ((baseX + offset) % totalTrack + totalTrack) % totalTrack;
            const visualX = rawX + centeringShift;

            const cardCenter = visualX + cardWidth / 2;
            const dist = (cardCenter - viewportCenter) / (vpWidth / 2);
            const clamped = Math.max(-1.5, Math.min(1.5, dist));

            const ty = Math.cos(clamped * Math.PI * 0.5) * (-arcAmplitude);
            const rot = clamped * 12;

            wrapper.style.transform =
                `translateX(${visualX}px) translateY(${ty}px) rotate(${rot}deg)`;
        }
    };

    // ── Subscribe to spring scroll ──
    useMotionValueEvent(smoothedScrollY, 'change', () => {
        if (isInView) {
            updateCardsRef.current();
        }
    });

    // Ensure initial layout update when entering view
    useEffect(() => {
        if (isInView) {
            updateCardsRef.current();
        }
    }, [isInView]);

    // ── Drag / swipe interaction ──────────────────────────────────────────
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const onMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            dragStartXRef.current = e.clientX;
            dragStartSavedRef.current = dragOffsetRef.current;
            viewport.style.cursor = 'grabbing';
        };
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            dragOffsetRef.current =
                dragStartSavedRef.current + (e.clientX - dragStartXRef.current);
            updateCardsRef.current();
        };
        const onMouseUp = () => {
            isDragging.current = false;
            viewport.style.cursor = 'grab';
        };

        const onTouchStart = (e: TouchEvent) => {
            isDragging.current = true;
            dragStartXRef.current = e.touches[0].clientX;
            dragStartSavedRef.current = dragOffsetRef.current;
        };
        const onTouchMove = (e: TouchEvent) => {
            if (!isDragging.current) return;
            dragOffsetRef.current =
                dragStartSavedRef.current + (e.touches[0].clientX - dragStartXRef.current);
            updateCardsRef.current();
        };
        const onTouchEnd = () => { isDragging.current = false; };

        viewport.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        viewport.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);

        return () => {
            viewport.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            viewport.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [totalTrack]);

    // Force initial cards layout on mount
    useEffect(() => {
        updateCardsRef.current();
    }, [itemsCount]);

    return (
        <div ref={viewportRef} className="arc-gallery-viewport">
            {Array.from({ length: itemsCount }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => { wrapperRefs.current[i] = el; }}
                    className="arc-card-wrapper"
                >
                    {children(i)}
                </div>
            ))}
        </div>
    );
}
