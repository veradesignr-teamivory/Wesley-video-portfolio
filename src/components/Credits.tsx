import { WordsPullUpMultiStyle } from './WordsPullUp';
import { useSite } from '../store';

interface Row { id: string; heading: string; sub: string; period: string; description: string }

function Column({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] p-5 sm:p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl sm:text-2xl text-[#E1E0CC]">{title}.</h3>
        <span className="text-xs text-gray-500">{String(rows.length).padStart(2, '0')}</span>
      </div>
      <ol className="mt-4">
        {rows.length ? rows.map((r) => (
          <li key={r.id} className="border-t border-white/10 py-5 grid sm:grid-cols-[8.5rem_1fr] gap-1 sm:gap-5">
            <span className="text-xs text-primary pt-1">{r.period}</span>
            <div>
              <h4 className="text-base sm:text-lg text-[#E1E0CC] leading-snug">{r.heading}</h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{r.sub}</p>
              {r.description && <p className="text-sm text-gray-400 mt-3">{r.description}</p>}
            </div>
          </li>
        )) : <li className="border-t border-white/10 py-5 text-sm text-gray-500">Nothing listed yet.</li>}
      </ol>
    </div>
  );
}

export function Credits() {
  const { data } = useSite();
  return (
    <section id="experience" className="bg-black px-4 md:px-6 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-primary text-[10px] sm:text-xs mb-5">Experience & education</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl leading-[0.95] text-[#E1E0CC]">
            <WordsPullUpMultiStyle segments={[{ text: 'Where the craft', className: 'font-normal' }, { text: 'was learned.', className: 'italic font-serif' }]} />
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-2 md:gap-1">
          <Column title="Experience" rows={data.experience.map((e) => ({ id: e.id, heading: e.role, sub: e.company, period: e.period, description: e.description }))} />
          <Column title="Education" rows={data.education.map((e) => ({ id: e.id, heading: e.title, sub: e.school, period: e.period, description: e.description }))} />
        </div>
      </div>
    </section>
  );
}
