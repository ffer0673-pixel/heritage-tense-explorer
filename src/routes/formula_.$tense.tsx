import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useMemo } from "react";
import { TENSES, TENSES_BY_SLUG, Tense, TenseCategory } from "@/data/tenses";
import { QUIZZES } from "@/data/quizzes";
import { ExerciseBlock } from "@/components/ExerciseBlock";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/formula_/$tense")({
  head: ({ params }) => {
    const t = TENSES_BY_SLUG[params.tense];
    const title = t ? `${t.name} — Tenses Around Us` : "Tense — Tenses Around Us";
    const desc = t ? `${t.overview}` : "Pelajari tense bahasa Inggris.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    if (!TENSES_BY_SLUG[params.tense]) throw notFound();
    return {};
  },
  component: TenseDetailPage,
});

// ─── Floema-style scroll reveal hook ─────────────────────────────────────────
// Mirrors Floema's Animation base class: IntersectionObserver animates each
// element in on enter (opacity 0→1, y 40→0) and resets on exit.

function useScrollReveal<T extends HTMLElement>(
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "opacity 0.75s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.75s cubic-bezier(0.25, 0.8, 0.25, 1)";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          } else {
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
          }
        });
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ─── Formula Parser ───────────────────────────────────────────────────────────

interface FormulaGroup {
  pronouns: string;
  formula: string;
}

function parseFormulaToGroups(formulaStr: string): FormulaGroup[] {
  const hasV1S = formulaStr.includes("(s/es)") || formulaStr.includes("V1(s/es)");
  const hasDoDoes = /do\/does/i.test(formulaStr) || /don't\/doesn't/i.test(formulaStr);
  const hasHaveHas = /have\/has/i.test(formulaStr) || /haven't\/hasn't/i.test(formulaStr);
  const hasWasWere = /was\/were/i.test(formulaStr) || /wasn't\/weren't/i.test(formulaStr);
  const hasAmIsAre = /am\/is\/are/i.test(formulaStr) || /aren't\/isn't/i.test(formulaStr);
  const hasWouldShould = /would\/should/i.test(formulaStr);

  if (!hasV1S && !hasDoDoes && !hasHaveHas && !hasWasWere && !hasAmIsAre && !hasWouldShould) {
    return [{ pronouns: "All Subjects", formula: formulaStr }];
  }

  const groups: FormulaGroup[] = [];

  if (hasV1S) {
    groups.push({ pronouns: "I / You / We / They", formula: formulaStr.replace(/V1\s*\(s\/es\)/g, "V1") });
    groups.push({ pronouns: "He / She / It", formula: formulaStr.replace(/V1\s*\(s\/es\)/g, "V1(s/es)") });
  } else if (hasAmIsAre) {
    groups.push({ pronouns: "I", formula: formulaStr.replace(/am\/is\/are/g, "am").replace(/Am\/Is\/Are/g, "Am").replace(/aren't\/isn't/g, "am not").replace(/Aren't\/Isn't/g, "Am not") });
    groups.push({ pronouns: "He / She / It", formula: formulaStr.replace(/am\/is\/are/g, "is").replace(/Am\/Is\/Are/g, "Is").replace(/aren't\/isn't/g, "isn't").replace(/Aren't\/Isn't/g, "Isn't") });
    groups.push({ pronouns: "You / We / They", formula: formulaStr.replace(/am\/is\/are/g, "are").replace(/Am\/Is\/Are/g, "Are").replace(/aren't\/isn't/g, "aren't").replace(/Aren't\/Isn't/g, "Aren't") });
  } else if (hasDoDoes) {
    groups.push({ pronouns: "I / You / We / They", formula: formulaStr.replace(/do\/does/g, "do").replace(/Do\/Does/g, "Do").replace(/don't\/doesn't/g, "don't").replace(/Don't\/Doesn't/g, "Don't") });
    groups.push({ pronouns: "He / She / It", formula: formulaStr.replace(/do\/does/g, "does").replace(/Do\/Does/g, "Does").replace(/don't\/doesn't/g, "doesn't").replace(/Don't\/Doesn't/g, "Doesn't") });
  } else if (hasHaveHas) {
    groups.push({ pronouns: "I / You / We / They", formula: formulaStr.replace(/have\/has/g, "have").replace(/Have\/Has/g, "Have").replace(/haven't\/hasn't/g, "haven't").replace(/Haven't\/Hasn't/g, "Haven't") });
    groups.push({ pronouns: "He / She / It", formula: formulaStr.replace(/have\/has/g, "has").replace(/Have\/Has/g, "Has").replace(/haven't\/hasn't/g, "hasn't").replace(/Haven't\/Hasn't/g, "Hasn't") });
  } else if (hasWasWere) {
    groups.push({ pronouns: "I / He / She / It", formula: formulaStr.replace(/was\/were/g, "was").replace(/Was\/Were/g, "Was").replace(/wasn't\/weren't/g, "wasn't").replace(/Wasn't\/Weren't/g, "Wasn't") });
    groups.push({ pronouns: "You / We / They", formula: formulaStr.replace(/was\/were/g, "were").replace(/Was\/Were/g, "Were").replace(/wasn't\/weren't/g, "weren't").replace(/Wasn't\/Weren't/g, "Weren't") });
  } else if (hasWouldShould) {
    groups.push({ pronouns: "All Subjects", formula: formulaStr });
  }

  return groups;
}

