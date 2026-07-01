import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { AboutMarquee } from "@/components/AboutMarquee";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Tangerang — Tenses Around Us" },
      { name: "description", content: "Lima fragmen budaya Tangerang yang menjadi pelajaran tenses bahasa Inggris." },
      { property: "og:title", content: "About Tangerang — Tenses Around Us" },
      { property: "og:description", content: "Heritage stories from Pasar Lama, Cisadane, and Cina-Benteng — paired with English tenses." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-32 pb-20 motif-watermark/0 relative overflow-hidden">
      <div className="absolute inset-0 motif-watermark opacity-30 -z-10 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 mb-16">
        <Reveal>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">About Tangerang</div>
          <h1 className="heading-display text-5xl sm:text-6xl mt-3 max-w-3xl">
            Budaya yang jadi <span className="italic font-serif font-normal text-primary">guru tenses</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Hover untuk berhenti — klik kartu untuk membaca cerita lengkap dan contoh kalimatnya dalam berbagai tenses.
          </p>
        </Reveal>
      </div>
      <AboutMarquee />
    </div>
  );
}
