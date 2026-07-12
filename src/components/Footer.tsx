'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WIGGLE_CONFIG } from '@/lib/truus-data';
import { Link, useRouterState } from '@tanstack/react-router';

function initWiggle(element: HTMLElement | Element, intensity: number) {
    const target = element.querySelector('[data-wiggle-target]') || element;
    gsap.set(target, { transformOrigin: 'center center' });
    let tween: gsap.core.Tween | undefined;
    const onEnter = () => { tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' }); };
    const onLeave = () => { if (tween) { tween.kill(); gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' }); } };
    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);
    return () => { element.removeEventListener('mouseenter', onEnter); element.removeEventListener('mouseleave', onLeave); };
}

export function Footer() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const isHome = pathname === "/";

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // ─── Credits pop-out ───
        const creditsWrapper = document.querySelector('.footer-credits-wrapper');
        const creditsBox = creditsWrapper?.querySelector('.credits-box') as HTMLElement | null;
        const creditsItems = creditsBox?.querySelectorAll('.credits-item');
        const creditsBtn = creditsWrapper?.querySelector('.footer-credits') as HTMLElement | null;

        if (creditsWrapper && creditsBox && creditsItems && creditsBtn) {
            // Measure box dimensions
            gsap.set(creditsBox, { visibility: 'visible', width: 'auto', height: 'auto', opacity: 1 });
            const boxRect = creditsBox.getBoundingClientRect();
            const boxHeight = boxRect.height;
            const startY = creditsBtn.offsetHeight + 15;

            gsap.set(creditsBox, { visibility: 'hidden', width: 0, height: 0, opacity: 0, y: startY });
            gsap.set(creditsItems, { y: boxHeight });

            const onEnter = () => {
                gsap.set(creditsBox, { visibility: 'visible' });
                gsap.killTweensOf([creditsBox, creditsItems]);
                gsap.to(creditsBox, { width: 330, height: 95, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
                gsap.to(creditsItems, { y: 0, duration: 0.5, ease: 'back.out(1.4)', stagger: 0.08, delay: 0.1 });
            };

            const onLeave = () => {
                gsap.killTweensOf([creditsBox, creditsItems]);
                gsap.to(creditsItems, { y: boxHeight, duration: 0.25, ease: 'power2.in' });
                gsap.to(creditsBox, {
                    width: 0,
                    height: 0,
                    opacity: 0,
                    y: startY,
                    duration: 0.35,
                    ease: 'power3.in',
                    delay: 0.1,
                    onComplete: () => gsap.set(creditsBox, { visibility: 'hidden' })
                });
            };

            creditsWrapper.addEventListener('mouseenter', onEnter);
            creditsWrapper.addEventListener('mouseleave', onLeave);
        }

        // ─── Floating stickers animation ───
        const stickers = document.querySelectorAll('.footer-sticker');
        stickers.forEach(sticker => {
            const baseRotation = parseFloat(window.getComputedStyle(sticker).getPropertyValue('rotate') || '0');
            const PROXIMITY_RADIUS = 180, STRENGTH = 4, MAX_PUSH = 55, MIN_SPEED = 3;
            let prevX = 0, prevY = 0;
            const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

            const onMove = (e: MouseEvent) => {
                const dx = e.clientX - prevX, dy = e.clientY - prevY;
                prevX = e.clientX; prevY = e.clientY;
                const rect = sticker.getBoundingClientRect();
                const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
                const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
                const onSticker = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
                const speed = Math.hypot(dx, dy);

                const target = e.target as HTMLElement | null;
                const isOverCreditsBox = target ? target.closest('.credits-box') !== null : false;

                if (!onSticker && !isOverCreditsBox && dist < PROXIMITY_RADIUS && speed > MIN_SPEED) {
                    const falloff = 1 - (dist / PROXIMITY_RADIUS);
                    const pushX = clamp(dx * STRENGTH * falloff, MAX_PUSH);
                    const pushY = clamp(dy * STRENGTH * falloff, MAX_PUSH);
                    gsap.killTweensOf(sticker);
                    gsap.to(sticker, { x: pushX, y: pushY, rotation: baseRotation + pushX * 0.25, duration: 0.18, ease: 'power3.out' });
                    gsap.to(sticker, { x: 0, y: 0, rotation: baseRotation, duration: 1.1, ease: 'elastic.out(1, 0.35)', delay: 0.18 });
                }
            };
            document.addEventListener('mousemove', onMove);
        });

        // ─── Wiggle on footer interactive elements ───
        const wiggleTargets = [
            { selector: '.footer-column h3', key: 'jobHeading' },
            { selector: '.credits-name', key: 'socials' },
        ];
        wiggleTargets.forEach(({ selector, key }) => {
            document.querySelectorAll(selector).forEach(el => initWiggle(el, WIGGLE_CONFIG[key]));
        });

    }, []);

    return (
        <>
            {/* Call to Action Section */}
            {isHome && (
                <section className="footer-cta-section">
                    <div className="footer-cta-container">
                        <h2 className="footer-cta-title">Ready to Master All 16 <span className="italic-text">English Tenses</span>?</h2>
                        <p className="footer-cta-subtitle">
                            Continue your English learning journey through Tangerang's stories, culture, and local wisdom.
                        </p>
                        <Link
                            to="/quiz"
                            className="footer-cta-btn"
                            style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
                        >
                            Start Learning
                        </Link>
                    </div>
                </section>
            )}

            {/* Main Footer wrapper */}
            <footer className="main-footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        {/* Column 1: Brand & Description */}
                        <div className="footer-column brand-column">
                            <h3>Heritage Tense Explorer</h3>
                            <p className="footer-desc">
                                Learn all 16 English tenses through stories, culture, landmarks, and local wisdom from Tangerang.
                            </p>
                        </div>

                        {/* Column 2: Explore links */}
                        <div className="footer-column links-column">
                            <span className="footer-badge">Explore</span>
                            <ul className="footer-links-list">
                                <li><Link to="/" style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Home</Link></li>
                                <li><Link to="/tenses" style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Tenses</Link></li>
                                <li><Link to="/quiz" style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Quiz</Link></li>
                                <li><Link to="/cerita" style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Stories</Link></li>
                                <li><Link to="/progress" style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Progress</Link></li>
                                <li><Link to="/reference" style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>References</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Learning categories */}
                        <div className="footer-column links-column">
                            <span className="footer-badge">Learning</span>
                            <ul className="footer-links-list">
                                <li><Link to="/formula/$tense" params={{ tense: "simple-present" }} style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Present Tense</Link></li>
                                <li><Link to="/formula/$tense" params={{ tense: "simple-past" }} style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Past Tense</Link></li>
                                <li><Link to="/formula/$tense" params={{ tense: "simple-future" }} style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Future Tense</Link></li>
                                <li><Link to="/formula/$tense" params={{ tense: "past-future" }} style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>Past Future Tense</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: About platform */}
                        <div className="footer-column links-column">
                            <span className="footer-badge">About</span>
                            <ul className="footer-links-list footer-info-list">
                                <li>Made for English Learners</li>
                                <li>Inspired by Tangerang Local Wisdom</li>
                                <li>Interactive Learning Experience</li>
                                <li>Built with React + TypeScript</li>
                            </ul>
                        </div>
                    </div>

                    {/* Stickers */}
                    <div className="footer-stickers">
                        <div className="footer-sticker sticker-smiley">
                            <img src="/assets/Footer-Sticker SVG/footer-sticker-smiley.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                        </div>
                        <div className="footer-sticker sticker-heart">
                            <img src="/assets/Footer-Sticker SVG/footer-sticker-heart.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                        </div>
                        <div className="footer-sticker sticker-hands">
                            <img src="/assets/Footer-Sticker SVG/footer-sticker-hands.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                        </div>
                        <div className="footer-sticker sticker-100">
                            <img src="/assets/Footer-Sticker SVG/footer-sticker-100.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                        </div>
                        <div className="footer-sticker sticker-camera">
                            <img src="/assets/Footer-Sticker SVG/footer-sticker-camera.svg" width="100%" alt="" aria-hidden="true" />
                        </div>
                        <div className="footer-sticker sticker-boom">
                            <img src="/assets/Footer-Sticker SVG/footer-sticker-boom.svg" width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
                        </div>
                    </div>

                    {/* Bottom row: copyright & credits popup */}
                    <div className="footer-bottom-row">
                        <div></div>
                        <div className="footer-credits-wrapper">
                            <div className="credits-box">
                                <div className="credits-content">
                                    <div className="credits-item credit-wiggle">
                                        <div className="overflow-wrapper"><span className="credits-label">design by</span></div>
                                        <div className="overflow-wrapper"><a href="#" className="credits-name" data-wiggle-target="true">Jordan</a></div>
                                    </div>
                                    <div className="credits-item credit-wiggle">
                                        <div className="overflow-wrapper"><span className="credits-label">code by</span></div>
                                        <div className="overflow-wrapper"><a href="#" className="credits-name" data-wiggle-target="true">Dennis</a></div>
                                    </div>
                                </div>
                            </div>
                            <a href="#" className="footer-credits">credits</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