// ─── Category colour palette ──────────────────────────────────────────────────

const CATEGORY_PALETTE: Record<TenseCategory, { bg: string; accent: string; text: string; border: string }> = {
  present: { bg: "#e6fab9", accent: "#29725f", text: "#1e5c3f", border: "rgba(41,114,95,0.15)" },
  past: { bg: "#f0befa", accent: "#a0325a", text: "#6b1a3a", border: "rgba(160,50,90,0.15)" },
  future: { bg: "#82a0ff", accent: "#4b69f0", text: "#ffffff", border: "rgba(75,105,240,0.2)" },
  "past-future": { bg: "#f5693c", accent: "#c94a1a", text: "#ffffff", border: "rgba(245,105,60,0.2)" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

function TenseDetailPage() {
  const { tense } = Route.useParams();
  const t = TENSES_BY_SLUG[tense];
  const questions = useMemo(() => QUIZZES[tense] ?? [], [tense]);

  return (
    <div style={{ background: "#F5F1EB", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 24px 96px" }}>
        <Hero tense={t} />
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", marginTop: "2rem" }}>
          <OverviewSection tense={t} />
          <FormulaSection tense={t} />
          <ExamplesSection tense={t} />
          <TimeExpressionsSection tense={t} />
          <UsageSection tense={t} />
          <ExerciseSection tense={t} questions={questions} />
          <QuizCtaSection tense={t} />
        </div>
      </div>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "0" }} />
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: "block",
      fontSize: "0.6875rem",
      fontFamily: "'Epilogue', sans-serif",
      fontWeight: 900,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#f5693c",
      marginBottom: "1.25rem",
      ...style
    }}>
      {children}
    </span>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

interface TenseProp { tense: Tense }

function Hero({ tense }: TenseProp) {
  return (
    <section style={{ paddingBottom: "64px", textAlign: "center" }}>
      <span style={{
        display: "inline-block",
        fontSize: "0.6875rem",
        fontFamily: "'Epilogue', sans-serif",
        fontWeight: 900,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#f5693c",
        marginBottom: "1rem",
      }}>
        {tense.category.replace("-", " ")}
      </span>

      <h1 style={{
        fontFamily: "'Epilogue', sans-serif",
        fontWeight: 900,
        fontSize: "clamp(2.75rem, 8vw, 5rem)",
        letterSpacing: "-0.03em",
        lineHeight: 1.05,
        color: "#111111",
        margin: "0 0 1rem",
      }}>
        {tense.name}
      </h1>

      <p style={{
        fontFamily: "'Lora', serif",
        fontStyle: "italic",
        fontSize: "clamp(1rem, 2.5vw, 1.375rem)",
        color: "#6b6560",
        margin: "0",
      }}>
        {tense.indonesian}
      </p>
    </section>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewSection({ tense }: TenseProp) {
  return (
    <section className="formula-card formula-card-green" style={{ textAlign: "center" }}>
      <SectionLabel style={{ color: "rgba(255, 255, 255, 0.75)" }}>Overview</SectionLabel>
      <p style={{
        fontFamily: "'Lora', serif",
        fontStyle: "italic",
        fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
        lineHeight: 1.7,
        color: "var(--color-white)",
        maxWidth: 680,
        margin: "0 auto",
      }}>
        "{tense.overview}"
      </p>
    </section>
  );
}



// ─── Formula ──────────────────────────────────────────────────────────────────

const FORMULA_TYPES = [
  { key: "positive", label: "Positive" },
  { key: "negative", label: "Negative" },
  { key: "interrogative", label: "Interrogative" },
  { key: "negativeInterrogative", label: "Negative Interrogative" },
] as const;

function FormulaSection({ tense }: TenseProp) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="formula-card formula-card-darkblue">
      <SectionLabel style={{ color: "rgba(255, 255, 255, 0.75)" }}>Sentence Formula</SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {FORMULA_TYPES.map(({ key, label }) => {
          const formulaStr = tense.formula[key];
          const groups = parseFormulaToGroups(formulaStr);

          let cardColorClass = "";
          let labelColor = "rgba(0, 0, 0, 0.4)";
          let formulaColor = "#111111";
          let groupBg = "rgba(255, 255, 255, 0.85)";

          if (key === "positive") {
            cardColorClass = "formula-card-lightblue";
          } else if (key === "negative") {
            cardColorClass = "formula-card-orange";
          } else if (key === "interrogative") {
            cardColorClass = "formula-card-maroon";
            labelColor = "rgba(255, 255, 255, 0.7)";
            formulaColor = "#ffffff";
            groupBg = "rgba(255, 255, 255, 0.08)";
          } else {
            cardColorClass = "formula-card-pink";
          }

          return (
            <div key={key} className={`formula-card ${cardColorClass}`} style={{ padding: "1.5rem", marginBottom: 0 }}>
              <p style={{
                fontFamily: "'Epilogue', sans-serif",
                fontWeight: 800,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: labelColor,
                marginBottom: "0.75rem",
              }}>
                {label}
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: groups.length === 1 ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "0.75rem",
              }}>
                {groups.map((group, i) => (
                  <div key={i} style={{
                    background: groupBg,
                    borderRadius: "16px",
                    padding: "1.25rem 1.5rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    <span style={{
                      display: "block",
                      fontFamily: "'Epilogue', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.6875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: labelColor,
                      marginBottom: "0.5rem",
                    }}>
                      {group.pronouns}
                    </span>
                    <span style={{
                      fontFamily: "'Epilogue', monospace",
                      fontWeight: 900,
                      fontSize: "clamp(0.9rem, 2vw, 1.125rem)",
                      color: formulaColor,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.35,
                      wordBreak: "break-word",
                    }}>
                      {group.formula}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Examples ─────────────────────────────────────────────────────────────────

const EXAMPLE_CATS = [
  { title: "Positive", key: "positive" },
  { title: "Negative", key: "negative" },
  { title: "Interrogative", key: "interrogative" },
  { title: "Negative Interrogative", key: "negativeInterrogative" },
] as const;

function ExamplesSection({ tense }: TenseProp) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="formula-card formula-card-pink">
      <SectionLabel style={{ color: "rgba(0, 0, 0, 0.6)" }}>Sentence Examples</SectionLabel>

      {/* Contextual examples */}
      {tense.examples && tense.examples.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 800,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(0, 0, 0, 0.45)",
            marginBottom: "0.75rem",
          }}>
            Contextual
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {tense.examples.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: "14px",
                padding: "1rem 1.375rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.04)",
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
                fontSize: "1.0625rem",
                color: "var(--color-dark)",
                lineHeight: 1.6,
              }}>
                "{s}"
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sentence form grids */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
      }}>
        {EXAMPLE_CATS.map(({ title, key }) => (
          <div key={key}>
            <p style={{
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 800,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(0, 0, 0, 0.45)",
              marginBottom: "0.625rem",
            }}>
              {title}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(tense[key] as string[]).slice(0, 3).map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "12px",
                  padding: "0.875rem 1.125rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  border: "1px solid rgba(0,0,0,0.04)",
                  fontFamily: "'Lora', serif",
                  fontStyle: "italic",
                  fontSize: "0.9375rem",
                  color: "var(--color-dark)",
                  lineHeight: 1.55,
                }}>
                  "{s}"
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Time Expressions ─────────────────────────────────────────────────────────

const PILL_COLORS = [
  { bg: "#f0befa", color: "#6b1a3a" },
  { bg: "#e6fab9", color: "#1e5c3f" },
  { bg: "#82a0ff", color: "#ffffff" },
  { bg: "#f5693c", color: "#ffffff" },
  { bg: "#a0325a", color: "#ffffff" },
  { bg: "#4b69f0", color: "#ffffff" },
];

function TimeExpressionsSection({ tense }: TenseProp) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="formula-card formula-card-green" style={{ textAlign: "center" }}>
      <SectionLabel style={{ color: "rgba(255, 255, 255, 0.75)" }}>Common Time Expressions</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", justifyContent: "center" }}>
        {tense.timeExpressions.map((e) => {
          return (
            <span key={e} style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              padding: "0.5rem 1.125rem",
              borderRadius: "999px",
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 800,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              {e}
            </span>
          );
        })}
      </div>
    </section>
  );
}

// ─── Usage ────────────────────────────────────────────────────────────────────

function UsageSection({ tense }: TenseProp) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="formula-card formula-card-darkblue">
      <SectionLabel style={{ color: "rgba(255, 255, 255, 0.75)" }}>When to Use</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 680 }}>
        {tense.usage.map((u, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "1.125rem 1.375rem",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}>
            <span style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 900,
              fontSize: "0.8125rem",
            }}>
              {i + 1}
            </span>
            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: "1rem",
              lineHeight: 1.65,
              color: "#ffffff",
              margin: 0,
              paddingTop: "0.125rem",
            }}>
              {u}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Exercise ─────────────────────────────────────────────────────────────────

