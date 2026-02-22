'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Calendar, Github, Linkedin, Twitter, Mail, ExternalLink, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';
import { useState } from 'react';

export default function Hero() {
  const { lang, t } = useLanguage();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCV = async () => {
    if (downloading) return;
    setDownloading(true);
    events.downloadCV();
    try {
      const { generateCVPdf } = await import('@/lib/generatePdf');
      await generateCVPdf(lang as 'es' | 'en');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const stats = [
    { value: '6+', label: { es: 'Años MercadoLibre', en: 'Years MercadoLibre' } },
    { value: '30+', label: { es: 'Proyectos GitHub', en: 'GitHub Projects' } },
    { value: '400+', label: { es: 'Cursos & Certs', en: 'Courses & Certs' } },
    { value: '+500K', label: { es: 'USD Impacto Anual', en: 'USD Annual Impact' } },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-8 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">{t('hero_available')}</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight mb-4">
              <span className="text-gray-100">Mariano</span>
              <br />
              <span className="gradient-text">Gobea Alcoba</span>
            </h1>

            <p className="text-sky-400 font-semibold text-lg mb-3">
              {lang === 'es'
                ? 'Data & Analytics Technical Leader'
                : 'Data & Analytics Technical Leader'}
            </p>

            <p className="text-gray-400 text-base mb-8 max-w-lg leading-relaxed">
              {lang === 'es'
                ? 'Mercado Libre · Buenos Aires, Argentina · +6 años liderando equipos de datos e IA'
                : 'Mercado Libre · Buenos Aires, Argentina · +6 years leading data & AI teams'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/cv-site/consulting/"
                onClick={() => events.consultingClick()}
                className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <Calendar size={16} />
                {t('hero_cta_consulting')}
              </Link>
              <button
                onClick={handleDownloadCV}
                disabled={downloading}
                className="flex items-center gap-2 px-6 py-3 glass border border-sky-500/30 text-sky-400 rounded-xl font-semibold hover:bg-sky-500/10 transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-wait"
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                {downloading
                  ? (lang === 'es' ? 'Generando...' : 'Generating...')
                  : t('hero_cta_download')}
              </button>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              {[
                { href: 'https://www.linkedin.com/in/mariano-gobea-alcoba/', icon: <Linkedin size={18} />, label: 'LinkedIn' },
                { href: 'https://github.com/Mgobeaalcoba', icon: <Github size={18} />, label: 'GitHub' },
                { href: 'https://twitter.com/MGobeaAlcoba', icon: <Twitter size={18} />, label: 'Twitter' },
                { href: 'mailto:gobeamariano@gmail.com', icon: <Mail size={18} />, label: 'Email' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  onClick={() => events.socialClick(label.toLowerCase())}
                  className="glass p-2.5 rounded-lg text-gray-400 hover:text-sky-400 hover:border-sky-500/30 border border-transparent transition-all"
                  title={label}
                >
                  {icon}
                </a>
              ))}
              <Link
                href="/cv-site/consulting/"
                className="glass p-2.5 rounded-lg text-gray-400 hover:text-sky-400 border border-transparent transition-all"
                title="Consulting"
              >
                <ExternalLink size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Photo + stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Profile photo */}
            <div className="relative">
              <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-sky-500/30 glow-border">
                <Image
                  src="/cv-site/profile.png"
                  alt="Mariano Gobea Alcoba"
                  width={224}
                  height={224}
                  className="object-cover object-top"
                  priority
                />
              </div>
              {/* MercadoLibre badge */}
              <div className="absolute -bottom-2 -right-2 glass rounded-xl p-1.5 border border-yellow-500/30">
                <Image
                  src="/cv-site/meli.jpg"
                  alt="MercadoLibre"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {stats.map((stat) => (
                <div key={stat.value} className="glass rounded-xl p-4 text-center glow-border">
                  <div className="text-2xl font-black gradient-text">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label[lang]}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
