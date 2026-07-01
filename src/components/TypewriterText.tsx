import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  as?: "p" | "h3";
}

export function TypewriterText({ text, className, speed = 18, as = "p" }: TypewriterTextProps) {
  const ref = useRef<HTMLParagraphElement | HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [inView, text, speed]);

  const Tag = as;
  const done = displayed.length >= text.length;

  return (
    <Tag ref={ref as any} className={className}>
      {displayed}
      {inView && !done && (
        <span className="inline-block w-[2px] h-[1em] bg-current ml-0.5 -mb-0.5 animate-pulse" />
      )}
    </Tag>
  );
}