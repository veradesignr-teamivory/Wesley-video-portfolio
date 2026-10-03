import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { WordsPullUpMultiStyle } from './WordsPullUp';
import { safeUrl, useSite, type Client } from '../store';

function Logo({ client }: { client: Client }) {
  const logo = safeUrl(client.logo, true);
  const url = safeUrl(client.url);
  const tile = (
    <div className="w-40 h-40 sm:w-52 sm:h-52 bg-[#101010] rounded-2xl flex items-center justify-center overflow-hidden" title={client.name}>
      {logo ? (
        <img
          src={logo}
          alt={client.name}
          loading="lazy"
          className="w-full h-full object-contain"
          // dark-on-white logos: invert, then drop the (now black) background
          style={client.invert ? { filter: 'invert(1) grayscale(1)', mixBlendMode: 'screen' } : undefined}
        />
      ) : (
        <span className="text-lg sm:text-xl text-[#E1E0CC] text-center px-4 leading-tight">{client.name}</span>
      )}
    </div>
  );
  return url ? <a href={url} target="_blank" rel="noopener noreferrer">{tile}</a> : tile;
}

export function Clients() {
  const { data } = useSite();
  const { clients, settings } = data;
  // repeat the set so the strip is always wider than the screen, then double it for a seamless loop
  const reps = clients.length ? Math.max(1, Math.ceil(8 / clients.length)) : 0;
  const strip = Array.from({ length: reps }, () => clients).flat();
  const mail = `mailto:${settings.email}?subject=${encodeURIComponent('Project inquiry')}`;
  const waDigits = settings.whatsapp.replace(/\D/g, '');
  const whatsapp = waDigits ? `https://wa.me/${waDigits}?text=${encodeURIComponent('Hi Wesley, I have a project I would like to talk about.')}` : '';

  return (
    <section id="clients" className="relative bg-black pt-16 sm:pt-24 pb-6">
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative">
        <div className="text-center px-4 mb-8 sm:mb-12">
          <p className="text-primary text-[10px] sm:text-xs mb-5">Previous clients</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl leading-[0.95] text-[#E1E0CC]">
            <WordsPullUpMultiStyle segments={[{ text: 'Trusted by teams', className: 'font-normal' }, { text: 'with stories to tell.', className: 'italic font-serif' }]} />
          </h2>
        </div>

        {clients.length > 0 && (
          <div className="marquee overflow-hidden" aria-label="Client logos">
            <div className="marquee-track flex w-max gap-3 sm:gap-2 md:gap-1 pr-3 sm:pr-2 md:pr-1">
              {[0, 1].map((half) => (
                <ul key={half} className="flex gap-3 sm:gap-2 md:gap-1" aria-hidden={half === 1}>
                  {strip.map((c, i) => <li key={`${c.id}-${i}`}><Logo client={c} /></li>)}
                </ul>
              ))}
            </div>
          </div>
        )}

        {/* call to action */}
        <div className="px-4 md:px-6 mt-16 sm:mt-24">
          <div className="bg-[#101010] max-w-6xl mx-auto text-center rounded-2xl md:rounded-[2rem] px-5 sm:px-10 py-16 sm:py-24">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl mx-auto leading-[0.95] sm:leading-[0.9] text-[#E1E0CC]">
              <WordsPullUpMultiStyle segments={[{ text: "Let's make something", className: 'font-normal' }, { text: 'that moves.', className: 'italic font-serif' }]} />
            </h2>
            <p className="text-primary/70 text-xs sm:text-sm md:text-base max-w-md mx-auto mt-6">
              Tell me what you are making, who it is for and when it is due. I reply within one business day.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <motion.a
              href={mail}
              className="group inline-flex items-center gap-2 hover:gap-3 transition-all bg-primary rounded-full pl-5 pr-1 py-1 text-black font-medium text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Start a project
              <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <ArrowRight className="w-4 h-4 text-primary" />
              </span>
            </motion.a>
            {whatsapp && (
              <motion.a
                href={whatsapp} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 hover:gap-3 transition-all bg-[#212121] rounded-full pl-5 pr-1 py-1 text-primary font-medium text-sm sm:text-base"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                Message on WhatsApp
                <span className="bg-primary rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <MessageCircle className="w-4 h-4 text-black" />
                </span>
              </motion.a>
            )}
            </div>
            <p className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs sm:text-sm">
              <a href={mail} className="text-primary/70 hover:text-primary underline underline-offset-4">{settings.email}</a>
              {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary/70 hover:text-primary underline underline-offset-4">{settings.whatsapp}</a>}
            </p>
          </div>
        </div>

        <footer className="max-w-6xl mx-auto px-4 md:px-6 mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} {settings.siteName}</span>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {settings.links.filter((l) => safeUrl(l.url)).map((l) => (
              <li key={l.id}><a href={safeUrl(l.url)} target="_blank" rel="noopener noreferrer" className="text-primary/70 hover:text-primary">{l.label}</a></li>
            ))}
          </ul>
          <a href="#/admin" className="hover:text-primary">Admin</a>
        </footer>
      </div>
    </section>
  );
}
