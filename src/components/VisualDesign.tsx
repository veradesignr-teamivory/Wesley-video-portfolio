import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Link2, X } from 'lucide-react';
import { WordsPullUpMultiStyle } from './WordsPullUp';
import { visualDesign } from '../content';
import { DESIGN_CATEGORIES, safeUrl, useSite, type Design } from '../store';

function Discipline({ index, name, text, count, active, onPick }: { index: number; name: string; text: string; count: number; active: boolean; onPick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg sm:text-xl">{name}.</h3>
        <span className={`text-xs ${active ? 'text-black/60' : 'text-gray-500'}`}>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <p className={`text-sm mt-3 ${active ? 'text-black/70' : 'text-gray-400'}`}>{text}</p>
      {count > 0 && <p className={`text-xs mt-4 ${active ? 'text-black' : 'text-primary'}`}>{count} {count === 1 ? 'piece' : 'pieces'} below</p>}
    </>
  );
  const base = `block w-full h-full text-left rounded-2xl p-5 sm:p-6 transition-colors ${active ? 'bg-primary text-black' : 'bg-[#212121] text-[#E1E0CC]'}`;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* a discipline becomes a filter button once it has work in the gallery */}
      {count > 0 ? <button onClick={onPick} aria-pressed={active} className={`${base} hover:bg-[#2a2a2a] aria-pressed:hover:bg-primary`}>{body}</button> : <div className={base}>{body}</div>}
    </motion.div>
  );
}

/** Button text for a piece's link, based on where it points. */
function linkLabel(url: string) {
  if (/figma\.com/i.test(url)) return 'Open in Figma';
  if (/behance\.net/i.test(url)) return 'View on Behance';
  if (/dribbble\.com/i.test(url)) return 'View on Dribbble';
  return 'Visit website';
}

function Lightbox({ item, onClose }: { item: Design; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus(); };
  }, [onClose]);

  return (
    <motion.div role="dialog" aria-modal="true" aria-label={item.title} className="fixed inset-0 z-50 bg-black/90 overflow-y-auto p-4 md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose}>
      <div className="max-w-5xl mx-auto bg-[#101010] rounded-2xl md:rounded-[2rem] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <img src={safeUrl(item.image, true)} alt={item.title} className="w-full max-h-[75vh] object-contain bg-black" />
        <div className="p-5 sm:p-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-primary text-[10px] sm:text-xs">{[item.category, item.client].filter(Boolean).join(' · ')}</p>
            <h3 className="text-2xl sm:text-4xl text-[#E1E0CC] mt-2 leading-[0.95]">{item.title}</h3>
            {item.description && <p className="text-sm sm:text-base text-gray-400 mt-4 max-w-2xl">{item.description}</p>}
            {safeUrl(item.link) && (
              <a href={safeUrl(item.link)} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 hover:gap-3 transition-all bg-primary rounded-full pl-5 pr-1 py-1 text-black font-medium text-sm mt-6">
                {linkLabel(item.link)}
                <span className="bg-black rounded-full w-9 h-9 flex items-center justify-center"><ArrowRight className="w-4 h-4 text-primary -rotate-45" /></span>
              </a>
            )}
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close" className="shrink-0 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function VisualDesign() {
  const { data } = useSite();
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState<Design | null>(null);
  const items = data.designs.filter((d) => safeUrl(d.image, true));
  const count = (c: string) => items.filter((d) => d.category === c).length;
  const active = filter !== 'All' && count(filter) > 0 ? filter : 'All';
  const shown = items.filter((d) => active === 'All' || d.category === active);
  const profiles = [{ label: 'Behance', url: safeUrl(data.settings.behance) }, { label: 'Dribbble', url: safeUrl(data.settings.dribbble) }].filter((p) => p.url);

  return (
    <section id="design" className="relative bg-black px-4 md:px-6 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-primary text-[10px] sm:text-xs mb-5">{visualDesign.label}</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl leading-[0.95] text-[#E1E0CC]">
            <WordsPullUpMultiStyle segments={visualDesign.heading} />
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto mt-5">{visualDesign.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1">
          {DESIGN_CATEGORIES.map((name, i) => (
            <Discipline key={name} index={i} name={name} text={visualDesign.blurbs[name] ?? ''} count={count(name)}
              active={active === name} onPick={() => setFilter(active === name ? 'All' : name)} />
          ))}
          <a href="#clients" className="group bg-[#101010] rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-6 text-[#E1E0CC]">
            <p className="text-lg sm:text-xl">{visualDesign.cta}</p>
            <span className="inline-flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">Start a project <ArrowRight className="w-4 h-4 -rotate-45" /></span>
          </a>
        </div>

        {items.length > 0 && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mt-10 sm:mt-14 mb-6 sm:mb-8" role="group" aria-label="Filter visual design work">
              {['All', ...DESIGN_CATEGORIES.filter((c) => count(c) > 0)].map((c) => (
                <button key={c} onClick={() => setFilter(c)} aria-pressed={c === active}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-colors ${c === active ? 'bg-primary text-black' : 'bg-[#212121] text-primary/70 hover:text-primary'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-2 md:gap-1">
              {shown.map((d) => (
                <button key={d.id} onClick={() => setOpen(d)} className="group relative block w-full mb-3 sm:mb-2 md:mb-1 rounded-2xl overflow-hidden bg-[#101010] break-inside-avoid text-left">
                  <img src={safeUrl(d.image, true)} alt={d.title} loading="lazy" className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]" />
                  {safeUrl(d.link) && (
                    <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-primary flex items-center justify-center" title="Has a link">
                      <Link2 className="w-4 h-4" />
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    <span className="block text-[10px] sm:text-xs text-primary">{d.category}</span>
                    <span className="block text-base sm:text-lg text-[#E1E0CC]">{d.title}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* profile links: set them in the admin dashboard under Site & links */}
        {profiles.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 sm:mt-14">
            {profiles.map((p) => (
              <a key={p.label} href={p.url} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 hover:gap-3 transition-all bg-[#212121] rounded-full pl-5 pr-1 py-1 text-primary font-medium text-sm sm:text-base">
                More on {p.label}
                <span className="bg-primary rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowRight className="w-4 h-4 text-black -rotate-45" />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {open && <Lightbox item={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
