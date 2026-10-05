import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Box, Check, Palette, Smartphone } from 'lucide-react';
import { WordsPullUpMultiStyle } from './WordsPullUp';
import { features } from '../content';

function Card({ index, className = '', children }: { index: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      className={`relative rounded-2xl overflow-hidden min-h-[360px] lg:min-h-0 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const ICONS = { palette: Palette, box: Box, phone: Smartphone } as const;

export function Features() {
  return (
    <section id="services" className="relative min-h-screen bg-black px-4 md:px-6 py-16 sm:py-24">
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-16 flex flex-col gap-1">
          <WordsPullUpMultiStyle segments={[features.heading[0]]} />
          <WordsPullUpMultiStyle segments={[features.heading[1]]} />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:h-[480px] gap-3 sm:gap-2 md:gap-1">
          <Card index={0}>
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={features.videoCard.video}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-lg sm:text-xl" style={{ color: '#E1E0CC' }}>
              {features.videoCard.caption}
            </p>
          </Card>

          {features.cards.map((card, i) => (
            <Card key={card.number} index={i + 1} className="bg-[#212121] p-5 sm:p-6 flex flex-col">
              <img src={card.icon} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover" loading="lazy" />

              <div className="flex items-baseline justify-between gap-3 mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl" style={{ color: '#E1E0CC' }}>
                  {card.title}
                </h3>
                <span className="text-xs text-gray-500">{card.number}</span>
              </div>

              <ul className="mt-5 space-y-3">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={features.learnMore.href}
                className="group mt-auto pt-8 inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all"
              >
                {features.learnMore.label}
                <ArrowRight className="w-4 h-4 -rotate-45" />
              </a>
            </Card>
          ))}
        </div>

        {/* second row: visual design, animation, UGC ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 mt-3 sm:mt-2 md:mt-1">
          {features.more.map((card, i) => {
            const Icon = ICONS[card.icon as keyof typeof ICONS];
            return (
              <Card key={card.number} index={i} className={`bg-[#212121] p-5 sm:p-6 flex flex-col !min-h-0 ${card.wide ? 'md:col-span-2' : ''}`}>
                <span className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-black flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="flex items-baseline justify-between gap-3 mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl" style={{ color: '#E1E0CC' }}>{card.title}</h3>
                  <span className="text-xs text-gray-500">{card.number}</span>
                </div>
                <ul className={`mt-5 gap-x-6 gap-y-3 grid ${card.wide ? 'sm:grid-cols-2' : ''}`}>
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={card.wide ? '#design' : '#work'} className="group mt-auto pt-8 inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all">
                  See the work
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </a>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
