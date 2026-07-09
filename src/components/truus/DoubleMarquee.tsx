'use client';

import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import ArcGallery from './ArcGallery';

interface HeritageItem {
    name: string;
    image: string;
    link: string;
}

const HERITAGE_ITEMS: HeritageItem[] = [
    { name: "Benteng Heritage", image: "/bentenghirarci.png", link: "/cerita" },
    { name: "Pasar Lama Tangerang", image: "/pasarlama.png", link: "/cerita" },
    { name: "Cisadane River", image: "/sungaicisadane.png", link: "/cerita" },
    { name: "Boen Tek Bio Temple", image: "/budayacinabenteng.png", link: "/cerita" },
    { name: "Laksa Tangerang", image: "/kulinertangerang.png", link: "/cerita" },
    { name: "Peh Cun Festival", image: "/festival.png", link: "/cerita" },
];

const LOOP_ITEMS = [...HERITAGE_ITEMS, ...HERITAGE_ITEMS, ...HERITAGE_ITEMS];

export default function DoubleMarquee() {
    return (
        <section className="double-marquee-section">
            <ArcGallery itemsCount={LOOP_ITEMS.length}>
                {(i) => {
                    const item = LOOP_ITEMS[i];
                    return (
                        <Link
                            to={item.link as '/cerita'}
                            className="marquee-item heritage-card"
                            style={{
                                cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer",
                            }}
                            draggable={false}
                        >
                            <div className="heritage-card__media">
                                <img
                                    src={item.image}
                                    loading="lazy"
                                    alt={item.name}
                                    className="cover-image"
                                    draggable={false}
                                />
                                <div className="heritage-card__overlay" />
                                <span className="heritage-card__name">{item.name}</span>
                            </div>
                        </Link>
                    );
                }}
            </ArcGallery>

            {/* ── Centered heading ── */}
            <motion.div
                className="marquee-heading-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
                <h2>
                    Explore Tangerang's<br />
                    <span className="text-with">
                        Local Wisdom.
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="marquee-underline"
                            viewBox="0 0 132 5"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M1 2.08377C44.3458 3.90451 87.9791 5.71442 131 1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </h2>
            </motion.div>
        </section>
    );
}
