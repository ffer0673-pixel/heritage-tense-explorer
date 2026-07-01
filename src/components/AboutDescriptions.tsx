import { useState } from "react";
import { X } from "lucide-react";
import { CULTURAL_CARDS } from "@/data/cultural";
import { TypewriterText } from "./TypewriterText";

export function AboutDescriptions() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

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
            <h3 className="mt-50 text-xl sm:text-2xl font-medium tracking-tight text-white">
              {c.title}
            </h3>

            <TypewriterText
              text={c.extended}
              speed={14}
              className="mt-6 text-base sm:text-lg leading-relaxed text-neutral-300 min-h-[4.5em]"
            />
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

      {/* Lightbox */}
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
    </div>
  );
}