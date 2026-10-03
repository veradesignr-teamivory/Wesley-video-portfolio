import { useRef, useState, type PointerEvent } from 'react';
import { useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { Check, Pause, Play } from 'lucide-react';
import { WordsPullUpMultiStyle } from './WordsPullUp';
import { studio } from '../content';

const { timeline } = studio;
const FPS = 24;
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
const timecode = (s: number) => `00:00:${pad(s)}:${pad((s % 1) * FPS)}`;

export function TimelineEditor() {
  const reduced = useReducedMotion();
  const [t, setT] = useState(9.5);
  const [playing, setPlaying] = useState(!reduced);
  const [lut, setLut] = useState(true);
  const [sfx, setSfx] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lanesRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: '100px' });

  useAnimationFrame((_, delta) => {
    if (playing && inView) setT((v) => (v + Math.min(delta, 100) / 1000) % timeline.duration);
  });

  const scrubTo = (e: PointerEvent<HTMLDivElement>) => {
    const lane = lanesRef.current?.querySelector('[data-lane]');
    if (!lane) return;
    const r = lane.getBoundingClientRect();
    setT(Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width)) * timeline.duration);
  };

  const p = t / timeline.duration;
  const activeClip = timeline.tracks.find((tr) => tr.id === 'V1')?.clips.find((c) => t >= c.start && t < c.end);
  const toggle = 'rounded-full px-4 py-2 text-xs sm:text-sm transition-colors';
  const on = 'bg-primary text-black';
  const off = 'bg-[#212121] text-primary/70 hover:text-primary';

  return (
    <div id="timeline" ref={wrapRef} className="max-w-6xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-primary text-[10px] sm:text-xs mb-5">{timeline.label}</p>
        <h2 className="text-2xl sm:text-4xl md:text-5xl leading-[0.95] text-[#E1E0CC]">
          <WordsPullUpMultiStyle segments={timeline.heading} />
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto mt-5">{timeline.sub}</p>
      </div>

      <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] p-3 sm:p-5 md:p-6">
        {/* transport */}
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          <button
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? 'Pause timeline' : 'Play timeline'}
            className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <span className="text-[#E1E0CC] text-base sm:text-xl tabular-nums mx-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {timecode(t)}
          </span>
          <button onClick={() => setLut((v) => !v)} aria-pressed={lut} className={`${toggle} ${lut ? on : off} ml-auto`}>
            Grade: {lut ? 'on' : 'off'}
          </button>
          <button onClick={() => setSfx((v) => !v)} aria-pressed={sfx} className={`${toggle} ${sfx ? on : off}`}>
            Sound FX: {sfx ? 'on' : 'muted'}
          </button>
        </div>

        {/* program monitor */}
        <div className="relative aspect-[2.2/1] rounded-xl md:rounded-2xl overflow-hidden bg-black">
          <video
            className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500"
            style={{ filter: lut ? timeline.lut : timeline.flat }}
            src={timeline.video}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[10px] sm:text-xs text-primary/70">Program monitor</span>
          <p className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-sm sm:text-lg text-[#E1E0CC]">
            <span className="text-gray-400 text-[10px] sm:text-xs block">Active clip</span>
            {activeClip?.label ?? '—'}
          </p>
        </div>

        {/* tracks */}
        <div
          ref={lanesRef}
          className="relative mt-3 sm:mt-4 cursor-ew-resize touch-none [--label:3rem] sm:[--label:10rem]"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            scrubTo(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && scrubTo(e)}
        >
          {timeline.tracks.map((track) => {
            const muted = track.id === 'A2' && !sfx;
            const audio = track.id.startsWith('A');
            return (
              <div key={track.id} className="flex items-stretch border-t border-white/5 first:border-t-0">
                <div className="w-[var(--label)] shrink-0 py-2 pr-2 text-[10px] sm:text-xs text-gray-500 flex items-center gap-2">
                  <span className="text-primary">{track.id}</span>
                  <span className="hidden sm:inline truncate">{track.name}</span>
                </div>
                <div data-lane className={`relative flex-1 h-9 sm:h-11 transition-opacity ${muted ? 'opacity-25' : ''}`}>
                  {track.clips.map((clip) => {
                    const live = !muted && t >= clip.start && t < clip.end;
                    return (
                      <span
                        key={clip.label}
                        className={`absolute top-1 bottom-1 rounded-md px-2 flex items-center text-[10px] sm:text-xs whitespace-nowrap overflow-hidden transition-colors ${
                          live ? 'bg-primary text-black' : audio ? 'bg-[#1a1a1a] text-gray-400 border border-white/10' : 'bg-[#2a2a2a] text-primary/80'
                        }`}
                        style={{
                          left: `${(clip.start / timeline.duration) * 100}%`,
                          width: `calc(${((clip.end - clip.start) / timeline.duration) * 100}% - 2px)`,
                        }}
                      >
                        {clip.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* playhead */}
          <div
            className="absolute top-0 bottom-0 w-px bg-primary pointer-events-none"
            style={{ left: `calc(var(--label) + (100% - var(--label)) * ${p})` }}
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-primary" />
          </div>
        </div>

        {/* keyboard-accessible scrubber */}
        <input
          type="range"
          min={0}
          max={timeline.duration}
          step={1 / FPS}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          aria-label="Scrub timeline"
          aria-valuetext={timecode(t)}
          className="w-full mt-3 accent-[#DEDBC8] h-1"
        />

        <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
          {timeline.notes.map((n) => (
            <li key={n} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <Check className="w-4 h-4 text-primary shrink-0" />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
