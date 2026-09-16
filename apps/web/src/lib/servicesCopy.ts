import type { Bilingual } from '@/types/content';

export interface BilingualFaqItem {
  question: Bilingual;
  answer: Bilingual;
}

/**
 * Long-form copy for the on-demand services pages. It lives here instead of the
 * LanguageContext dictionary because the server pages also need it for
 * metadata and JSON-LD, which are resolved at build time and cannot read the
 * client language state.
 */
export const SERVICES_HERO: { title: Bilingual; emphasis: Bilingual; subtitle: Bilingual } = {
  title: { es: 'Resultados concretos.', en: 'Concrete results.' },
  emphasis: { es: 'Sin proyectos abiertos.', en: 'No open-ended projects.' },
  subtitle: {
    es: 'Elegí un punto de partida con alcance, precio y entrega conocidos. Sin llamadas comerciales obligatorias antes de entender qué comprás.',
    en: 'Pick a starting point with a known scope, price and delivery. No mandatory sales calls before you understand what you are buying.',
  },
};

export const SERVICES_STEPS_LABEL: Bilingual = { es: 'Cómo funciona', en: 'How it works' };

export const SERVICES_STEPS: Bilingual[] = [
  { es: 'Elegís el servicio que resuelve tu necesidad inmediata.', en: 'You pick the service that solves your immediate need.' },
  { es: 'Coordinamos agenda y recibís un formulario de contexto.', en: 'We schedule a session and you receive a context form.' },
  { es: 'Trabajamos sobre tu caso y entregamos próximos pasos accionables.', en: 'We work on your case and deliver actionable next steps.' },
];

export const SERVICES_FAQ_LABEL: Bilingual = { es: 'Antes de comprar', en: 'Before you buy' };
export const SERVICES_FAQ_TITLE: Bilingual = { es: 'Preguntas frecuentes.', en: 'Frequently asked questions.' };

export const SERVICES_FAQ: BilingualFaqItem[] = [
  {
    question: { es: '¿Los precios son finales?', en: 'Are these prices final?' },
    answer: {
      es: 'Son precios de referencia en USD para el alcance publicado. El cobro se realiza en el medio y moneda indicados por el checkout.',
      en: 'They are reference prices in USD for the published scope. Payment is charged in the method and currency shown at checkout.',
    },
  },
  {
    question: { es: '¿Qué pasa si necesito una implementación?', en: 'What if I need an implementation?' },
    answer: {
      es: 'El diagnóstico produce un alcance y presupuesto. Si avanzamos, el valor del diagnóstico aplicable se descuenta del proyecto.',
      en: 'The diagnostic produces a scope and a budget. If we move forward, the applicable diagnostic fee is credited toward the project.',
    },
  },
  {
    question: { es: '¿Trabajás solo con empresas de Argentina?', en: 'Do you only work with companies in Argentina?' },
    answer: {
      es: 'No. Las sesiones y entregas son remotas y pueden contratarse desde cualquier país compatible con el medio de pago acordado.',
      en: 'No. Sessions and deliverables are remote and can be purchased from any country compatible with the agreed payment method.',
    },
  },
  {
    question: { es: '¿Cuándo coordinamos la sesión?', en: 'When do we schedule the session?' },
    answer: {
      es: 'Después del pago completás un onboarding breve. La coordinación se confirma dentro de las próximas 24 horas.',
      en: 'After payment you complete a short onboarding. Scheduling is confirmed within the next 24 hours.',
    },
  },
];
