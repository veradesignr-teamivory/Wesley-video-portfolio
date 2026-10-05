/* ---------------------------------------------------------------
   All text, links and media for the page live here.
   Items marked (placeholder) should be replaced with your own.
   --------------------------------------------------------------- */

// Site name, hero word, contact email, links, portfolio, experience, education and clients
// are managed from the admin dashboard — their defaults live in src/store.tsx.

export const hero = {
  // (placeholder) background footage from the design reference — swap for your showreel .mp4
  video:
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4',
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'Inquiries', href: '#clients' },
  ],
  description:
    'Every project shows my commitment to quality and my love for storytelling. I know every business has a unique story, and I am skilled at telling that story through visuals.',
  cta: { label: 'Hire me' }, // links to the contact email set in the admin dashboard
};

export const about = {
  label: 'Video editing, animation & visual design',
  portrait: '/wesley.jpg', // file lives in /public
  cv: '/Wesley-Tekena-Junior-CV.pdf', // rebuilt with: python scripts/make_cv.py public/Wesley-Tekena-Junior-CV.pdf
  portraitAlt: 'Wesley Tekena Junior holding a notebook and pen',
  heading: [
    { text: 'I am Wesley Tekena Junior,', className: 'font-normal' },
    { text: 'a brand strategist and motion designer.', className: 'italic font-serif' },
    { text: 'I have skills in color grading, animation, graphic design, and VFX.', className: 'font-normal' },
  ],
  body:
    "I run {site}, cutting commercials, music videos, brand films and creator content, and designing the motion that holds them together. My work lives where rhythm meets clarity: the cut you feel but don't notice, the title that lands on the beat, the grade that makes a frame feel expensive.",
};

export const features = {
  heading: [
    { text: 'Studio-grade post-production for brands, artists and creators.', className: 'text-[#E1E0CC]' },
    { text: 'Cut with rhythm. Finished with craft.', className: 'text-gray-500' },
  ],
  videoCard: {
    // (placeholder) footage from the design reference — swap for a clip of your own work
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4',
    caption: 'Stories that move.',
  },
  cards: [
    {
      number: '01',
      title: 'Video Editing.',
      // (placeholder) icons from the design reference
      icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
      items: [
        'Offline and online edit',
        'Multicam and interview cutdowns',
        'Trailers, promos and commercials',
        'Versioning for every platform',
      ],
    },
    {
      number: '02',
      title: 'Motion Graphics.',
      icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
      items: ['Title sequences and kinetic type', 'Logo stings and brand toolkits', 'Explainers and UI animation'],
    },
    {
      number: '03',
      title: 'Color & Sound.',
      icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
      items: ['Shot matching and look development', 'Dialogue cleanup, SFX and music edit', 'Loudness-compliant final mixes'],
    },
  ],
  // second row of service cards
  more: [
    {
      number: '04', title: 'Visual Design.', icon: 'palette', wide: true,
      items: ['Logo creation', 'Branding', 'Print design', 'Social media design', 'Book design', 'Illustration', 'UI design'],
    },
    {
      number: '05', title: '2D & 3D Animation.', icon: 'box', wide: false,
      items: ['2D character and explainer animation', '3D modelling, lighting and animation', 'Interactive and web animation'],
    },
    {
      number: '06', title: 'UGC Ads.', icon: 'phone', wide: false,
      items: ['Creator-style ads with a presenter to camera', 'Hooks, captions and product cutaways', 'Cut for TikTok, Reels and Shorts'],
    },
  ],
  learnMore: { label: 'Learn more', href: '#clients' },
};

/* ---------------------------------------------------------------
   VISUAL DESIGN: the pieces themselves are added in the admin dashboard
   --------------------------------------------------------------- */
export const visualDesign = {
  label: 'Visual design',
  heading: [
    { text: 'Brands, books and screens,', className: 'font-normal' },
    { text: 'designed to be remembered.', className: 'italic font-serif' },
  ],
  sub: 'The still side of the studio: identity, print and interface work, built with the same care as the motion.',
  cta: 'Have a design brief in mind?',
  // one line per discipline (keys match DESIGN_CATEGORIES in src/store.tsx)
  blurbs: {
    'Logo Creation': 'Marks and wordmarks that stay recognisable at any size.',
    Branding: 'Colour, type and usage rules that keep a brand consistent everywhere.',
    'Print Design': 'Flyers, posters, packaging and stationery, set up properly for press.',
    'Social Media Design': 'Templates and campaign graphics made for the feed.',
    'Book Design': 'Covers and interior layouts for print and e-book.',
    Illustration: 'Custom artwork for brands, editorial and products.',
    'UI Design': 'Clear, usable screens for websites and apps.',
  } as Record<string, string>,
};

/* ---------------------------------------------------------------
   STUDIO — interactive sections (grade comparison, timeline, tools, skills)
   --------------------------------------------------------------- */
