'use client';

import { useRef } from 'react';
import FloatingObjects from './FloatingObjects';

export default function VimeoHero() {
    const heroRef = useRef<HTMLDivElement>(null);

    return (
        <div className="vimeo-hero" ref={heroRef}>
            {/* Floating educational objects background */}
            <FloatingObjects containerRef={heroRef} />

            {/* ① Headline — bottom left, word-by-word layout */}
            <div className="home-header__title">
                <h1 className="vimeo-hero__title">
                    <span className="vimeo-hero__word is--relative">
                        <span>Tenses</span>
                        <div className="home-header__smiley" style={{ left: '70%' }}>
                            <img
                                src="/assets/VimeoHero SVG/smiley-face.svg"
                                alt=""
                                className="home-header__smiley-svg"
                            />
                        </div>
                    </span>

                    <span className="vimeo-hero__word is--relative">
                        <div className="home-header__star">
                            <div className="home-header__star-inner">
                                <img
                                    src="/assets/VimeoHero SVG/pink-star.svg"
                                    alt=""
                                    className="home-header__star-svg"
                                />
                            </div>
                        </div>
                        {/* Oval underline */}
                        <img
                            src="/assets/VimeoHero SVG/oval-underline.svg"
                            alt=""
                            className="home-header__title-line-svg"
                        />
                        <span>AroundUs</span>
                    </span>
                </h1>
            </div>
        </div>
    );
}
