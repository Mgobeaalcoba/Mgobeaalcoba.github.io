'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type ClientSite = {
  id: string;
  name: string;
  industry: { es: string; en: string };
  description: { es: string; en: string };
  deliverable: { es: string; en: string };
  tags: string[];
  url: string;
  thumbnail: string;
  logo: string;
  accentColor: string;
};

const CLIENT_SITES: ClientSite[] = [
  {
    id: 'neil',
    name: 'Neil Climatizadores',
    industry: { es: 'Climatización Industrial', en: 'Industrial Cooling' },
    description: {
      es: 'Sitio web institucional + tienda online para fabricante de climatizadores industriales evaporativos. Catálogo de productos, ficha técnica por modelo y formulario de contacto para distribuidores.',
      en: 'Institutional website + online store for an evaporative industrial cooling manufacturer. Product catalog, technical specs per model, and dealer contact form.',
    },
    deliverable: {
      es: 'Web institucional · Tienda online · Multilenguaje (6 idiomas) · Catálogo técnico',
      en: 'Institutional site · Online store · Multilingual (6 languages) · Technical catalog',
    },
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'E-commerce'],
    url: '/neil-site/',
    thumbnail: '/neil-site/images/hero-aire.jpg',
    logo: '/neil-site/images/logo-neil.png',
    accentColor: 'sky',
  },
  {
    id: 'elportugues',
    name: 'El Portugués S.A.',
    industry: { es: 'Logística & Distribución', en: 'Logistics & Distribution' },
    description: {
      es: 'Presencia digital moderna para empresa de logística con más de 80 años de trayectoria. Servicios de transporte, almacenamiento y distribución. Certificados ISO 9001:2015.',
      en: 'Modern digital presence for a logistics company with over 80 years of history. Transportation, warehousing and distribution services. ISO 9001:2015 certified.',
    },
    deliverable: {
      es: 'Web institucional · Descripción de servicios · SEO optimizado · Diseño responsivo',
      en: 'Institutional site · Service descriptions · SEO optimized · Responsive design',
    },
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'SEO'],
    url: '/elportugues-site/',
    thumbnail: '/elportugues-site/logo.png',
    logo: '/elportugues-site/logo.png',
    accentColor: 'amber',
  },
];

export default function ClientPortfolio() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="portfolio-clientes" ref={ref} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-title">
            {lang === 'es' ? 'Trabajos Realizados' : 'Portfolio of Work'}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {lang === 'es'
              ? 'Sitios web y soluciones digitales desarrolladas para clientes reales. Cada proyecto incluye diseño, desarrollo y optimización completos.'
              : 'Websites and digital solutions built for real clients. Each project includes full design, development and optimization.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CLIENT_SITES.map((site, i) => (
            <motion.a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-2xl overflow-hidden glow-border group hover:scale-[1.01] transition-transform duration-300 block"
            >
              {/* Thumbnail */}
              <div className="relative h-52 overflow-hidden bg-gray-900">
                <img
                  src={site.thumbnail}
                  alt={site.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = site.logo;
                    (e.currentTarget as HTMLImageElement).className = 'w-full h-full object-contain p-12 opacity-60';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                {/* Live badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 glass px-2.5 py-1 rounded-full text-xs font-medium text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {lang === 'es' ? 'En vivo' : 'Live'}
                </div>
                {/* Industry chip */}
                <div className="absolute bottom-3 left-3">
                  <span className="glass text-xs px-2.5 py-1 rounded-full text-gray-300 border border-white/10">
                    {site.industry[lang]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-sky-400 transition-colors">
                      {site.name}
                    </h3>
                  </div>
                  <ExternalLink size={16} className="text-gray-500 group-hover:text-sky-400 transition-colors flex-shrink-0 mt-1" />
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {site.description[lang]}
                </p>

                {/* Deliverable */}
                <div className="text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-2 mb-4 leading-relaxed">
                  {site.deliverable[lang]}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {site.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 border border-white/10 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-gray-400 text-sm">
            {lang === 'es'
              ? '¿Querés ver más o solicitar algo similar para tu empresa?'
              : 'Want to see more or request something similar for your business?'}
            {' '}
            <a href="#contacto" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
              {lang === 'es' ? 'Hablemos →' : "Let's talk →"}
            </a>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