export const studio = {
  intro: {
    badge: 'Available for freelance & recurring edits',
    heading: [
      { text: 'Turning raw footage into', className: 'font-normal' },
      { text: 'work people finish watching.', className: 'italic font-serif' },
    ],
  },

  grade: {
    label: 'Interactive color grading demo',
    heading: [
      { text: 'Raw footage versus', className: 'font-normal' },
      { text: 'the final grade.', className: 'italic font-serif' },
    ],
    sub: 'Drag the slider to compare a flat, ungraded camera profile with the finished master.',
    video: hero.video, // (placeholder) swap for a clip of your own
    // CSS filter that fakes the flat "log" look of ungraded footage
    rawFilter: 'saturate(0.35) contrast(0.72) brightness(1.12)',
    presets: [
      {
        name: 'Teal & Orange',
        filter: 'contrast(1.14) saturate(1.3)',
        tint: 'linear-gradient(135deg, rgba(0,150,160,0.35), rgba(255,140,40,0.3))',
        stats: [['Look', 'Cinematic teal & orange'], ['Space', 'Rec.709 · Gamma 2.4'], ['Skin tones', 'Protected']],
      },
      {
        name: 'Neon Night',
        filter: 'contrast(1.25) saturate(1.6) hue-rotate(-18deg)',
        tint: 'linear-gradient(135deg, rgba(120,60,255,0.4), rgba(255,40,140,0.3))',
        stats: [['Look', 'High-contrast neon'], ['Space', 'Rec.709 · Gamma 2.4'], ['Highlights', 'Bloomed, clipped late']],
      },
      {
        name: 'Warm Documentary',
        filter: 'contrast(1.06) saturate(1.1) sepia(0.22)',
        tint: 'linear-gradient(135deg, rgba(255,190,120,0.3), rgba(120,90,40,0.25))',
        stats: [['Look', 'Warm film emulation'], ['Space', 'Rec.709 · Gamma 2.4'], ['Grain', '35mm, fine']],
      },
    ],
  },

  timeline: {
    label: 'Interactive editing timeline',
    heading: [
      { text: 'How a cut is built,', className: 'font-normal' },
      { text: 'track by track.', className: 'italic font-serif' },
    ],
    sub: 'Scrub the playhead, toggle the grade and mute the sound-effects layer to see how the layers stack up.',
    video: features.videoCard.video, // (placeholder)
    duration: 24, // seconds
    lut: 'contrast(1.14) saturate(1.3)',
    flat: 'saturate(0.35) contrast(0.72) brightness(1.12)',
    tracks: [
      { id: 'V2', name: 'Motion & VFX', clips: [
        { label: 'Lens flare', start: 1, end: 5 }, { label: 'Callout titles', start: 8, end: 13 }, { label: 'Speed ramp', start: 16, end: 19.5 } ] },
      { id: 'V1', name: 'Main footage', clips: [
        { label: 'A-roll hook', start: 0, end: 6 }, { label: 'B-roll pan', start: 6, end: 12 }, { label: 'Product macro', start: 12, end: 18.5 }, { label: 'Outro & CTA', start: 18.5, end: 24 } ] },
      { id: 'A1', name: 'Voice & dialogue', clips: [{ label: 'Clean voiceover', start: 0.5, end: 22.5 }] },
      { id: 'A2', name: 'Sound FX', clips: [
        { label: 'Whoosh', start: 5.4, end: 7 }, { label: 'Glitch', start: 11.4, end: 12.8 }, { label: 'Sub impact', start: 18, end: 20.2 } ] },
    ],
    notes: ['Sub-frame cuts synced to the beat', 'Motion graphics rigged in After Effects'],
  },

  tools: {
    label: 'Tools I work with',
    heading: [
      { text: 'Every technique', className: 'font-normal' },
      { text: 'in the edit suite.', className: 'italic font-serif' },
    ],
    sub: 'A hands-on breakdown of what I use day to day, from the first assembly to the final export.',
    // edit these lists to match what you actually offer
    groups: [
      { title: 'Video Editing', items: ['Multi-track timeline editing', 'Ripple, roll, slip and slide trims', 'Proxy workflows', 'Multicam sync and switching'] },
      { title: 'Transitions & Effects', items: ['Speed ramps and retiming', 'Smooth cuts and dissolves', 'Dynamic zooms', 'Freeze frames'] },
      { title: '2D & 3D Animation', items: ['2D character animation in Toon Boom', '3D modelling and animation in Blender', 'Interactive animation in Rive', 'Lightweight web animation with Lottie'] },
      { title: 'Color Grading', items: ['Primary wheels and curves', 'Node-based grading', 'Shot matching', 'LUT design and application'] },
      { title: 'Audio', items: ['Dialogue cleanup and noise reduction', 'EQ and compression', 'Music editing to picture', 'Loudness-compliant mixes'] },
      { title: 'Titles & Graphics', items: ['Lower thirds and end screens', 'Animated captions', 'Title sequences', 'Credit rolls'] },
      { title: 'Media Management', items: ['Ingest and bin organisation', 'Markers and review notes', 'Relinking and conform', 'Archive and delivery specs'] },
    ],
  },

  skills: {
    label: 'Proficiency',
    // (placeholder percentages — set your own)
    items: [
      { name: 'Adobe Premiere Pro', value: 95 },
      { name: 'Adobe After Effects', value: 95 },
      { name: 'DaVinci Resolve (Color & Fairlight)', value: 90 },
      { name: 'Blender', value: 85 },
      { name: 'Toon Boom Harmony', value: 85 },
      { name: 'Rive', value: 80 },
      { name: 'Lottie', value: 80 },
    ],
  },
};
