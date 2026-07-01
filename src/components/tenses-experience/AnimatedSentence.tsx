import { motion } from 'framer-motion';

interface AnimatedSentenceProps {
  sentence: string;
  isActive: boolean;
  className?: string;
}

/**
 * Reveals an example sentence one word at a time, staggered, whenever
 * the parent card becomes the active (in-focus) card. Cheap on purpose —
 * no layout thrash, just opacity + a short upward drift per word.
 */
export function AnimatedSentence({ sentence, isActive, className }: AnimatedSentenceProps) {
  const words = sentence.split(' ');

  return (
    <p className={className} aria-label={sentence}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: '0.4em', filter: 'blur(4px)' }}
          animate={
            isActive
              ? { opacity: 1, y: '0em', filter: 'blur(0px)' }
              : { opacity: 0, y: '0.4em', filter: 'blur(4px)' }
          }
          transition={{
            duration: 0.5,
            delay: isActive ? 0.25 + i * 0.045 : 0,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </p>
  );
}
