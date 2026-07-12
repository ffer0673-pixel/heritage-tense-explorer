import { createFileRoute } from "@tanstack/react-router";
import VimeoHero from "@/components/truus/VimeoHero";
import ServiceCards from "@/components/truus/ServiceCards";
import TransitionScribble from "@/components/truus/TransitionScribble";
import MotionCards from "@/components/truus/MotionCards";
import PersistentPortraits from "@/components/truus/PersistentPortraits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heritage Tense Explorer — Learn English Through Tangerang Local Wisdom" },
      { name: "description", content: "Learn English through the rich cultural heritage and local wisdom of Tangerang. Explore tenses dynamically." },
      { property: "og:title", content: "Heritage Tense Explorer" },
      { property: "og:description", content: "Learn English through the rich cultural heritage and local wisdom of Tangerang. Explore tenses dynamically." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section id="hero" className="main-header">
        <VimeoHero />
        <PersistentPortraits />
      </section>

      <section id="image-reveal">
        <MotionCards />
      </section>

      <main>
        <div className="content-section service-cards-wrapper">
          <ServiceCards />
        </div>
      </main>
      <TransitionScribble />
    </>
  );
}
