'use client';

import type { CSSProperties } from 'react';
import { ArrowRight, Construction } from 'lucide-react';
import ContextBackLink from '@/components/shared/ContextBackLink';
import { openContactModal } from '@/components/shared/ContactModal';
import { useLanguage } from '@/contexts/LanguageContext';

const CONTENT = {
  es: {
    back: 'Volver a trabajos',
    status: 'Work in progress',
    eyebrow: 'Unicorn Academy / Colaboración académica',
    title: <>Trabajo <em>en curso.</em></>,
    lead: 'Estamos trabajando junto a Unicorn Academy, academia online de análisis de datos e inteligencia artificial. Los detalles del proyecto se van a publicar cuando el trabajo esté entregado.',
    asideLabel: 'Tipo de colaboración',
    asideItems: ['Diseño curricular', 'Dirección académica'],
    wipTitle: 'Próximamente, el caso completo.',
    wipBody: 'Mientras tanto, si estás pensando en rediseñar un programa de formación en datos o IA, podemos conversar sobre cómo lo encaramos.',
    cta: 'Hablemos',
  },
  en: {
    back: 'Back to work',
    status: 'Work in progress',
    eyebrow: 'Unicorn Academy / Academic collaboration',
    title: <>Work <em>in progress.</em></>,
    lead: 'We are working with Unicorn Academy, an online academy for data analysis and artificial intelligence. Project details will be published once the work is delivered.',
    asideLabel: 'Type of collaboration',
    asideItems: ['Curriculum design', 'Academic direction'],
    wipTitle: 'The full case study is coming soon.',
    wipBody: 'In the meantime, if you are planning to redesign a data or AI training programme, we can talk about how we approach it.',
    cta: 'Let’s talk',
  },
};

export default function UnicornCaseStudy() {
  const { lang } = useLanguage();
  const c = CONTENT[lang];

  return (
    <div className="signal-work" style={{ '--work-accent': '#a78bfa', '--work-brand-bg': '#563c77' } as CSSProperties}>
      <section className="signal-work-hero">
        <div>
          <ContextBackLink href="/#proyectos-clientes" label={c.back} />
          <div className="signal-work-hero__brand signal-work-hero__brand--unicorn"><img src="/logos/unicorn-academy.svg" alt="Unicorn Academy" /></div>
          <span className="signal-work-wip"><Construction size={14} />{c.status}</span>
          <span className="signal-eyebrow">{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
        <aside>
          <span>{c.asideLabel}</span>
          <img className="signal-work-hero__mark" src="/logos/unicorn-academy-mark.svg" alt="" />
          {c.asideItems.map((item) => <p key={item}>{item}</p>)}
        </aside>
      </section>

      <section className="signal-offer-final">
        <span>{c.status}</span>
        <h2>{c.wipTitle}</h2>
        <p className="signal-work-final-copy">{c.wipBody}</p>
        <button type="button" className="signal-offer-button" onClick={() => openContactModal('work_unicorn')}>{c.cta}<ArrowRight size={16} /></button>
      </section>
    </div>
  );
}
