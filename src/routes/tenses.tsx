import { createFileRoute, Link } from "@tanstack/react-router";
import { TENSES } from "@/data/tenses";
import ArcGallery from "@/components/truus/ArcGallery";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/tenses")({
  head: () => ({
    meta: [
      { title: "English Tenses Hub — Tenses Around Us" },
      { name: "description", content: "Explore all 16 English tenses dynamically." },
      { property: "og:title", content: "English Tenses Hub — Tenses Around Us" },
      { property: "og:description", content: "Explore all 16 English tenses dynamically." },
    ],
  }),
  component: TensesPage,
});

// Triple the 16 tenses so we have a wide enough loop for infinite scroll conveyor belt
const LOOP_TENSES = [...TENSES, ...TENSES, ...TENSES];

const getTenseDisplayName = (name: string) => {
    if (name === "Simple Present") return "Present";
    if (name === "Simple Past") return "Past";
    if (name === "Simple Future") return "Future";
    return name;
};

const getCategoryLabel = (category: string) => {
    if (category === "present") return "Present";
    if (category === "past") return "Past";
    if (category === "future") return "Future";
    if (category === "past-future") return "Past Future";
    return category;
};

function TensesPage() {
  return (
    /* Outer tall container — creates the scroll space that keeps the section pinned */
    <div className="tenses-pinned-outer">
      {/* Sticky inner — pins to viewport while user scrolls through the outer container's height */}
      <div className="tenses-sticky-inner">
        <section className="double-marquee-section" style={{ width: '100%', paddingTop: '120px' }}>
          <ArcGallery itemsCount={LOOP_TENSES.length}>
            {(i) => {
              const tense = LOOP_TENSES[i];
              const isDarkTheme = tense.category === "future"; // future category uses black text on orange background
              const themeClass = isDarkTheme ? "theme-dark" : "theme-light";
              const displayName = getTenseDisplayName(tense.name);
              const categoryLabel = getCategoryLabel(tense.category);

              return (
                <Link
                  to="/formula/$tense"
                  params={{ tense: tense.slug }}
                  className={`tense-card tense-card-${tense.category}`}
                  style={{
                    cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer",
                  }}
                  draggable={false}
                >
                  <span className={`tense-card-badge ${themeClass}`}>
                    {categoryLabel}
                  </span>
                  
                  <h3 className="tense-card-name">
                    {displayName}
                  </h3>
                  
                  <div className={`tense-card-arrow ${themeClass}`}>
                    <ArrowRight className="h-5 w-5" />
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
              Explore All<br />
              <span className="text-with">
                English Tenses
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
            <p className="marquee-subtitle-center">
              Choose one tense and start your learning journey.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
