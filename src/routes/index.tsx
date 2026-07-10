import { createFileRoute } from "@tanstack/react-router";
import VimeoHero from "@/components/truus/VimeoHero";
import HorizontalWords from "@/components/truus/HorizontalWords";
import MotionCards from "@/components/truus/MotionCards";
import Showreel from "@/components/truus/Showreel";
import ServiceCards from "@/components/truus/ServiceCards";
import DoubleMarquee from "@/components/truus/DoubleMarquee";
import TransitionScribble from "@/components/truus/TransitionScribble";

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
      <header className="main-header">
        <VimeoHero />
      </header>
      <HorizontalWords />
      <DoubleMarquee />
      <main>
        <div className="content-section motion-cards-wrapper">
          <MotionCards />
        </div>
        <Showreel />
        <div className="content-section service-cards-wrapper">
          <ServiceCards />
        </div>
      </main>
      <TransitionScribble />
    </>
  );
}
