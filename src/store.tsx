/* ---------------------------------------------------------------
   Site data store.
   Everything the admin dashboard can change lives here: site name,
   links, portfolio, experience, education and clients.
   Defaults below ship with the site; admin edits are saved to this
   browser's localStorage and override them.
   --------------------------------------------------------------- */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface LinkItem { id: string; label: string; url: string }
export interface Settings { siteName: string; heroTitle: string; email: string; /** international format, e.g. +44 7000 000000 */ whatsapp: string; links: LinkItem[] }
export interface Project {
  id: string; title: string; client: string; category: string; year: string; role: string;
  description: string;
  /** YouTube / Vimeo URL — opens in a player when the card is clicked */
  videoUrl: string;
  /** self-hosted clip: path under /public (e.g. /work/clip.mp4) or a direct .mp4 URL — plays on hover and in the player */
  video: string;
  /** thumbnail: image URL, /public path or uploaded data URI (optional) */
  image: string;
}
export interface Experience { id: string; role: string; company: string; period: string; description: string }
export interface Education { id: string; title: string; school: string; period: string; description: string }
export interface Client {
  id: string; name: string; logo: string; url: string;
  /** true for dark logos on a white background: they are inverted to sit on the dark site */
  invert: boolean;
}
export interface SiteData {
  settings: Settings; projects: Project[]; experience: Experience[]; education: Education[]; clients: Client[];
}

export const DEFAULTS: SiteData = {
  settings: {
    siteName: 'Oversabi Studio',
    heroTitle: 'Wesley',
    email: 'veradesignr@gmail.com',
    whatsapp: '+44 7770208286',
    links: [ // (placeholder URLs)
      { id: 'l1', label: 'YouTube', url: 'https://youtube.com/' },
      { id: 'l2', label: 'Instagram', url: 'https://instagram.com/' },
      { id: 'l3', label: 'Behance', url: 'https://behance.net/' },
      { id: 'l4', label: 'Vimeo', url: 'https://vimeo.com/' },
      { id: 'l5', label: 'LinkedIn', url: 'https://linkedin.com/' },
    ],
  },
  projects: [ // (placeholder projects — replace or delete from the admin dashboard)
    { id: 'v1', title: 'Rain to Gold', client: '', category: 'Color Grading', year: '2026', role: 'Colorist', description: 'A rainy city street taken from a flat log profile to a warm, golden-hour grade, with the transition played out in a single shot.', videoUrl: '', video: '/work/city-street-grade.mp4', image: '/work/city-street-grade.jpg' },
    { id: 'v2', title: 'Into the Frame', client: '', category: 'Editing', year: '2026', role: 'Editor', description: 'One continuous push from the editing timeline into the shot itself: from the cut, through the program monitor, out onto the open road.', videoUrl: '', video: '/work/into-the-edit.mp4', image: '/work/into-the-edit.jpg' },
    { id: 'p1', title: 'Northbound', client: 'Outdoor brand', category: 'Commercial', year: '2026', role: 'Editor · Colorist', description: 'A 60-second winter campaign film with 15- and 6-second cutdowns for broadcast and paid social.', videoUrl: '', video: '', image: '' },
    { id: 'p2', title: 'Afterglow', client: 'Recording artist', category: 'Music Video', year: '2026', role: 'Editor · VFX', description: 'Performance and narrative intercut, with a dream sequence built on light leaks and frame blending.', videoUrl: '', video: '', image: '' },
    { id: 'p3', title: 'Build Mode', client: 'Tech creator', category: 'YouTube', year: '2025', role: 'Lead Editor', description: 'A weekly long-form series: sharper pacing and a consistent graphics language across every episode.', videoUrl: '', video: '', image: '' },
    { id: 'p4', title: 'Made Slow', client: 'Coffee roaster', category: 'Brand Film', year: '2025', role: 'Editor · Sound', description: 'A three-minute brand documentary with an interview-led edit, sound design and a warm film grade.', videoUrl: '', video: '', image: '' },
    { id: 'p5', title: 'Drop 07', client: 'Athletics label', category: 'Social', year: '2026', role: 'Editor · Motion', description: 'Eighteen vertical edits for a launch week, with kinetic captions and a shared type system.', videoUrl: '', video: '', image: '' },
    { id: 'p6', title: 'Signal / Noise', client: 'Fintech platform', category: 'Motion', year: '2025', role: 'Motion Designer', description: 'A 75-second animated explainer and launch title sequence, from storyboards to sound design.', videoUrl: '', video: '', image: '' },
  ],
  experience: [ // (placeholder)
    { id: 'e1', role: 'Founder · Lead Editor & Motion Designer', company: 'Oversabi Studio', period: '2021 — Present', description: 'Independent post-production studio delivering edit, motion, color and sound for brands, artists and creators worldwide.' },
    { id: 'e2', role: 'Senior Video Editor', company: 'Agency / Production Company', period: '2019 — 2021', description: 'Cut commercials and branded content, and led the motion graphics toolkit for recurring clients.' },
    { id: 'e3', role: 'Assistant Editor', company: 'Post House', period: '2018 — 2019', description: 'Ingest, sync, conform and versioning across broadcast and online deliveries.' },
  ],
  education: [
    { id: 'd1', title: 'B.Tech — Computer Science', school: 'Federal University of Technology, Akure, Nigeria', period: '2024', description: '' },
  ],
  clients: [
    { id: 'c1', name: 'Jennifer Barbosa', logo: '/clients/barbosa-jennifer.webp', url: '', invert: true },
    { id: 'c2', name: 'Cyberspace', logo: '/clients/cyberspace.png', url: '', invert: false },
    { id: 'c4', name: 'International Friends Alliance', logo: '/clients/ifa.png', url: '', invert: false },
  ],
};

