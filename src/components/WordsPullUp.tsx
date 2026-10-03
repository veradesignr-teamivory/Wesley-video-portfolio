import { useRef, type CSSProperties } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

interface WordsPullUpProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Adds a superscript * on the last character of the final word. */
  showAsterisk?: boolean;
}

export function WordsPullUp({ text, className = '', style, showAsterisk = false }: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style} aria-label={text}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            className="inline-block"
            style={{ marginRight: isLast ? 0 : '0.25em' }}
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
          >
            {isLast && showAsterisk ? (
              <>
                {word.slice(0, -1)}
                <span className="relative inline-block">
                  {word.slice(-1)}
                  <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
                </span>
              </>
            ) : (
              word
            )}
          </motion.span>
        );
      })}
    </div>
  );
}

export interface StyledSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: StyledSegment[];
  className?: string;
}

export function WordsPullUpMultiStyle({ segments, className = '' }: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({ word, className: segment.className ?? '' })),
  );

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap justify-center ${className}`}
      aria-label={segments.map((s) => s.text).join(' ')}
    >
      {words.map(({ word, className: wordClass }, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={`inline-block mx-[0.125em] ${wordClass}`}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
