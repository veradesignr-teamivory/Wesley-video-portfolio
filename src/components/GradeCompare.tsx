import { useEffect, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { WordsPullUpMultiStyle } from './WordsPullUp';
import { studio } from '../content';

const { grade } = studio;

export function GradeCompare() {
  const [pos, setPos] = useState(50);
  const [active, setActive] = useState(0);
  const rawRef = useRef<HTMLVideoElement>(null);
  const gradedRef = useRef<HTMLVideoElement>(null);
  const preset = grade.presets[active];

  // keep the two stacked copies of the clip on the same frame
  useEffect(() => {
    const id = window.setInterval(() => {
      const a = rawRef.current;
      const b = gradedRef.current;
      if (a && b && Math.abs(a.currentTime - b.currentTime) > 0.12) b.currentTime = a.currentTime;
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div id="grade" className="max-w-6xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-primary text-[10px] sm:text-xs mb-5">{grade.label}</p>
        <h2 className="text-2xl sm:text-4xl md:text-5xl leading-[0.95] text-[#E1E0CC]">
          <WordsPullUpMultiStyle segments={grade.heading} />
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto mt-5">{grade.sub}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4" role="group" aria-label="Grade preset">
        {grade.presets.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-colors ${
              i === active ? 'bg-primary text-black' : 'bg-[#212121] text-primary/70 hover:text-primary'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="relative aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#101010] select-none">
        {/* raw (flat) layer */}
        <video
          ref={rawRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: grade.rawFilter }}
          src={grade.video}
          autoPlay
          loop
          muted
          playsInline
        />
        {/* graded layer, revealed from the left */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <video
            ref={gradedRef}
            className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500"
            style={{ filter: preset.filter }}
            src={grade.video}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 mix-blend-soft-light transition-all duration-500" style={{ background: preset.tint }} />
        </div>

        <span className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-black/70 text-primary rounded-full px-3 py-1 text-[10px] sm:text-xs">
          Graded master
        </span>
        <span className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-black/70 text-primary/70 rounded-full px-3 py-1 text-[10px] sm:text-xs">
          Raw footage
        </span>

        {/* divider + handle */}
        <div className="absolute top-0 bottom-0 w-px bg-primary pointer-events-none" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg">
            <MoveHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>

        {/* invisible range input: handles mouse, touch and keyboard */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare raw footage with graded master"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 md:gap-1 mt-3 sm:mt-2 md:mt-1">
        {preset.stats.map(([k, v]) => (
          <div key={k} className="bg-[#212121] rounded-2xl px-5 py-4">
            <dt className="text-[10px] sm:text-xs text-gray-500">{k}</dt>
            <dd className="text-sm sm:text-base text-[#E1E0CC] mt-1">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
