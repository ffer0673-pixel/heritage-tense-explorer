import { Marquee } from "./Marquee";

const PHRASE = "Learning English Through Tangerang Local Wisdom";

export function AboutMarquee() {
  return (
    <div className="py-8 overflow-hidden">
      <Marquee direction="right" duration={35}>
        <div className="flex items-center gap-16 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-foreground"
            >
              {PHRASE}
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}