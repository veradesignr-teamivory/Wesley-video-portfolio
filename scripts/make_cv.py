"""Builds the CV PDF. Edit the text below and re-run to regenerate."""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle, KeepTogether

OUT = sys.argv[1]
SITE = 'https://oversabi-studio.vercel.app'
INK = HexColor('#111111')
MUTED = HexColor('#555555')
RULE = HexColor('#C9C5B0')
ACCENT = HexColor('#6B6648')   # darkened version of the portfolio's cream, readable on white

base = dict(fontName='Helvetica', textColor=INK, alignment=TA_LEFT)
S = {
    'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=23, leading=26, textColor=INK),
    'role': ParagraphStyle('role', fontName='Helvetica', fontSize=11.5, leading=15, textColor=ACCENT),
    'contact': ParagraphStyle('contact', fontName='Helvetica', fontSize=8.8, leading=12.5, textColor=MUTED),
    'h': ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=9.2, leading=12, textColor=ACCENT, spaceBefore=9, spaceAfter=2),
    'p': ParagraphStyle('p', fontSize=9.4, leading=13.2, **base),
    'job': ParagraphStyle('job', fontSize=10.2, leading=13.5, **base),
    'li': ParagraphStyle('li', fontSize=9.3, leading=12.8, leftIndent=9, bulletIndent=0, spaceAfter=1.6, **base),
}


def link(url, text=None):
    return f'<a href="{url}" color="#111111"><u>{text or url.replace("https://", "").replace("www.", "")}</u></a>'


def section(title):
    return [Paragraph(title.upper(), S['h']), HRFlowable(width='100%', thickness=0.7, color=RULE, spaceBefore=0, spaceAfter=4)]


def bullets(items):
    return [Paragraph(t, S['li'], bulletText='•') for t in items]


story = []
story += [
    Paragraph('Wesley Tekena Junior', S['name']),
    Paragraph('Video Editor &amp; Motion Designer', S['role']),
    Spacer(1, 3),
    Paragraph(
        'Remote, available worldwide &nbsp;|&nbsp; '
        + link('mailto:veradesignr@gmail.com', 'veradesignr@gmail.com')
        + ' &nbsp;|&nbsp; WhatsApp ' + link('https://wa.me/447770208286', '+44 7770 208286'),
        S['contact']),
    Paragraph(
        'Portfolio and showreel: ' + link(SITE)
        + ' &nbsp;|&nbsp; Behance: ' + link('https://www.behance.net/tekenawestjunior'),
        S['contact']),
]

story += section('Profile')
story.append(Paragraph(
    'Video editor and motion designer who turns briefs and raw footage into clear, well-paced stories for social, '
    'advertising and brand channels. I run Oversabi Studio, where I edit promos, short-form ads and explainers and '
    'finish them myself: the grade, the captions and the motion graphics. A background in graphic design and brand '
    'work keeps typography and brand consistency tight in every format.', S['p']))

story += section('Skills')
skills = [
    ('<b>Editing and story.</b> Structure, pacing and rhythm for short-form social videos, ads, promos, pieces to camera and explainers.',
     '<b>Colour.</b> Correction and grading in DaVinci Resolve, from flat log footage to a finished look.'),
    ('<b>Platform formats.</b> Vertical 9:16 reels and 16:9 masters, cut and exported for social and YouTube.',
     '<b>Motion and animation.</b> Motion graphics, kinetic type, 2D character animation and 3D motion.'),
    ('<b>Captions and typography.</b> Subtitles, on-screen callouts and animated lower-thirds.',
     '<b>Design.</b> Social media graphics, print layout, illustration and UI design.'),
]
t = Table([[Paragraph(a, S['li'], bulletText='•'), Paragraph(b, S['li'], bulletText='•')] for a, b in skills],
          colWidths=['50%', '50%'])
t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0),
                       ('RIGHTPADDING', (0, 0), (-1, -1), 8), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 1)]))
story.append(t)
story.append(Spacer(1, 3))
story.append(Paragraph('<b>Tools:</b> DaVinci Resolve (edit, colour, Fairlight) &nbsp;·&nbsp; Blender &nbsp;·&nbsp; Toon Boom Harmony &nbsp;·&nbsp; Rive &nbsp;·&nbsp; Lottie', S['p']))

story += section('Experience')
story.append(Paragraph('<b>Founder, Video Editor &amp; Motion Designer</b> &nbsp;–&nbsp; Oversabi Studio <font color="#555555">(remote)</font>', S['job']))
story += bullets([
    'Edit promotional films, short-form ads, explainers and social content, from the brief through to final export.',
    'Handle the grade, captions and motion graphics in-house, so each project is delivered finished.',
    'Design the supporting brand assets: social media graphics, print pieces and UI screens.',
    'Clients include Jennifer Barbosa, Cyberspace and International Friends Alliance.',
])

story += section('Selected video work')
story += bullets([
    '<b>The Webcam Workshop</b> (CompanyFlix). Two-minute promo: host to camera, intercut with audience B-roll and picture-in-picture inserts.',
    '<b>Scholarstika.</b> 35-second YouTube promo for a school management platform, with an animated lower-third for each feature.',
    '<b>From Sofa to Payout</b> (LuxBet). 30-second, five-scene 2D animated explainer that follows one customer journey.',
    '<b>UGC-style ads: FlowTask, Ember &amp; Bite, Glow Routine.</b> Eight-second presenter-led ads with hooks, on-screen captions and product cutaways.',
    '<b>Rain to Gold.</b> Colour-grading piece that takes a flat log street scene to a warm golden-hour look in a single shot.',
    '<b>Depth.</b> 3D motion piece presenting web and mobile screens, closing on kinetic type.',
    '<b>Endless Revisions</b> (Oversabi Studio). Animated social promo about bringing structure to the creative process.',
    '<b>Craving Something Special?</b> Vertical 9:16 food reel with captioned beats, cut for social.',
    '<b>Product films: Marble &amp; Serum, Slow Burn.</b> Short product spots for skincare and home fragrance.',
])
story.append(Paragraph('All of the above can be watched at ' + link(SITE + '/#work', 'oversabi-studio.vercel.app') + '.', S['contact']))

story.append(KeepTogether(section('Selected design work') + bullets([
    '<b>Social media design</b> for NDI and Niger Delta Innovate: an infographic slide and a new-month post.',
    '<b>Print:</b> cover and layout for <i>Vibe It Up!</i> magazine, Issue 64 (Wellness Practitioners Alliance).',
    '<b>UI design:</b> six screens for an online learning platform, including the course catalogue, lesson view and account settings.',
])))

story.append(KeepTogether(section('Education') + [
    Paragraph('<b>B.Tech, Computer Science</b> &nbsp;–&nbsp; Federal University of Technology, Akure, Nigeria <font color="#555555">(2024)</font>', S['job']),
]))

story.append(KeepTogether(section('Languages') + [Paragraph('English', S['p'])]))

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=17 * mm, rightMargin=17 * mm, topMargin=13 * mm, bottomMargin=10 * mm,
                        title='Wesley Tekena Junior - CV', author='Wesley Tekena Junior',
                        subject='Video Editor and Motion Designer', keywords='video editor, motion designer, colour grading, animation')
doc.build(story)
print('built', OUT, 'pages:', doc.page)
