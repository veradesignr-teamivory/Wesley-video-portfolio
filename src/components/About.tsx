import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { WordsPullUpMultiStyle } from './WordsPullUp';
import { about } from '../content';
import { useSite } from '../store';

interface AnimatedLetterProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function AnimatedLetter({ char, index, total, progress }: AnimatedLetterProps) {
  const charProgress = index / total;
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1]);
  return (
    <motion.span aria-hidden="true" style={{ opacity }}>
      {char}
    </motion.span>
  );
}

export function About() {
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: bodyRef, offset: ['start 0.8', 'end 0.2'] });
  const body = about.body.replace('{site}', useSite().data.settings.siteName);
  const chars = body.split('');
  const photoRef = useRef<HTMLDivElement>(null);
  const photoInView = useInView(photoRef, { once: true, margin: '-80px' });

  return (
    <section id="about" className="bg-black px-4 md:px-6 py-10 sm:py-16 md:py-20">
      <div className="bg-[#101010] max-w-6xl mx-auto rounded-2xl md:rounded-[2rem] p-4 sm:p-6 md:p-8 grid sm:grid-cols-[2fr_3fr] lg:grid-cols-[minmax(0,26rem)_1fr] gap-6 sm:gap-8 lg:gap-12 items-stretch">
        {/* portrait on one side, text on the other (stacks only on phones).
            The photo is scaled from the top so the event watermark at its bottom edge stays out of frame. */}
        <motion.div
          ref={photoRef}
          className="relative w-full max-w-sm mx-auto sm:max-w-none aspect-[43/50] sm:aspect-auto sm:h-full sm:min-h-[20rem] rounded-2xl md:rounded-[1.5rem] overflow-hidden bg-black"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={photoInView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={about.portrait} alt={about.portraitAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top scale-[1.12] origin-top" />
          <div className="noise-overlay absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <div className="text-center sm:text-left pb-8 sm:py-6 md:py-10 lg:py-14 sm:pr-4 lg:pr-6 self-center">
        <p className="text-primary text-[10px] sm:text-xs mb-6 sm:mb-8">{about.label}</p>

        <h2 className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl max-w-3xl mx-auto sm:mx-0 leading-[0.95] sm:leading-[0.9] text-[#E1E0CC]">
          <WordsPullUpMultiStyle segments={about.heading} className="sm:justify-start sm:-ml-[0.125em]" />
        </h2>

        <p
          ref={bodyRef}
          aria-label={body}
          className="text-[#DEDBC8] text-xs sm:text-sm md:text-base max-w-2xl mx-auto sm:mx-0 mt-6 md:mt-10 leading-relaxed"
        >
          {chars.map((char, i) => (
            <AnimatedLetter key={i} char={char} index={i} total={chars.length} progress={scrollYProgress} />
          ))}
        </p>
        </div>
      </div>
    </section>
  );
}
