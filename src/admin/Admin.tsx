/* ---------------------------------------------------------------
   Admin dashboard (open at  #/admin ).
   Manages: site name + links, portfolio, experience, education, clients.

   IMPORTANT: this site has no server. Edits are saved in this
   browser's localStorage, and the login below is checked in the
   browser, so it keeps casual visitors out but is not real security.
   To make edits live for every visitor, use "Export" and paste the
   result into DEFAULTS in src/store.tsx (or connect a real backend).
   --------------------------------------------------------------- */
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, Download, LogOut, Plus, Trash2, Upload } from 'lucide-react';
import { DEFAULTS, normalize, safeUrl, uid, useSite, type SiteData } from '../store';

// SHA-256 of "<email>:<password>" — the password itself is not stored in the code
const AUTH_HASH = '5ece883efd7cc5d0d6482d096cd0dd4f6b0d53985fac2e50906caa3575b57cda';
const SESSION = 'oversabi.admin';

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Read an image file and shrink it so it fits comfortably in localStorage. */
function readImage(file: File, maxW: number, maxH: number, mime: 'image/png' | 'image/jpeg'): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('That file is not an image.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const src = String(reader.result);
      if (file.type === 'image/svg+xml') return src.length < 300_000 ? resolve(src) : reject(new Error('SVG is too large (max ~200 KB).'));
      const img = new Image();
      img.onerror = () => reject(new Error('That image could not be decoded.'));
      img.onload = () => {
        const k = Math.min(1, maxW / img.width, maxH / img.height);
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * k));
        c.height = Math.max(1, Math.round(img.height * k));
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL(mime, 0.82));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

const input = 'w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E1E0CC] placeholder:text-gray-600 focus:border-primary focus:outline-none';
const btn = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors';
const btnPrimary = `${btn} bg-primary text-black font-medium hover:bg-white`;
const btnGhost = `${btn} bg-[#212121] text-primary/80 hover:text-primary`;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] sm:text-xs text-gray-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

/* ---------------- login ---------------- */
function Login({ onOk }: { onOk: () => void }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const hash = await sha256(`${String(f.get('email')).trim().toLowerCase()}:${String(f.get('password'))}`);
      if (hash === AUTH_HASH) { sessionStorage.setItem(SESSION, '1'); onOk(); }
      else setError('That email or password is not right.');
    } catch { setError('Sign-in needs a secure page (https or localhost).'); }
    setBusy(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-[#101010] rounded-2xl md:rounded-[2rem] p-6 sm:p-8 space-y-4">
        <p className="text-primary text-[10px] sm:text-xs">Admin</p>
        <h1 className="text-3xl text-[#E1E0CC] leading-none">Sign in <span className="font-serif italic">to edit.</span></h1>
        <Field label="Email"><input name="email" type="email" autoComplete="username" required className={input} /></Field>
        <Field label="Password"><input name="password" type="password" autoComplete="current-password" required className={input} /></Field>
        <p role="alert" className="text-xs text-red-300 min-h-[1rem]">{error}</p>
        <button className={`${btnPrimary} w-full`} disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
        <a href="#/" className="block text-center text-xs text-gray-500 hover:text-primary">← Back to site</a>
      </form>
    </div>
  );
}

/* ---------------- generic list manager ---------------- */
type Kind = 'text' | 'textarea' | 'url' | 'image' | 'logo' | 'checkbox';
interface FieldDef { key: string; label: string; kind?: Kind; required?: boolean; placeholder?: string }
type CollectionKey = 'projects' | 'experience' | 'education' | 'clients';

