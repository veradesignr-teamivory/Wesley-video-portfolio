import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';
import { WordsPullUpMultiStyle } from './WordsPullUp';
import { GradeCompare } from './GradeCompare';
import { TimelineEditor } from './TimelineEditor';
import { studio } from '../content';

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ index = 0, className = '', children }: { index?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.8, delay: (index % 4) * 0.12, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function SkillBar({ name, value, index }: { name: string; value: number; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <li ref={ref}>
      <div className="flex justify-between text-xs sm:text-sm mb-2">
        <span className="text-[#E1E0CC]">{name}</span>
        <span className="text-gray-500 tabular-nums">{value}%</span>
      </div>
      <div
        className="h-1.5 rounded-full bg-[#212121] overflow-hidden"
        role="progressbar"
        aria-label={name}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : undefined}
          transition={{ duration: 1.2, delay: index * 0.08, ease: EASE }}
        />
      </div>
    </li>
  );
}

export function Studio() {
  const { intro, tools, skills } = studio;

  return (
    <section id="studio" className="relative bg-black px-4 md:px-6 pb-16 sm:pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative space-y-20 sm:space-y-28 md:space-y-36">
        {/* intro banner */}
        <div className="bg-[#101010] max-w-6xl mx-auto text-center rounded-2xl md:rounded-[2rem] px-5 sm:px-10 py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 bg-[#212121] text-primary rounded-full px-4 py-2 text-[10px] sm:text-xs mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {intro.badge}
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[0.95] sm:leading-[0.9] text-[#E1E0CC]">
            <WordsPullUpMultiStyle segments={intro.heading} />
          </h2>
        </div>

        <GradeCompare />
        <TimelineEditor />

        {/* tools */}
        <div id="tools" className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-primary text-[10px] sm:text-xs mb-5">{tools.label}</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl leading-[0.95] text-[#E1E0CC]">
              <WordsPullUpMultiStyle segments={tools.heading} />
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto mt-5">{tools.sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1">
            {tools.groups.map((group, i) => (
              <Reveal key={group.title} index={i} className="bg-[#212121] rounded-2xl p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg sm:text-xl text-[#E1E0CC]">{group.title}.</h3>
                  <span className="text-xs text-gray-500">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}

            {/* proficiency bars fill the last grid cell */}
            <Reveal index={tools.groups.length} className="bg-[#101010] rounded-2xl p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl text-[#E1E0CC]">{skills.label}.</h3>
              <ul className="mt-5 space-y-4">
                {skills.items.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} value={s.value} index={i} />
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
