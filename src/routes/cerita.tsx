import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { STORIES } from "@/data/stories";
import { useProgress } from "@/lib/progress-store";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cerita")({
  head: () => ({
    meta: [
      { title: "Cerita — Tenses Around Us" },
      { name: "description", content: "Cerita pendek dari Tangerang. Baca dulu, tebak tense-nya kemudian." },
      { property: "og:title", content: "Cerita — Tenses Around Us" },
      { property: "og:description", content: "Stories from Tangerang, with mini tense-analysis at the end." },
    ],
  }),
  component: CeritaPage,
});

const COLOR_SCHEMES = ["pink", "green", "lightblue", "orange", "maroon", "darkblue"] as const;
const STICKERS = ["heart", "smiley", "camera", "hand", "phone"] as const;

function CeritaPage() {
  const stories = STORIES;
  const featured = stories[0];
  const rest = stories.slice(1);
  const storyProgress = useProgress((s) => s.stories);

  return (
    <div className="quiz-hub-container">
      <Reveal>
        <div className="quiz-title-container">
          <h1 className="quiz-main-title">
            Sebuah kota. <span className="italic-text">cerita.</span>
          </h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="280" viewBox="0 0 159 17" fill="none" className="quiz-title-underline-svg">
            <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </Reveal>

      {/* Featured Card */}
      <Reveal>
        <Link
          to="/cerita/$slug"
          params={{ slug: featured.slug }}
          className="quiz-final-card"
          style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}
        >
          <img
            src="/assets/Card-Sticker SVG/sticker-heart.svg"
            className="quiz-final-sticker"
            alt=""
            loading="lazy"
          />
          <div className="quiz-final-badge">Featured Story</div>
          <h2 className="quiz-final-title">{featured.title}</h2>
          <p className="quiz-final-desc">{featured.summary}</p>
          <div className="mt-4 text-sm font-semibold opacity-75">Tense focus: <span className="underline">{featured.tenseFocus}</span></div>
          <div className="quiz-final-action mt-6">
            baca cerita <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </Reveal>

      {/* Rest Grid */}
      <div className="quiz-cards-grid">
        {rest.map((s, i) => {
          const done = storyProgress[s.slug]?.read && storyProgress[s.slug]?.quizPassed;
          const colorClass = `quiz-card-${COLOR_SCHEMES[i % COLOR_SCHEMES.length]}`;
          const stickerName = STICKERS[i % STICKERS.length];
          const rotation = (i % 4 === 0) ? 1.5 : (i % 4 === 1) ? -2 : (i % 4 === 2) ? 2 : -1.5;

          return (
            <Reveal key={s.slug} delay={i * 0.08}>
              <Link
                to="/cerita/$slug"
                params={{ slug: s.slug }}
                className={cn("quiz-card", colorClass)}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer"
                }}
              >
                <img
                  src={`/assets/Card-Sticker SVG/sticker-${stickerName}.svg`}
                  className={cn("quiz-card-sticker", `quiz-card-sticker-${stickerName}`)}
                  alt=""
                  loading="lazy"
                />
                <div className="quiz-card-header">
                  <h3 className="quiz-card-title">{s.title}</h3>
                  <div className="quiz-card-subtitle line-clamp-2">{s.summary}</div>
                </div>
                <div className="quiz-card-footer">
                  <span className="quiz-card-status">tense: {s.tenseFocus}</span>
                  {done && (
                    <span className="quiz-card-score bg-success/20 text-success" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