const COLLECTIONS: Record<CollectionKey, { label: string; one: string; newestFirst: boolean; title: (x: any) => string; sub: (x: any) => string; fields: FieldDef[] }> = {
  projects: {
    label: 'Portfolio', one: 'project', newestFirst: true,
    title: (x) => x.title, sub: (x) => [x.client, x.category, x.year].filter(Boolean).join(' · '),
    fields: [
      { key: 'title', label: 'Project title', required: true },
      { key: 'client', label: 'Client' },
      { key: 'category', label: 'Category', placeholder: 'Commercial, Music Video, YouTube…' },
      { key: 'year', label: 'Year' },
      { key: 'role', label: 'Your role', placeholder: 'Editor · Colorist' },
      { key: 'videoUrl', label: 'YouTube / Vimeo link', kind: 'url', placeholder: 'https://…' },
      { key: 'image', label: 'Thumbnail image', kind: 'image' },
      { key: 'description', label: 'Description', kind: 'textarea' },
    ],
  },
  experience: {
    label: 'Experience', one: 'role', newestFirst: true,
    title: (x) => x.role, sub: (x) => [x.company, x.period].filter(Boolean).join(' · '),
    fields: [
      { key: 'role', label: 'Role / job title', required: true },
      { key: 'company', label: 'Company / client', required: true },
      { key: 'period', label: 'Period', placeholder: '2022 — Present' },
      { key: 'description', label: 'What you did', kind: 'textarea' },
    ],
  },
  education: {
    label: 'Education', one: 'entry', newestFirst: true,
    title: (x) => x.title, sub: (x) => [x.school, x.period].filter(Boolean).join(' · '),
    fields: [
      { key: 'title', label: 'Qualification / course', required: true },
      { key: 'school', label: 'School / institution', required: true },
      { key: 'period', label: 'Period', placeholder: '2016 — 2018' },
      { key: 'description', label: 'Notes', kind: 'textarea' },
    ],
  },
  clients: {
    label: 'Clients', one: 'client', newestFirst: false,
    title: (x) => x.name, sub: (x) => (x.logo ? 'Logo' : 'Text only') + (x.url ? ` · ${x.url}` : ''),
    fields: [
      { key: 'name', label: 'Client name', required: true },
      { key: 'url', label: 'Client website (optional)', kind: 'url', placeholder: 'https://…' },
      { key: 'logo', label: 'Logo image (PNG, SVG, JPG, WebP)', kind: 'logo' },
      { key: 'invert', label: 'Logo is dark on a white background (invert it for the dark site)', kind: 'checkbox' },
    ],
  },
};

