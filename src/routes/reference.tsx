import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, BookOpen, Landmark, Image, Wrench } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { REFERENCES } from "@/data/references";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Reference — Tenses Around Us" },
      { name: "description", content: "Sumber grammar, budaya, dan teknologi yang digunakan Tenses Around Us." },
      { property: "og:title", content: "Reference — Tenses Around Us" },
      { property: "og:description", content: "Semua referensi grammar, budaya, dan teknologi." },
    ],
  }),
  component: ReferencePage,
});

/* ── Category icon & colour mapping ──────────────────────────────────────── */
const CATEGORY_META: Record<string, { icon: React.ReactNode; iconClass: string }> = {
  "Grammar Sources": {
    icon: <BookOpen size={20} strokeWidth={2.2} />,
    iconClass: "ref-card-icon-grammar",
  },
  "Cultural Sources": {
    icon: <Landmark size={20} strokeWidth={2.2} />,
    iconClass: "ref-card-icon-culture",
  },
  "Image Credits": {
    icon: <Image size={20} strokeWidth={2.2} />,
    iconClass: "ref-card-icon-image",
  },
  "Tools & Technologies": {
    icon: <Wrench size={20} strokeWidth={2.2} />,
    iconClass: "ref-card-icon-tools",
  },
};

function ReferencePage() {
  return (
    <div className="ref-page">
      <div className="ref-container">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <Reveal>
          <header className="ref-header">

            <h1 className="ref-header-title">
              sumber &amp; <span>referensi.</span>
            </h1>

          </header>
        </Reveal>

        {/* ── Category Cards ───────────────────────────────────────────── */}
        <div className="ref-grid">
          {REFERENCES.map((group) => {
            const meta = CATEGORY_META[group.category] ?? {
              icon: <BookOpen size={20} strokeWidth={2.2} />,
              iconClass: "ref-card-icon-grammar",
            };

            return (
              <Reveal key={group.category}>
                <article className="ref-card">
                  {/* Card header */}
                  <div className="ref-card-header">
                    <div className={`ref-card-icon ${meta.iconClass}`}>
                      {meta.icon}
                    </div>
                    <span className="ref-card-title">{group.category}</span>
                    <span className="ref-card-count">
                      {group.items.length} {group.items.length === 1 ? "source" : "sources"}
                    </span>
                  </div>

                  {/* Items */}
                  <ul className="ref-items-list">
                    {group.items.map((item) => (
                      <li key={item.title} className="ref-item">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ref-item-link"
                          >
                            {item.title}
                            <ExternalLink className="ref-ext-icon" size={14} strokeWidth={2} />
                          </a>
                        ) : (
                          <span className="ref-item-plain">{item.title}</span>
                        )}
                        {item.note && (
                          <p className="ref-item-note">{item.note}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <Reveal>
          <footer className="ref-footer">
            <p className="ref-footer-text">
              All content is used for <strong>educational purposes</strong>.
              Links open in a new tab. Last reviewed July 2025.
            </p>
          </footer>
        </Reveal>

      </div>
    </div>
  );
}