interface ExerciseSectionProps extends TenseProp { questions: any[] }

function ExerciseSection({ questions }: ExerciseSectionProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} style={{ padding: "64px 0" }}>
      <SectionLabel>Practice Exercise</SectionLabel>
      <h2 style={{
        fontFamily: "'Epilogue', sans-serif",
        fontWeight: 900,
        fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
        letterSpacing: "-0.03em",
        color: "#111111",
        marginBottom: "0.5rem",
      }}>
        Test Your Knowledge
      </h2>
      <p style={{
        fontFamily: "'Epilogue', sans-serif",
        fontSize: "0.9375rem",
        color: "#9c9290",
        fontWeight: 600,
        marginBottom: "2rem",
      }}>
        Cek pemahaman cepat. Lima soal acak setiap kali.
      </p>

      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        <ExerciseBlock questions={questions} />
      </div>
    </section>
  );
}

// ─── Quiz CTA ─────────────────────────────────────────────────────────────────

function QuizCtaSection({ tense }: TenseProp) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} style={{ padding: "64px 0 0" }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "clamp(2.5rem, 6vw, 4rem)",
        textAlign: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}>
        <span style={{
          display: "block",
          fontFamily: "'Epilogue', sans-serif",
          fontWeight: 900,
          fontSize: "0.6875rem",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "#d00973ff",
          marginBottom: "1rem",
        }}>
          Ready to test?
        </span>

        <h2 style={{
          fontFamily: "'Epilogue', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(2rem, 5vw, 3.25rem)",
          letterSpacing: "-0.03em",
          color: "#111111",
          lineHeight: 1.1,
          marginBottom: "1rem",
        }}>
          Take the Tense Quiz!
        </h2>

        <p style={{
          fontFamily: "'Epilogue', sans-serif",
          fontSize: "1rem",
          color: "#6b6560",
          fontWeight: 500,
          maxWidth: 440,
          margin: "0 auto 2rem",
          lineHeight: 1.65,
        }}>
          Siap diuji? Kerjakan 20 soal khusus tense ini untuk mengunci pencapaian dan menguji pemahamanmu.
        </p>

        <Link
          to="/quiz/$quizId"
          params={{ quizId: `tense-${tense.slug}` }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
            background: "#111111",
            color: "#ffffff",
            padding: "0.875rem 2rem",
            borderRadius: "999px",
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 900,
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textDecoration: "none",
            cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer",
          }}
        >
          Mulai Quiz <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
