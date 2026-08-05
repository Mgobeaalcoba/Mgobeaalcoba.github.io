export type OfferSlug = 'diagnostico-automatizacion' | 'mentoria-uno-a-uno' | 'auditoria-data-ia';

export type Offer = {
  slug: OfferSlug;
  name: string;
  shortName: string;
  category: string;
  priceUsd: number;
  duration: string;
  delivery: string;
  promise: string;
  description: string;
  audience: string[];
  includes: string[];
  outcome: string[];
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
    name: 'Diagnóstico de Automatización',
    shortName: 'Diagnóstico',
    category: 'Automatización',
    priceUsd: 99,
    duration: '75 minutos',
    delivery: 'Informe en 48 h',
    promise: 'Encontrá el proceso correcto para automatizar antes de invertir en desarrollo.',
    description: 'Analizamos un proceso real, cuantificamos su costo operativo y definimos un MVP con alcance, arquitectura y retorno esperado.',
    audience: ['PyMEs con tareas manuales repetitivas', 'Equipos que evalúan n8n, IA o integraciones', 'Líderes que necesitan priorizar una primera automatización'],
    includes: ['Sesión de relevamiento de 75 minutos', 'Mapa del proceso y sus puntos de fricción', 'Estimación de ahorro y retorno', 'Arquitectura recomendada', 'Roadmap priorizado y presupuesto orientativo'],
    outcome: ['Una oportunidad concreta y priorizada', 'Un alcance listo para implementar', 'El precio se descuenta de una implementación posterior'],
    paymentUrl: paymentUrls['diagnostico-automatizacion'],
    featured: true,
  },
  {
    slug: 'mentoria-uno-a-uno',
    name: 'Mentoría Tech 1:1',
    shortName: 'Mentoría 1:1',
    category: 'Carrera & liderazgo',
    priceUsd: 80,
    duration: '60 minutos',
    delivery: 'Plan inmediato',
    promise: 'Destrabá una decisión técnica o profesional con una mirada senior y práctica.',
    description: 'Una sesión enfocada en tu desafío: arquitectura, Data Engineering, IA, entrevistas, portfolio, liderazgo o transición profesional.',
    audience: ['Profesionales de Data, Analytics e IA', 'Personas que preparan entrevistas o promociones', 'Tech Leads ante una decisión de arquitectura'],
    includes: ['Formulario previo para usar mejor la sesión', 'Sesión individual de 60 minutos', 'Revisión de material o arquitectura', 'Plan de acción concreto', 'Resumen y recursos recomendados'],
    outcome: ['Decisión y próximos pasos claros', 'Feedback basado en experiencia real', 'Sin suscripción ni compromiso posterior'],
    paymentUrl: paymentUrls['mentoria-uno-a-uno'],
  },
  {
    slug: 'auditoria-data-ia',
    name: 'Auditoría Data & IA',
    shortName: 'Auditoría Data/IA',
    category: 'Arquitectura',
    priceUsd: 249,
    duration: '90 minutos',
    delivery: 'Informe en 5 días',
    promise: 'Detectá riesgos, deuda y oportunidades antes de escalar tu plataforma de datos o IA.',
    description: 'Revisamos arquitectura, flujos, calidad, costos, observabilidad y oportunidades de IA para producir recomendaciones accionables.',
    audience: ['Startups que están escalando su stack', 'Equipos con pipelines o dashboards frágiles', 'Empresas que quieren incorporar IA con control'],
    includes: ['Relevamiento previo y sesión de 90 minutos', 'Revisión de diagramas y decisiones actuales', 'Matriz de riesgos y oportunidades', 'Arquitectura objetivo', 'Informe ejecutivo y técnico priorizado'],
    outcome: ['Quick wins para los próximos 30 días', 'Roadmap de 90 días', 'Criterios claros para invertir o descartar iniciativas'],
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
