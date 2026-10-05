/* ---------------------------------------------------------------
   Site data store.
   Everything the admin dashboard can change lives here: site name,
   links, portfolio, visual design, experience, education and clients.
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
/** A still piece of visual design work (logo, brand, print, book, illustration, UI...). */
export interface Design { id: string; title: string; category: string; client: string; image: string; description: string }
export interface SiteData {
  settings: Settings; projects: Project[]; designs: Design[]; experience: Experience[]; education: Education[]; clients: Client[];
}

/** Video portfolio categories, in the order their filter tabs appear. */
export const PROJECT_CATEGORIES = ['Editing', 'Commercial', 'UGC Ads', '2D Animation', '3D Animation', 'Motion Graphics', 'Product', 'Social', 'Color Grading'] as const;
/** Visual design disciplines. */
export const DESIGN_CATEGORIES = ['Logo Creation', 'Branding', 'Print Design', 'Social Media Design', 'Book Design', 'Illustration', 'UI Design'] as const;

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
  projects: [ // clips live in /public/work — edit titles, clients and roles here or in the admin dashboard
    { id: "w1", title: "The Webcam Workshop", client: "CompanyFlix", category: "Editing", year: "2026", role: "Editor", description: "A two-minute promo for a webcam presenting workshop: the host to camera, intercut with audience B-roll and framed picture-in-picture inserts.", videoUrl: "", video: "/work/webcam-workshop.mp4", image: "/work/webcam-workshop.jpg" },
    { id: "w2", title: "Studio Introduction", client: "", category: "Editing", year: "2026", role: "Editor", description: "A one-minute piece to camera, tightened and finished as a clean studio introduction.", videoUrl: "", video: "/work/studio-introduction.mp4", image: "/work/studio-introduction.jpg" },
    { id: "w3", title: "Scholarstika", client: "Scholarstika", category: "Commercial", year: "2026", role: "Editor · Motion", description: "A 35-second YouTube promo for a school management platform, pairing footage with animated lower-thirds for each feature.", videoUrl: "", video: "/work/scholarstika.mp4", image: "/work/scholarstika.jpg" },
    { id: "w4", title: "Depth", client: "", category: "3D Animation", year: "2026", role: "Motion Designer", description: "A 3D motion piece that floats a brand's web and mobile screens through a dark studio and closes on kinetic type.", videoUrl: "", video: "/work/depth.mp4", image: "/work/depth.jpg" },
    { id: "w5", title: "Endless Revisions", client: "Oversabi Studio", category: "2D Animation", year: "2026", role: "Motion Designer", description: "An animated promo for Oversabi Studio about bringing structure to the creative process.", videoUrl: "", video: "/work/endless-revisions.mp4", image: "/work/endless-revisions.jpg" },
    { id: "w6", title: "From Sofa to Payout", client: "LuxBet", category: "2D Animation", year: "2026", role: "Editor · Animator", description: "A five-scene animated explainer that follows a bet from a message on the sofa to confirmation, the win and the payout.", videoUrl: "", video: "/work/luxbet-explainer.mp4", image: "/work/luxbet-explainer.jpg" },
    { id: "w7", title: "FlowTask", client: "FlowTask", category: "UGC Ads", year: "2026", role: "Editor", description: "An eight-second SaaS ad: a presenter to camera with on-screen callouts and a cutaway to the product.", videoUrl: "", video: "/work/flowtask.mp4", image: "/work/flowtask.jpg" },
    { id: "w8", title: "Ember & Bite", client: "Ember & Bite", category: "UGC Ads", year: "2026", role: "Editor", description: "An eight-second restaurant spot built around one burger and a very happy customer.", videoUrl: "", video: "/work/ember-and-bite.mp4", image: "/work/ember-and-bite.jpg" },
    { id: "w9", title: "Glow Routine", client: "", category: "UGC Ads", year: "2026", role: "Editor", description: "A skincare ad in three beats: the mirror, the product to camera, and the application.", videoUrl: "", video: "/work/glow-routine.mp4", image: "/work/glow-routine.jpg" },
    { id: "w10", title: "Marble & Serum", client: "", category: "Product", year: "2026", role: "Editor", description: "A product film for a skincare serum: the bottle on marble, a macro drop, and the texture on skin.", videoUrl: "", video: "/work/marble-serum.mp4", image: "/work/marble-serum.jpg" },
    { id: "w11", title: "Hillside Estate", client: "", category: "Commercial", year: "2026", role: "Editor", description: "A luxury real-estate teaser moving from the exterior to the living space and the view.", videoUrl: "", video: "/work/hillside-estate.mp4", image: "/work/hillside-estate.jpg" },
    { id: "w12", title: "Slow Burn", client: "", category: "Product", year: "2026", role: "Editor", description: "A slow push-in on a single candle: a calm, minimal product shot.", videoUrl: "", video: "/work/slow-burn.mp4", image: "/work/slow-burn.jpg" },
    { id: "w13", title: "Craving Something Special?", client: "", category: "Social", year: "2026", role: "Editor", description: "A vertical food reel with captioned beats, cut for social.", videoUrl: "", video: "/work/craving-something-special.mp4", image: "/work/craving-something-special.jpg" },
    { id: "v1", title: "Rain to Gold", client: "", category: "Color Grading", year: "2026", role: "Colorist", description: "A rainy city street taken from a flat log profile to a warm, golden-hour grade, with the transition played out in a single shot.", videoUrl: "", video: "/work/city-street-grade.mp4", image: "/work/city-street-grade.jpg" },
    { id: "v2", title: "Into the Frame", client: "", category: "Editing", year: "2026", role: "Editor", description: "One continuous push from the editing timeline into the shot itself: from the cut, through the program monitor, out onto the open road.", videoUrl: "", video: "/work/into-the-edit.mp4", image: "/work/into-the-edit.jpg" },
  ],
  designs: [ // visual design pieces: files live in /public/design
    { id: "g1", title: "Rwanda: Small Country, Big Momentum", category: "Social Media Design", client: "NDI", image: "/design/rwanda-momentum.webp", description: "A carousel slide pairing headline figures with a map and skyline, in a dark green brand palette." },
    { id: "g2", title: "Vibe It Up! Issue 64", category: "Print Design", client: "Wellness Practitioners Alliance", image: "/design/vibe-it-up-magazine.webp", description: "Magazine cover design and layout, shown as a printed mockup." },
    { id: "g3", title: "There Has to Be a Better Way", category: "Illustration", client: "", image: "/design/better-way.webp", description: "A 3D-style character illustration of a school administrator buried in paperwork." },
    { id: "g4", title: "Learning Platform: Course Catalogue", category: "UI Design", client: "", image: "/design/lms-catalogue.webp", description: "Course listing with category, level and price filters." },
    { id: "g5", title: "Hello August", category: "Social Media Design", client: "Niger Delta Innovate", image: "/design/hello-august.webp", description: "A new-month greeting post with bold stacked type over a circuit pattern." },
    { id: "g6", title: "Happy Teachers' Day", category: "Social Media Design", client: "", image: "/design/teachers-day.webp", description: "A Teachers' Day greeting built on a notebook-paper collage." },
    { id: "g7", title: "Normal People vs Cybersecurity Engineer", category: "Illustration", client: "", image: "/design/cybersecurity-engineer.webp", description: "A two-panel cartoon contrasting a quiet night with life on security watch." },
    { id: "g8", title: "Learning Platform: Student Profile", category: "UI Design", client: "", image: "/design/lms-profile.webp", description: "Student dashboard with course progress cards and status tabs." },
    { id: "g9", title: "Before You Start, Make Research", category: "Social Media Design", client: "Binna", image: "/design/make-research.webp", description: "A designer-tip post with a lamp-lit desk scene and glowing call to action." },
    { id: "g10", title: "I Prepared", category: "Illustration", client: "", image: "/design/i-prepared.webp", description: "An editorial cartoon about side incomes and job security." },
    { id: "g11", title: "Learning Platform: Account Settings", category: "UI Design", client: "", image: "/design/lms-settings.webp", description: "Profile settings with cover photo, personal details and display name." },
    { id: "g12", title: "Learning Platform: Lesson View", category: "UI Design", client: "", image: "/design/lms-lesson.webp", description: "Lesson page with course outline, progress and exercise files." },
    { id: "g13", title: "Learning Platform: Student Registration", category: "UI Design", client: "", image: "/design/lms-registration.webp", description: "Sign-up form for new students." },
    { id: "g14", title: "Learning Platform: Change Password", category: "UI Design", client: "", image: "/design/lms-password.webp", description: "Password settings inside the student account area." },
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
  d.designs = list<Design>(r.designs, ['title', 'category', 'client', 'image', 'description']) ?? d.designs;
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
