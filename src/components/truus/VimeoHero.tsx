'use client';

import { useRef } from 'react';
import FloatingObjects from './FloatingObjects';

export default function VimeoHero() {
    const heroRef = useRef<HTMLDivElement>(null);

    return (
        <div className="vimeo-hero" ref={heroRef}>
            {/* Floating educational objects background */}
            <FloatingObjects containerRef={heroRef} />

            {/* Academic Supervisor — top-left, below the navbar logo */}
            <div className="hero-supervisor">
                <p className="hero-supervisor__label">Academic Supervisor</p>
                <p className="hero-supervisor__name">ISNANIAH, S.Pd., M.Pd.</p>
            </div>

            {/* Pinned main landing title for the Hero section */}
            <div className="home-header__title">
                <h2 className="vimeo-hero__title">
                    Learn English
                    <br />
                    Through
                    <br />
                    <em>Tangerang Local Wisdom.</em>
                </h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 634 28" fill="none" className="motion-card__underline-svg">
                    <path className="motion-card__underline-path" d="M2 26C41.0237 23.1556 79.9927 19.9419 118.634 15.5521C169.106 9.98633 227.314 2.42393 275.206 2C280.46 2.57436 264.768 4.99488 262.462 5.55556C257.837 6.43078 252.529 7.47009 247.317 8.59146C239.594 10.3556 212.496 15.8393 226.932 19.8051C239.594 22.6359 263.663 21.9521 280.978 21.3504C314.817 19.9829 349.311 16.7419 383.204 14.7863C465.931 9.5077 549.191 10.547 632 14.1436" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}
