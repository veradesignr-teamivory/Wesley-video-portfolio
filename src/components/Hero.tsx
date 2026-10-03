import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WordsPullUp } from './WordsPullUp';
import { hero } from '../content';
import { useSite } from '../store';

const EASE = [0.16, 1, 0.3, 1] as const;
const LINK = 'rgba(225, 224, 204, 0.8)';
const LINK_HOVER = '#E1E0CC';

export function Hero() {
  const { settings } = useSite().data;
  return (
    <section id="showreel" className="h-screen p-4 md:p-6">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={hero.video}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <nav
          aria-label="Primary"
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8"
        >
          <ul className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14 text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
            {hero.nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="transition-colors"
                  style={{ color: LINK }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = LINK_HOVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = LINK)}
                  {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-12 gap-4 items-end">
            <h1 className="col-span-12 lg:col-span-8">
              <WordsPullUp
                key={settings.heroTitle}
                text={settings.heroTitle}
                showAsterisk
                className="text-[16vw] sm:text-[10vw] md:text-[11vw] lg:text-[12vw] font-medium leading-[0.85] tracking-[-0.07em]"
                style={{ color: '#E1E0CC' }}
              />
            </h1>

            <div className="col-span-12 lg:col-span-4 flex flex-col items-start gap-4 sm:gap-5 pb-1 lg:pb-4">
              <motion.p
                className="text-primary/70 text-xs sm:text-sm md:text-base max-w-md"
                style={{ lineHeight: 1.2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              >
                {hero.description.replace('{site}', settings.siteName)}
              </motion.p>

              <motion.a
                href={`mailto:${settings.email}?subject=${encodeURIComponent('Project inquiry')}`}
                className="group inline-flex items-center gap-2 hover:gap-3 transition-all bg-primary rounded-full pl-5 pr-1 py-1 text-black font-medium text-sm sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              >
                {hero.cta.label}
                <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
