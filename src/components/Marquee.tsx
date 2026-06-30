import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  direction?: "left" | "right";
  duration?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  direction = "left",
  duration = 60,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const trackClass = direction === "left" ? "marquee-track-left" : "marquee-track-right";
  return (
    <div className={"overflow-hidden " + (className ?? "")}>
      <motion.div
        className={`flex w-max ${trackClass} ${pauseOnHover ? "marquee-pause-on-hover" : ""}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-stretch gap-6 pr-6">{children}</div>
        <div className="flex shrink-0 items-stretch gap-6 pr-6" aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}
