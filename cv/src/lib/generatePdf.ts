import { jsPDF } from 'jspdf';
import { ContentRepository } from '@/services/contentService';

const MARGIN = 18;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  primary: '#0ea5e9',
  heading: '#1f2937',
  body: '#374151',
  muted: '#6b7280',
};

const FONT_SIZES = {
  h1: 22,
  h2: 16,
  h3: 12,
  body: 10,
  small: 9,
};

type Lang = 'es' | 'en';

class PdfBuilder {
  doc: jsPDF;
  yPos: number;
  lang: Lang;

  constructor(lang: Lang) {
    this.doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    this.yPos = MARGIN;
    this.lang = lang;
    this.doc.setFont('helvetica', 'normal');
  }

  getLineHeight(fontSize: number): number {
    return (fontSize * 0.352778) * 1.4;
  }

  checkPageBreak(required: number) {
    if (this.yPos + required > PAGE_HEIGHT - MARGIN) {
      this.doc.addPage();
      this.yPos = MARGIN;
    }
  }

  addSectionTitle(title: string) {
    const h = this.getLineHeight(FONT_SIZES.h2);
    this.checkPageBreak(h + 8);
    this.doc
      .setFont('helvetica', 'bold')
      .setFontSize(FONT_SIZES.h2)
      .setTextColor(COLORS.heading);
    this.doc.text(title, MARGIN, this.yPos + h / 2);
    this.yPos += h + 1;
    this.doc
      .setDrawColor(COLORS.primary)
      .setLineWidth(0.5)
      .line(MARGIN, this.yPos, MARGIN + CONTENT_WIDTH, this.yPos);
    this.yPos += 5;
  }

  addText(
    text: string,
    options: {
      fontSize?: number;
      color?: string;
      fontStyle?: 'normal' | 'bold' | 'italic';
      indent?: number;
    } = {}
  ) {
    const {
      fontSize = FONT_SIZES.body,
      color = COLORS.body,
      fontStyle = 'normal',
      indent = 0,
    } = options;
    this.doc.setFont('helvetica', fontStyle).setFontSize(fontSize).setTextColor(color);
    const lines = this.doc.splitTextToSize(text, CONTENT_WIDTH - indent);
    const lineH = this.getLineHeight(fontSize);
    const total = lines.length * lineH;
    this.checkPageBreak(total);
    this.doc.text(lines, MARGIN + indent, this.yPos);
    this.yPos += total;
  }
}

async function loadImageBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateCVPdf(lang: Lang = 'es'): Promise<void> {
  const builder = new PdfBuilder(lang);
  const { doc } = builder;

  const meta = ContentRepository.getMeta();
  const about = ContentRepository.getAbout();
  const experience = ContentRepository.getExperience();
  const education = ContentRepository.getEducation();
  const projects = ContentRepository.getProjects().slice(0, 6);
  const certs = ContentRepository.getCertifications();

  // --- Header ---
  const profileImg = await loadImageBase64('/cv-site/profile.png');
  const imgSize = 35;

  if (profileImg) {
    doc.addImage(profileImg, 'PNG', MARGIN, builder.yPos, imgSize, imgSize, 'profile', 'FAST');
  }

  const textX = MARGIN + imgSize + 10;
  doc
    .setFont('helvetica', 'bold')
    .setFontSize(FONT_SIZES.h1)
    .setTextColor(COLORS.heading);
  doc.text(meta.name, textX, builder.yPos + imgSize / 2 - 2);

  doc
    .setFont('helvetica', 'normal')
    .setFontSize(FONT_SIZES.h2)
    .setTextColor(COLORS.primary);
  doc.text(meta.title[lang], textX, builder.yPos + imgSize / 2 + 6);

  builder.yPos += imgSize + 10;

  // --- About ---
  builder.addSectionTitle(lang === 'es' ? 'Sobre mí' : 'About Me');
  builder.addText(about.text[lang]);
  builder.yPos += 5;

  // --- Contact ---
  builder.addSectionTitle(lang === 'es' ? 'Contacto' : 'Contact');
  builder.addText(
    `${meta.location}  •  ${meta.phone}  •  ${meta.email}  •  ${meta.linkedin}  •  ${meta.github}`
  );
  builder.yPos += 5;

  // --- Experience ---
  builder.addSectionTitle(lang === 'es' ? 'Experiencia Profesional' : 'Professional Experience');
  for (const job of experience) {
    const plain = job.description[lang]
      .replace(/<li>/g, '• ')
      .replace(/<\/li>|<ul>|<\/ul>/g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l)
      .join('\n');

    const titleH = builder.getLineHeight(FONT_SIZES.h3);
    const subH = builder.getLineHeight(FONT_SIZES.body);
    const descLines = doc
      .setFontSize(FONT_SIZES.body)
      .splitTextToSize(plain, CONTENT_WIDTH - 5);
    const descH = descLines.length * builder.getLineHeight(FONT_SIZES.body);

    builder.checkPageBreak(titleH + subH + descH + 8);
    builder.addText(job.title[lang], { fontSize: FONT_SIZES.h3, fontStyle: 'bold', color: COLORS.body });
    builder.yPos += 0.5;
    builder.addText(`${job.company}  |  ${job.date[lang]}`, { color: COLORS.muted });
    builder.yPos += 2;
    builder.addText(plain, { indent: 5 });
    builder.yPos += 6;
  }

  // --- Education ---
  builder.addSectionTitle(lang === 'es' ? 'Educación' : 'Education');
  for (const edu of education) {
    builder.checkPageBreak(20);
    builder.addText(edu.title[lang], { fontSize: FONT_SIZES.h3, fontStyle: 'bold', color: COLORS.body });
    builder.yPos += 0.5;
    builder.addText(edu.school, { color: COLORS.muted });
    builder.yPos += 0.5;
    builder.addText(edu.date, { fontSize: FONT_SIZES.small, fontStyle: 'italic', color: COLORS.muted });
    builder.yPos += 6;
  }

  // --- Certifications ---
  if (certs.length > 0) {
    builder.addSectionTitle(lang === 'es' ? 'Certificaciones' : 'Certifications');
    const certNames = certs.map((c: { name: string }) => c.name).join('  •  ');
    builder.addText(certNames, { fontSize: FONT_SIZES.small, color: COLORS.muted });
    builder.yPos += 5;
  }

  // --- Projects ---
  builder.addSectionTitle(lang === 'es' ? 'Proyectos Destacados' : 'Featured Projects');
  for (const proj of projects) {
    builder.checkPageBreak(25);
    builder.addText(proj.title[lang], { fontSize: FONT_SIZES.h3, fontStyle: 'bold', color: COLORS.body });
    builder.yPos += 1;
    builder.addText(proj.description[lang]);
    builder.yPos += 1;
    doc
      .setFont('helvetica', 'normal')
      .setFontSize(FONT_SIZES.small)
      .setTextColor(COLORS.primary);
    doc.textWithLink(lang === 'es' ? 'Ver Repositorio' : 'View Repository', MARGIN, builder.yPos, {
      url: proj.link,
    });
    builder.yPos += builder.getLineHeight(FONT_SIZES.small) + 6;
  }

  doc.save('CV-MarianoGobeaAlcoba.pdf');
}