const KEY = 'oversabi.site.v1';
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/** Only allow URL schemes that are safe to put in href / src. */
export function safeUrl(u: string | undefined, allowData = false): string {
  const s = String(u ?? '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s) || /^mailto:/i.test(s)) return s;
  if (allowData && /^data:image\//i.test(s)) return s;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) return s; // relative path
  return '';
}

/** YouTube / Vimeo page URL → embeddable player URL ('' if not recognised). */
export function toEmbed(u: string): string {
  try {
    const x = new URL(u);
    const h = x.hostname.replace(/^www\./, '');
    let id: string | null | undefined;
    if (h === 'youtu.be') id = x.pathname.slice(1);
    else if (/(^|\.)youtube(-nocookie)?\.com$/.test(h)) id = x.searchParams.get('v') ?? x.pathname.match(/\/(embed|shorts|live)\/([\w-]+)/)?.[2];
    if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&autoplay=1`;
    if (h === 'vimeo.com' || h === 'player.vimeo.com') {
      const m = x.pathname.match(/(\d{5,})/);
      if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1`;
    }
  } catch { /* not a URL */ }
  return '';
}

export function normalize(raw: unknown): SiteData {
  const d = clone(DEFAULTS);
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Partial<SiteData>;
  const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const list = <T extends { id: string }>(v: unknown, keys: (keyof T)[], bools: (keyof T)[] = []): T[] | null =>
    Array.isArray(v)
      ? v.filter((x) => x && typeof x === 'object').map((x) => {
          const o: Record<string, unknown> = { id: str(x.id) || uid() };
          keys.forEach((k) => (o[k as string] = str(x[k])));
          bools.forEach((k) => (o[k as string] = Boolean(x[k])));
          return o as T;
        })
      : null;
  d.projects = list<Project>(r.projects, ['title', 'client', 'category', 'year', 'role', 'description', 'videoUrl', 'video', 'image']) ?? d.projects;
  d.experience = list<Experience>(r.experience, ['role', 'company', 'period', 'description']) ?? d.experience;
  d.education = list<Education>(r.education, ['title', 'school', 'period', 'description']) ?? d.education;
  d.clients = list<Client>(r.clients, ['name', 'logo', 'url'], ['invert']) ?? d.clients;
  if (r.settings && typeof r.settings === 'object') {
    const s = r.settings as Partial<Settings>;
    d.settings.siteName = str(s.siteName) || d.settings.siteName;
    d.settings.heroTitle = str(s.heroTitle) || d.settings.heroTitle;
    d.settings.email = str(s.email) || d.settings.email;
    if (typeof s.whatsapp === 'string') d.settings.whatsapp = s.whatsapp;
    d.settings.links = list<LinkItem>(s.links, ['label', 'url']) ?? d.settings.links;
  }
  return d;
}

function load(): SiteData {
  try {
    const s = localStorage.getItem(KEY);
    if (s) return normalize(JSON.parse(s));
  } catch { /* storage blocked or corrupt */ }
  return clone(DEFAULTS);
}

interface Store {
  data: SiteData;
  /** Apply a change; returns false if it could not be saved to storage. */
  update: (fn: (draft: SiteData) => void) => boolean;
  replace: (next: SiteData) => boolean;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(load);

  const persist = (next: SiteData) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); return true; } catch { return false; }
  };
  const replace = useCallback((next: SiteData) => { setData(next); return persist(next); }, []);
  const update = useCallback((fn: (draft: SiteData) => void) => {
    const draft = clone(data); fn(draft); setData(draft); return persist(draft);
  }, [data]);
  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setData(clone(DEFAULTS));
  }, []);

  // keep other open tabs (site ↔ admin) in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setData(load()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => { document.title = `${data.settings.siteName} — Video Editor & Motion Designer`; }, [data.settings.siteName]);

  const value = useMemo(() => ({ data, update, replace, reset }), [data, update, replace, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSite must be used inside <SiteProvider>');
  return v;
}
