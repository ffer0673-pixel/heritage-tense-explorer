import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CULTURAL_CARDS } from "@/data/cultural";
import { TypewriterText } from "./TypewriterText";

export function AboutDescriptions() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openCard = CULTURAL_CARDS.find((c) => c.slug === openSlug) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-6 space-y-24">
      {CULTURAL_CARDS.map((c, i) => (
        <div
          key={c.slug}
          className={`flex flex-col items-start gap-8 lg:gap-12 ${
            i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          {/* Text — plain, no box */}
          <div className="w-full lg:w-1/2">
           <h3 className="mt-45 text-xl sm:text-2xl font-medium tracking-tight text-neutral-900">
  {c.title}
</h3>

<TypewriterText
  text={c.extended}
  speed={14}
  className="mt-6 text-base sm:text-lg leading-relaxed text-neutral-600 min-h-[4.5em]"
/>

<button
  type="button"
  onClick={() => setOpenSlug(c.slug)}
  className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-200 transition-colors"
>
  Preview
</button>
          </div>

          {/* Large photo */}
          <div className="w-full lg:w-1/2">
            {c.image ? (
              <button
                type="button"
                onClick={() => setSelectedImage({ src: c.image!, alt: c.title })}
                className="group relative block w-full cursor-pointer overflow-hidden rounded-3xl shadow-xl"
                aria-label={`Lihat foto ${c.title} lebih besar`}
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-[280px] sm:h-[360px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              </button>
            ) : (
              <div className="w-full h-[280px] sm:h-[360px] grid place-items-center text-7xl bg-neutral-800 rounded-3xl">
                {c.emoji}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Lightbox untuk foto besar */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white"
            aria-label="Tutup"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Popup Preview per item */}
      {openCard && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpenSlug(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto max-w-2xl px-6 py-16"
          >
            <button
              onClick={() => setOpenSlug(null)}
              className="fixed right-6 top-6 z-[110] grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="glass-strong rounded-3xl p-8 shadow-elegant">
              {openCard.image ? (
                <img
                  src={openCard.image}
                  alt={openCard.title}
                  className="w-full h-[240px] object-cover rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 grid place-items-center text-5xl bg-muted rounded-xl">
                  {openCard.emoji}
                </div>
              )}

              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{openCard.title}</h3>
              <p className="mt-3 text-muted-foreground">{openCard.extended}</p>

              <div className="mt-6 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Example sentences
                </div>
                <div className="rounded-xl bg-primary-soft p-4">
                  <p className="font-serif italic">"{openCard.exampleEn}"</p>
                  <div className="mt-1 text-xs text-primary font-medium">{openCard.tense}</div>
                </div>
                {openCard.extraExamples.map((ex, i) => (
                  <div key={i} className="rounded-xl bg-muted p-4">
                    <p className="font-serif italic">"{ex.en}"</p>
                    <div className="mt-1 text-xs text-muted-foreground font-medium">{ex.tense}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/tenses/$tense"
                params={{ tense: openCard.tenseSlug }}
                onClick={() => setOpenSlug(null)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Pelajari Tense Ini <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}