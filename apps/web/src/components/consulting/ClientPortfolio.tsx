'use client';

import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CLIENT_SITES = [
  {
    id: 'racing',
    name: 'Racing Club',
    kind: { es: 'Propuesta interactiva · Data & GenAI', en: 'Interactive proposal · Data & GenAI' },
    description: {
      es: 'Fundación de datos, medición de ROI para sponsors con computer vision y una hoja de ruta comercial de 90 días.',
      en: 'Data foundation, computer-vision sponsorship ROI and a 90-day commercial roadmap.',
    },
    result: { es: 'Ver propuesta', en: 'View proposal' },
    url: 'https://www.mgatc.com/racing-propuesta/',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Estadio_Presidente_Per%C3%B3n_-_Avellaneda%2C_Racing_Club_venue_%282021%29_4.jpg/960px-Estadio_Presidente_Per%C3%B3n_-_Avellaneda%2C_Racing_Club_venue_%282021%29_4.jpg',
  },
  {
    id: 'neil',
    name: 'Neil Climatizadores',
    kind: { es: 'Producto digital · Industria', en: 'Digital product · Industry' },
    description: {
      es: 'Sitio institucional y catálogo técnico multilenguaje para una operación industrial orientada a distribuidores.',
      en: 'Multilingual corporate site and technical catalog for an industrial dealer-focused operation.',
    },
    result: { es: 'Visitar sitio', en: 'Visit site' },
    url: 'https://www.mgatc.com/neil-site/',
    thumbnail: '/neil-site/images/hero-aire.jpg',
  },
  {
    id: 'elportugues',
    name: 'El Portugués S.A.',
    kind: { es: 'Producto digital · Logística', en: 'Digital product · Logistics' },
    description: {
      es: 'Presencia digital para una compañía de transporte y distribución con más de 80 años de trayectoria.',
      en: 'Digital presence for a transportation and distribution company with more than 80 years of history.',
    },
    result: { es: 'Visitar sitio', en: 'Visit site' },
    url: 'https://www.mgatc.com/elportugues-site/',
    thumbnail: '/elportugues-site/logo.png',
  },
  {
    id: 'henry',
    name: 'Henry',
    kind: { es: 'Diseño curricular · AI Automation', en: 'Curriculum design · AI Automation' },
    description: {
      es: 'Rediseño de la carrera de AI Automation: de herramientas a habilidades. Pasa de 7 a 15 semanas, con un módulo nuevo de producción, un contrato de uso de IA por módulo y proyecto final con defensa ante panel.',
      en: 'Redesign of the AI Automation career, from tools to skills. It grows from 7 to 15 weeks, with a new production module, an AI use agreement per module and a capstone defended before a panel.',
    },
    result: { es: 'Ver el caso', en: 'View case study' },
    url: '/trabajos/henry/',
    thumbnail: '/logos/henry.svg',
    brand: { background: '#000000', accent: '#ffff01' },
  },
  {
    id: 'unicorn',
    name: 'Unicorn Academy',
    kind: { es: 'Colaboración académica', en: 'Academic collaboration' },
    status: 'WIP',
    description: {
      es: 'Trabajo en curso junto a una academia online de datos e IA. El caso completo se publica cuando esté entregado.',
      en: 'Ongoing work with an online data and AI academy. The full case study will be published once delivered.',
    },
    result: { es: 'Ver estado', en: 'View status' },
    url: '/trabajos/unicorn-academy/',
    thumbnail: '/logos/unicorn-academy.svg',
    brand: { background: 'linear-gradient(135deg, #563c77, #7c3aed)', accent: '#c4b5fd' },
  },
];

export default function ClientPortfolio() {
  const { lang } = useLanguage();

  return (
    <section id="proyectos-clientes" className="signal-section signal-client-work" aria-labelledby="client-work-title">
      <div className="signal-section__heading">
        <div>
          <span className="signal-eyebrow">MGA / Selected work</span>
          <h2 id="client-work-title">{lang === 'es' ? 'Propuestas y productos para explorar.' : 'Proposals and products to explore.'}</h2>
        </div>
        <p>
          {lang === 'es'
            ? 'Una selección de entregables reales: desde propuestas de transformación hasta productos digitales en producción.'
            : 'A selection of real deliverables, from transformation proposals to digital products in production.'}
        </p>
      </div>

      <div className="signal-client-grid">
        {CLIENT_SITES.map((site) => {
          const isExternal = site.url.startsWith('http');
          const brand = 'brand' in site ? site.brand : undefined;
          return (
            <a
              key={site.id}
              className="signal-client-card"
              href={site.url}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={`${site.result[lang]}: ${site.name}`}
            >
              <div
                className={`signal-client-card__media signal-client-card__media--${site.id}${brand ? ' signal-client-card__media--brand' : ''}`}
                style={brand ? ({ background: brand.background, '--brand-accent': brand.accent } as CSSProperties) : undefined}
              >
                <img src={site.thumbnail} alt="" />
                {'status' in site && site.status && <em className="signal-client-card__status">{site.status}</em>}
                <span>{site.kind[lang]}</span>
              </div>
              <div className="signal-client-card__body">
                <div><h3>{site.name}</h3><ArrowUpRight size={20} /></div>
                <p>{site.description[lang]}</p>
                <strong>{site.result[lang]}</strong>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
