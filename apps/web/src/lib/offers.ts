import type { Bilingual } from '@/types/content';

export type OfferSlug = 'diagnostico-automatizacion' | 'mentoria-uno-a-uno' | 'auditoria-data-ia';

export interface BilingualList {
  es: string[];
  en: string[];
}

export type Offer = {
  slug: OfferSlug;
  name: Bilingual;
  shortName: Bilingual;
  category: Bilingual;
  priceUsd: number;
  duration: Bilingual;
  delivery: Bilingual;
  promise: Bilingual;
  description: Bilingual;
  audience: BilingualList;
  includes: BilingualList;
  outcome: BilingualList;
  paymentUrl?: string;
  featured?: boolean;
};

const defaultPaymentUrls: Record<OfferSlug, string> = {
  'diagnostico-automatizacion': 'https://mpago.la/1YpijTK',
  'mentoria-uno-a-uno': 'https://mpago.la/2bbynxo',
  'auditoria-data-ia': 'https://mpago.la/2ce7o3i',
};

const paymentUrls: Record<OfferSlug, string> = {
  'diagnostico-automatizacion': process.env.NEXT_PUBLIC_MP_DIAGNOSTICO_URL || defaultPaymentUrls['diagnostico-automatizacion'],
  'mentoria-uno-a-uno': process.env.NEXT_PUBLIC_MP_MENTORIA_URL || defaultPaymentUrls['mentoria-uno-a-uno'],
  'auditoria-data-ia': process.env.NEXT_PUBLIC_MP_AUDITORIA_URL || defaultPaymentUrls['auditoria-data-ia'],
};

