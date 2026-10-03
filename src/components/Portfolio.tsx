import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Play, X } from 'lucide-react';
import { WordsPullUpMultiStyle } from './WordsPullUp';
import { safeUrl, toEmbed, useSite, type Project } from '../store';

function Card({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const image = safeUrl(project.image, true);

  return (
    <motion.button
      ref={ref}
      onClick={onOpen}
      className="group text-left bg-[#212121] rounded-2xl overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-video overflow-hidden bg-[#101010]">
        {image ? (
          <img src={image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          // placeholder frame until a thumbnail is added in the admin dashboard
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] via-[#151515] to-black">
            <div className="noise-overlay absolute inset-0 opacity-40 mix-blend-overlay" />
            <span className="relative font-serif italic text-3xl sm:text-4xl text-primary/80 px-4 text-center">{project.title}</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-black/70 text-primary rounded-full px-3 py-1 text-[10px] sm:text-xs">{project.category}</span>
        <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all">
          {toEmbed(project.videoUrl) ? <Play className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 -rotate-45" />}
        </span>
      </div>
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg sm:text-xl text-[#E1E0CC]">{project.title}.</h3>
          <span className="text-xs text-gray-500">{project.year}</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{[project.client, project.role].filter(Boolean).join(' · ')}</p>
        <p className="text-sm text-gray-400 mt-4">{project.description}</p>
      </div>
    </motion.button>
  );
}

function Lightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const embed = toEmbed(project.videoUrl);
  const image = safeUrl(project.image, true);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus(); };
  }, [onClose]);

  return (
    <motion.div
      role="dialog" aria-modal="true" aria-label={project.title}
      className="fixed inset-0 z-50 bg-black/90 overflow-y-auto p-4 md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <div className="max-w-5xl mx-auto bg-[#101010] rounded-2xl md:rounded-[2rem] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-video bg-black">
          {embed ? (
            <iframe src={embed} title={project.title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen className="absolute inset-0 w-full h-full border-0" />
          ) : image ? (
            <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm px-6 text-center">Video coming soon.</div>
          )}
        </div>
        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-primary text-[10px] sm:text-xs">{[project.category, project.year].filter(Boolean).join(' · ')}</p>
              <h3 className="text-3xl sm:text-5xl text-[#E1E0CC] mt-2 leading-[0.95]">{project.title}</h3>
            </div>
            <button ref={closeRef} onClick={onClose} aria-label="Close" className="shrink-0 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
          <dl className="grid grid-cols-2 gap-3 mt-6 max-w-md">
            <div><dt className="text-[10px] sm:text-xs text-gray-500">Client</dt><dd className="text-sm text-[#E1E0CC] mt-1">{project.client || '—'}</dd></div>
            <div><dt className="text-[10px] sm:text-xs text-gray-500">Role</dt><dd className="text-sm text-[#E1E0CC] mt-1">{project.role || '—'}</dd></div>
          </dl>
          <p className="text-sm sm:text-base text-gray-400 mt-6 max-w-2xl">{project.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Portfolio() {
  const { data } = useSite();
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState<Project | null>(null);
  const categories = ['All', ...Array.from(new Set(data.projects.map((p) => p.category).filter(Boolean)))];
  const active = categories.includes(filter) ? filter : 'All';
  const shown = data.projects.filter((p) => active === 'All' || p.category === active);

  return (
    <section id="work" className="relative bg-black px-4 md:px-6 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-primary text-[10px] sm:text-xs mb-5">Portfolio</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl leading-[0.95] text-[#E1E0CC]">
            <WordsPullUpMultiStyle segments={[{ text: 'Selected work,', className: 'font-normal' }, { text: 'cut and finished.', className: 'italic font-serif' }]} />
          </h2>
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8" role="group" aria-label="Filter projects">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)} aria-pressed={c === active}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-colors ${c === active ? 'bg-primary text-black' : 'bg-[#212121] text-primary/70 hover:text-primary'}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        {shown.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2 md:gap-1">
            {shown.map((p, i) => <Card key={p.id} project={p} index={i} onOpen={() => setOpen(p)} />)}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm py-16">New work is on its way.</p>
        )}
      </div>

      {open && <Lightbox project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
