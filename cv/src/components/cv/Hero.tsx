'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Download, Github, Linkedin, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';
import { getCareerExperienceLabel } from '@/lib/experience';

export default function Hero() {
  const { lang } = useLanguage();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCV = async () => {
    if (downloading) return;
    setDownloading(true);
    events.downloadCV();
    try {
      const { generateCVPdf } = await import('@/lib/generatePdf');
      await generateCVPdf(lang);
    } finally {
      setDownloading(false);
    }
  };

  const stats = lang === 'es'
    ? [[getCareerExperienceLabel(lang), 'Liderando Data & Analytics'], ['30+ productos', 'Proyectos y repositorios'], ['100+ certificaciones', 'Formación técnica continua'], ['USD 500K+', 'Impacto anual estimado']]
    : [[getCareerExperienceLabel(lang), 'Leading Data & Analytics'], ['30+ products', 'Projects and repositories'], ['100+ certifications', 'Continuous technical learning'], ['USD 500K+', 'Estimated annual impact']];

  return (
    <section className="signal-portfolio-hero" aria-labelledby="portfolio-title">
      <div className="signal-portfolio-hero__inner">
        <div className="signal-portfolio-hero__copy">
          <span className="signal-eyebrow">Data · Analytics · AI leadership</span>
          <h1 id="portfolio-title">Mariano<br /><em>Gobea Alcoba</em></h1>
          <p className="signal-portfolio-role">Data &amp; Analytics Technical Leader</p>
          <p className="signal-portfolio-lead">
            {lang === 'es'
              ? 'Construyo sistemas de datos, productos de IA y equipos que convierten complejidad técnica en decisiones de negocio.'
              : 'I build data systems, AI products and teams that turn technical complexity into business decisions.'}
          </p>
          <div className="signal-hero__actions">
            <Link href="/" className="signal-button signal-button--primary" onClick={() => events.consultingClick()}>
              {lang === 'es' ? 'Ver consultoría' : 'View consulting'}<ArrowRight size={17} />
            </Link>
            <button className="signal-button signal-button--secondary" onClick={handleDownloadCV} disabled={downloading}>
              {downloading ? <Loader2 className="animate-spin" size={17} /> : <Download size={17} />}
              {downloading ? (lang === 'es' ? 'Generando…' : 'Generating…') : (lang === 'es' ? 'Descargar CV' : 'Download CV')}
            </button>
          </div>
          <div className="signal-social-links" aria-label={lang === 'es' ? 'Perfiles profesionales' : 'Professional profiles'}>
            <a href="https://www.linkedin.com/in/mariano-gobea-alcoba/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} /><span>LinkedIn</span></a>
            <a href="https://github.com/Mgobeaalcoba" target="_blank" rel="noopener noreferrer"><Github size={18} /><span>GitHub</span></a>
            <a href="mailto:mariano@mgatc.com"><Mail size={18} /><span>Email</span></a>
          </div>
        </div>

        <div className="signal-portfolio-hero__evidence">
          <figure className="signal-portrait-frame">
            <div className="signal-portrait-frame__halo" />
            <div className="signal-portrait-frame__rail" aria-hidden="true"><span>01</span><span>PROFILE</span></div>
            <Image
              src="/images/profile.png"
              alt="Retrato de Mariano Gobea Alcoba"
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              priority
            />
            <figcaption className="signal-portrait-frame__caption">
              <span><strong>Mariano Gobea Alcoba</strong><small>Data &amp; Analytics</small></span>
              <span>{lang === 'es' ? 'Buenos Aires · Argentina' : 'Buenos Aires · Argentina'}</span>
            </figcaption>
          </figure>
          <div className="signal-portfolio-stats">
            {stats.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