export const OFFERS: Offer[] = [
  {
    slug: 'diagnostico-automatizacion',
    name: { es: 'Diagnóstico de Automatización', en: 'Automation Diagnostic' },
    shortName: { es: 'Diagnóstico', en: 'Diagnostic' },
    category: { es: 'Automatización', en: 'Automation' },
    priceUsd: 99,
    duration: { es: '75 minutos', en: '75 minutes' },
    delivery: { es: 'Informe en 48 h', en: 'Report in 48 h' },
    promise: {
      es: 'Encontrá el proceso correcto para automatizar antes de invertir en desarrollo.',
      en: 'Find the right process to automate before you invest in development.',
    },
    description: {
      es: 'Analizamos un proceso real, cuantificamos su costo operativo y definimos un MVP con alcance, arquitectura y retorno esperado.',
      en: 'We analyze a real process, quantify its operating cost and define an MVP with scope, architecture and expected return.',
    },
    audience: {
      es: ['PyMEs con tareas manuales repetitivas', 'Equipos que evalúan n8n, IA o integraciones', 'Líderes que necesitan priorizar una primera automatización'],
      en: ['SMBs with repetitive manual tasks', 'Teams evaluating n8n, AI or integrations', 'Leaders who need to prioritize a first automation'],
    },
    includes: {
      es: ['Sesión de relevamiento de 75 minutos', 'Mapa del proceso y sus puntos de fricción', 'Estimación de ahorro y retorno', 'Arquitectura recomendada', 'Roadmap priorizado y presupuesto orientativo'],
      en: ['75-minute discovery session', 'Process map and friction points', 'Savings and return estimate', 'Recommended architecture', 'Prioritized roadmap and indicative budget'],
    },
    outcome: {
      es: ['Una oportunidad concreta y priorizada', 'Un alcance listo para implementar', 'El precio se descuenta de una implementación posterior'],
      en: ['A concrete, prioritized opportunity', 'A scope ready to implement', 'The fee is credited toward a later implementation'],
    },
    paymentUrl: paymentUrls['diagnostico-automatizacion'],
    featured: true,
  },
  {
    slug: 'mentoria-uno-a-uno',
    name: { es: 'Mentoría Tech 1:1', en: '1:1 Tech Mentoring' },
    shortName: { es: 'Mentoría 1:1', en: '1:1 Mentoring' },
    category: { es: 'Carrera & liderazgo', en: 'Career & leadership' },
    priceUsd: 80,
    duration: { es: '60 minutos', en: '60 minutes' },
    delivery: { es: 'Plan inmediato', en: 'Immediate action plan' },
    promise: {
      es: 'Destrabá una decisión técnica o profesional con una mirada senior y práctica.',
      en: 'Unblock a technical or career decision with a senior, practical perspective.',
    },
    description: {
      es: 'Una sesión enfocada en tu desafío: arquitectura, Data Engineering, IA, entrevistas, portfolio, liderazgo o transición profesional.',
      en: 'A session focused on your challenge: architecture, Data Engineering, AI, interviews, portfolio, leadership or a career transition.',
    },
    audience: {
      es: ['Profesionales de Data, Analytics e IA', 'Personas que preparan entrevistas o promociones', 'Tech Leads ante una decisión de arquitectura'],
      en: ['Data, Analytics and AI professionals', 'People preparing for interviews or promotions', 'Tech Leads facing an architecture decision'],
    },
    includes: {
      es: ['Formulario previo para usar mejor la sesión', 'Sesión individual de 60 minutos', 'Revisión de material o arquitectura', 'Plan de acción concreto', 'Resumen y recursos recomendados'],
      en: ['Pre-session form to make the most of our time', '60-minute one-on-one session', 'Review of your material or architecture', 'Concrete action plan', 'Summary and recommended resources'],
    },
    outcome: {
      es: ['Decisión y próximos pasos claros', 'Feedback basado en experiencia real', 'Sin suscripción ni compromiso posterior'],
      en: ['A clear decision and next steps', 'Feedback grounded in real experience', 'No subscription or further commitment'],
    },
    paymentUrl: paymentUrls['mentoria-uno-a-uno'],
  },
  {
    slug: 'auditoria-data-ia',
    name: { es: 'Auditoría Data & IA', en: 'Data & AI Audit' },
    shortName: { es: 'Auditoría Data/IA', en: 'Data/AI Audit' },
    category: { es: 'Arquitectura', en: 'Architecture' },
    priceUsd: 249,
    duration: { es: '90 minutos', en: '90 minutes' },
    delivery: { es: 'Informe en 5 días', en: 'Report in 5 days' },
    promise: {
      es: 'Detectá riesgos, deuda y oportunidades antes de escalar tu plataforma de datos o IA.',
      en: 'Spot risks, debt and opportunities before scaling your data or AI platform.',
    },
    description: {
      es: 'Revisamos arquitectura, flujos, calidad, costos, observabilidad y oportunidades de IA para producir recomendaciones accionables.',
      en: 'We review architecture, pipelines, quality, costs, observability and AI opportunities to produce actionable recommendations.',
    },
    audience: {
      es: ['Startups que están escalando su stack', 'Equipos con pipelines o dashboards frágiles', 'Empresas que quieren incorporar IA con control'],
      en: ['Startups scaling their data stack', 'Teams with fragile pipelines or dashboards', 'Companies adopting AI with proper controls'],
    },
    includes: {
      es: ['Relevamiento previo y sesión de 90 minutos', 'Revisión de diagramas y decisiones actuales', 'Matriz de riesgos y oportunidades', 'Arquitectura objetivo', 'Informe ejecutivo y técnico priorizado'],
      en: ['Pre-assessment and a 90-minute session', 'Review of current diagrams and decisions', 'Risk and opportunity matrix', 'Target architecture', 'Prioritized executive and technical report'],
    },
    outcome: {
      es: ['Quick wins para los próximos 30 días', 'Roadmap de 90 días', 'Criterios claros para invertir o descartar iniciativas'],
      en: ['Quick wins for the next 30 days', 'A 90-day roadmap', 'Clear criteria to invest in or drop initiatives'],
    },
    paymentUrl: paymentUrls['auditoria-data-ia'],
  },
];

export function getOffer(slug: string): Offer | undefined {
  return OFFERS.find((offer) => offer.slug === slug);
}

export function isAllowedPaymentUrl(value?: string): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['link.mercadopago.com.ar', 'www.mercadopago.com.ar', 'mpago.la'].includes(url.hostname);
  } catch {
    return false;
  }
}