function Collection({ name, flash }: { name: CollectionKey; flash: (m: string) => void }) {
  const { data, update } = useSite();
  const def = COLLECTIONS[name];
  const items = data[name] as any[];
  const formRef = useRef<HTMLFormElement>(null);

  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const item: Record<string, unknown> = { id: uid() };
    try {
      for (const fd of def.fields) {
        if (fd.kind === 'image' || fd.kind === 'logo') {
          const file = f.get(fd.key) as File | null;
          item[fd.key] = file && file.size ? await readImage(file, fd.kind === 'logo' ? 480 : 960, fd.kind === 'logo' ? 480 : 540, fd.kind === 'logo' ? 'image/png' : 'image/jpeg') : '';
        } else if (fd.kind === 'checkbox') item[fd.key] = f.get(fd.key) === 'on';
        else item[fd.key] = String(f.get(fd.key) ?? '').trim();
      }
    } catch (err) { flash((err as Error).message); return; }
    const ok = update((d) => { def.newestFirst ? (d[name] as any[]).unshift(item) : (d[name] as any[]).push(item); });
    flash(ok ? `Added to ${def.label.toLowerCase()}.` : 'Added, but browser storage is full — it will not survive a reload.');
    formRef.current?.reset();
  };

  const remove = (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    update((d) => { (d as any)[name] = (d[name] as any[]).filter((x) => x.id !== id); });
    flash(`Deleted "${title}".`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-3 sm:gap-2 md:gap-1 items-start">
      <div className="bg-[#101010] rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl text-[#E1E0CC]">{def.label} <span className="text-gray-500 text-sm">({items.length})</span></h2>
        <ul className="mt-4">
          {items.length ? items.map((x) => (
            <li key={x.id} className="flex items-center gap-3 border-t border-white/10 py-3">
              {(x.logo || x.image) && safeUrl(x.logo || x.image, true) && (
                <img src={safeUrl(x.logo || x.image, true)} alt="" className="w-12 h-12 rounded-lg object-contain bg-black shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#E1E0CC] truncate">{def.title(x)}</p>
                <p className="text-xs text-gray-500 truncate">{def.sub(x)}</p>
              </div>
              <button onClick={() => remove(x.id, def.title(x))} aria-label={`Delete ${def.title(x)}`}
                className="shrink-0 w-9 h-9 rounded-full bg-[#212121] text-red-300 hover:bg-red-400 hover:text-black flex items-center justify-center transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          )) : <li className="border-t border-white/10 py-4 text-sm text-gray-500">Nothing here yet.</li>}
        </ul>
      </div>

      <form ref={formRef} onSubmit={add} className="bg-[#212121] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-xl text-[#E1E0CC]">Add {def.one}</h2>
        {def.fields.map((fd) =>
          fd.kind === 'checkbox' ? (
            <label key={fd.key} className="flex items-start gap-3 text-sm text-gray-400">
              <input type="checkbox" name={fd.key} className="mt-1 accent-[#DEDBC8]" /> {fd.label}
            </label>
          ) : (
            <Field key={fd.key} label={fd.label + (fd.required ? ' *' : '')}>
              {fd.kind === 'textarea' ? <textarea name={fd.key} rows={3} className={input} />
                : fd.kind === 'image' || fd.kind === 'logo' ? <input name={fd.key} type="file" accept="image/*" className={`${input} file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:text-black`} />
                : <input name={fd.key} type={fd.kind === 'url' ? 'url' : 'text'} required={fd.required} placeholder={fd.placeholder} className={input} />}
            </Field>
          ),
        )}
        <button className={btnPrimary}><Plus className="w-4 h-4" /> Add {def.one}</button>
      </form>
    </div>
  );
}

/* ---------------- site settings ---------------- */
function SiteSettings({ flash }: { flash: (m: string) => void }) {
  const { data, update, replace, reset } = useSite();
  const s = data.settings;
  const importRef = useRef<HTMLInputElement>(null);

  const saveBasics = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    update((d) => {
      d.settings.siteName = String(f.get('siteName')).trim() || DEFAULTS.settings.siteName;
      d.settings.heroTitle = String(f.get('heroTitle')).trim() || DEFAULTS.settings.heroTitle;
      d.settings.email = String(f.get('email')).trim() || DEFAULTS.settings.email;
      d.settings.whatsapp = String(f.get('whatsapp')).trim();
    });
    flash('Site details saved.');
  };
  const addLink = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const url = safeUrl(String(f.get('url')));
    if (!url) return flash('Enter a full link starting with https://');
    update((d) => { d.settings.links.push({ id: uid(), label: String(f.get('label')).trim(), url }); });
    e.currentTarget.reset(); flash('Link added.');
  };
  const exportJson = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = 'site-content.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const importJson = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result)) as Partial<SiteData>;
        if (!parsed || !Array.isArray(parsed.projects)) throw new Error();
        flash(replace(normalize(parsed)) ? 'Content imported.' : 'Imported, but browser storage is full.');
      } catch { flash('That file is not a valid content export.'); }
    };
    r.readAsText(file);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-3 sm:gap-2 md:gap-1 items-start">
      <form onSubmit={saveBasics} key={`${s.siteName}|${s.heroTitle}|${s.email}|${s.whatsapp}`} className="bg-[#212121] rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-xl text-[#E1E0CC]">Site details</h2>
        <Field label="Website name"><input name="siteName" defaultValue={s.siteName} required className={input} /></Field>
        <Field label="Hero word (the giant name)"><input name="heroTitle" defaultValue={s.heroTitle} required className={input} /></Field>
        <Field label="Contact email (used by every button)"><input name="email" type="email" defaultValue={s.email} required className={input} /></Field>
        <Field label="WhatsApp number (with country code; leave empty to hide the button)"><input name="whatsapp" type="tel" defaultValue={s.whatsapp} placeholder="+44 7000 000000" className={input} /></Field>
        <button className={btnPrimary}>Save details</button>
      </form>

      <div className="bg-[#101010] rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl text-[#E1E0CC]">Website links <span className="text-gray-500 text-sm">({s.links.length})</span></h2>
        <ul className="mt-4">
          {s.links.map((l) => (
            <li key={l.id} className="flex items-center gap-3 border-t border-white/10 py-3">
              <div className="min-w-0 flex-1"><p className="text-sm text-[#E1E0CC] truncate">{l.label}</p><p className="text-xs text-gray-500 truncate">{l.url}</p></div>
              <button onClick={() => { update((d) => { d.settings.links = d.settings.links.filter((x) => x.id !== l.id); }); flash(`Removed ${l.label}.`); }}
                aria-label={`Delete ${l.label}`} className="shrink-0 w-9 h-9 rounded-full bg-[#212121] text-red-300 hover:bg-red-400 hover:text-black flex items-center justify-center transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addLink} className="grid sm:grid-cols-[1fr_1.5fr_auto] gap-2 mt-4">
          <input name="label" placeholder="Label (e.g. TikTok)" required aria-label="Link label" className={input} />
          <input name="url" type="url" placeholder="https://…" required aria-label="Link URL" className={input} />
          <button className={btnPrimary}><Plus className="w-4 h-4" /> Add</button>
        </form>
      </div>

      <div className="bg-[#101010] rounded-2xl p-5 sm:p-6 lg:col-span-2">
        <h2 className="text-xl text-[#E1E0CC]">Backup & publish</h2>
        <p className="text-sm text-gray-400 mt-2 max-w-3xl">
          Changes are saved in this browser only. Export a backup before clearing your browser data, and use the export to publish your edits for all visitors (paste it into <code className="text-primary">DEFAULTS</code> in <code className="text-primary">src/store.tsx</code>).
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={exportJson} className={btnGhost}><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => importRef.current?.click()} className={btnGhost}><Upload className="w-4 h-4" /> Import</button>
          <input ref={importRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => { importJson(e.target.files?.[0]); e.target.value = ''; }} />
          <button onClick={() => { if (window.confirm('Reset everything to the built-in defaults? All dashboard edits will be removed.')) { reset(); flash('Reset to defaults.'); } }}
            className={`${btn} bg-[#212121] text-red-300 hover:bg-red-400 hover:text-black`}>Reset to defaults</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- dashboard shell ---------------- */
type Tab = CollectionKey | 'site';

export function Admin() {
  const [authed, setAuthed] = useState(() => { try { return sessionStorage.getItem(SESSION) === '1'; } catch { return false; } });
  const [tab, setTab] = useState<Tab>('projects');
  const [message, setMessage] = useState('');
  const { data } = useSite();

  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'projects', label: `Portfolio · ${data.projects.length}` },
    { id: 'experience', label: `Experience · ${data.experience.length}` },
    { id: 'education', label: `Education · ${data.education.length}` },
    { id: 'clients', label: `Clients · ${data.clients.length}` },
    { id: 'site', label: 'Site & links' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="text-primary text-[10px] sm:text-xs">Admin dashboard</p>
            <h1 className="text-3xl sm:text-5xl text-[#E1E0CC] leading-none mt-2">{data.settings.siteName} <span className="font-serif italic">content.</span></h1>
          </div>
          <div className="flex gap-2">
            <a href="#/" className={btnGhost}><ArrowLeft className="w-4 h-4" /> View site</a>
            <button onClick={() => { sessionStorage.removeItem(SESSION); setAuthed(false); }} className={btnGhost}><LogOut className="w-4 h-4" /> Sign out</button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-3" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={t.id === tab} onClick={() => { setTab(t.id); setMessage(''); }}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-colors ${t.id === tab ? 'bg-primary text-black' : 'bg-[#212121] text-primary/70 hover:text-primary'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <p role="status" className="text-xs sm:text-sm text-primary min-h-[1.5rem] mb-3">{message}</p>

        {tab === 'site' ? <SiteSettings flash={setMessage} /> : <Collection key={tab} name={tab} flash={setMessage} />}
      </div>
    </div>
  );
}
