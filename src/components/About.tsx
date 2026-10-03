import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
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

  return (
    <section id="about" className="bg-black px-4 md:px-6 py-10 sm:py-16 md:py-20">
      <div className="bg-[#101010] max-w-6xl mx-auto text-center rounded-2xl md:rounded-[2rem] px-5 sm:px-10 md:px-16 py-16 sm:py-24 md:py-32">
        <p className="text-primary text-[10px] sm:text-xs mb-8 sm:mb-10">{about.label}</p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-[#E1E0CC]">
          <WordsPullUpMultiStyle segments={about.heading} />
        </h2>

        <p
          ref={bodyRef}
          aria-label={body}
          className="text-[#DEDBC8] text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-10 sm:mt-14 leading-relaxed"
        >
          {chars.map((char, i) => (
            <AnimatedLetter key={i} char={char} index={i} total={chars.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}
