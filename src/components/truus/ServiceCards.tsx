'use client';

import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CARDS_DATA } from '@/lib/truus-data';

export default function ServiceCards() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Animate underline SVG paths on scroll (from HeroSection)
            gsap.to('.title-underline-svg path', {
                strokeDashoffset: 0,
                duration: 1.2,
                ease: 'power3.out',
                stagger: 0.3,
                scrollTrigger: {
                    trigger: '.service-cards-wrapper',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            });

            initCardAnimations();
        });

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div className="service-cards-section" style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* ─── "Call us if you need:" Heading ─── */}
            <div className="title-container">
                <h2 className="main-title">Choose Your <span className="italic-text">Learning Path</span></h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="160" viewBox="0 0 159 17" fill="none" className="title-underline-svg">
                    <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
            </div>

            {/* ─── Service Cards ─── */}
            <div className="cards-wrapper" id="cards-wrapper">
                {CARDS_DATA.map((card) => (
                    <div key={card.color} className={`card card-${card.color}`}>
                        <div className={`card-sticker sticker-${card.sticker}`}>
                            <img
                                src={`/assets/Card-Sticker SVG/sticker-${card.sticker}.svg`}
                                alt=""
                                width="100%"
                                loading="lazy"
                                aria-hidden="true"
                             />
                        </div>
                        <h3 className="card-title">{card.title}</h3>
                        <svg width="100%" height="10" className="card-divider-svg" aria-hidden="true">
                            <use href="#card-divider" />
                        </svg>
                        <p className="card-desc">{card.description}</p>
                        <Link 
                            to="/tenses"
                            className="card-btn"
                            style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
                        >
                            {card.buttonText}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

function initCardAnimations() {
    const cards = gsap.utils.toArray('.card') as HTMLElement[];
    if (!cards.length) return;

    const originalData = [
        { rotation: 4 },
        { rotation: -5 },
        { rotation: 5 },
        { rotation: -8 }
    ];

    const isDesktop = window.innerWidth >= 1024;
    let leaveTimeout: NodeJS.Timeout | null = null;

    if (isDesktop) {
        cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                if (leaveTimeout) { clearTimeout(leaveTimeout); leaveTimeout = null; }
                const hoverGap = 120;
                const clusterGap = 150;
                const cardWidth = 320;
                const hoveredLeft = cards[index].offsetLeft;
                const leftCards: { card: HTMLElement; index: number }[] = [];
                const rightCards: { card: HTMLElement; index: number }[] = [];

                cards.forEach((otherCard, otherIndex) => {
                    if (otherIndex < index) leftCards.push({ card: otherCard, index: otherIndex });
                    else if (otherIndex > index) rightCards.push({ card: otherCard, index: otherIndex });
                });

                const currentTop = cards[index].offsetTop;
                const targetCommonTop = 50;
                const moveY = targetCommonTop - currentTop;

                gsap.to(cards[index], { x: 0, y: moveY, rotation: 0, scale: 1.08, duration: 0.9, ease: 'elastic.out(1, 0.5)', overwrite: true });

                if (rightCards.length) {
                    const clusterStart = hoveredLeft + cardWidth + hoverGap;
                    rightCards.forEach((item, i) => {
                        const targetAbsLeft = clusterStart + (i * clusterGap);
                        const targetX = Math.max(targetAbsLeft - item.card.offsetLeft, 10);
                        const angleRad = originalData[item.index].rotation * (Math.PI / 180);
                        const targetY = targetX * Math.tan(angleRad);
                        gsap.to(item.card, { x: targetX, y: targetY, rotation: originalData[item.index].rotation, scale: 1, duration: 1.0, ease: 'elastic.out(1, 0.5)', overwrite: true });
                    });
                }

                if (leftCards.length) {
                    leftCards.reverse();
                    const clusterStart = hoveredLeft - hoverGap - cardWidth;
                    leftCards.forEach((item, i) => {
                        const targetAbsLeft = clusterStart - (i * clusterGap);
                        const targetX = Math.min(targetAbsLeft - item.card.offsetLeft, -10);
                        const angleRad = originalData[item.index].rotation * (Math.PI / 180);
                        const targetY = targetX * Math.tan(angleRad);
                        gsap.to(item.card, { x: targetX, y: targetY, rotation: originalData[item.index].rotation, scale: 1, duration: 1.0, ease: 'elastic.out(1, 0.5)', overwrite: true });
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                leaveTimeout = setTimeout(() => {
                    cards.forEach((c, i) => {
                        gsap.to(c, { x: 0, y: 0, scale: 1, rotation: originalData[i].rotation, duration: 1.0, ease: 'elastic.out(1, 0.5)', overwrite: true, zIndex: i + 1 });
                    });
                }, 80);
            });
        });
    } else {
        // Mobile & Tablet: Let CSS control the grid/column layout. No absolute positioning or pinning.
        cards.forEach((card, i) => {
            gsap.set(card, {
                position: 'relative',
                left: 'auto',
                top: 'auto',
                xPercent: 0,
                y: 0,
                rotation: 0,
                zIndex: i + 1,
                transform: 'none'
            });
        });
    }
}
