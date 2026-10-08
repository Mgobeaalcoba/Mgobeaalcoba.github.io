import type { Metadata } from 'next';
import type { Language } from '@/contexts/LanguageContext';
import { getIarFaq } from '@/components/recursos/IaRouterPage';
import { absoluteUrl, buildLocalizedMetadata } from '@/lib/localizedMetadata';

const PATH = '/recursos/ia-router/';
const IMAGE = 'https://www.mgatc.com/images/ia-router/ia-router-header.png';

const COPY = {
  es: {
    title: 'ia-router | Ruteá tus suscripciones de IA con métricas objetivas',
    description:
      'ia-router reparte cada tarea entre Claude, Codex y Gemini según métricas objetivas de Arena y Artificial Analysis. Open source, sin dependencias, sobre tus propios CLIs y suscripciones.',
    ogTitle: 'ia-router — tus suscripciones de IA, ruteadas con datos',
    ogDescription: 'Cada tarea al modelo que mejor rinde, según métricas objetivas. Open source.',
    imageAlt: 'Encabezado de ia-router en la terminal',
    schemaDescription: 'Router que reparte tareas entre los CLIs oficiales de IA (Claude, Codex, Antigravity) con métricas objetivas de Arena y Artificial Analysis, y conecta tus apps (Gmail, Calendar…) por MCP.',
    keywords: [
      'ia-router',
      'router de modelos de IA',
      'claude codex gemini cli',
      'métricas arena artificial analysis',
      'elegir modelo de IA por tarea',
      'cli inteligencia artificial',
      'ahorrar cuota suscripciones IA',
      'conectores MCP gmail calendar',
    ],
  },
  en: {
    title: 'ia-router | Route your AI subscriptions with objective metrics',
    description:
      'ia-router splits each task across Claude, Codex and Gemini using objective metrics from Arena and Artificial Analysis. Open source, no dependencies, on top of your own CLIs and subscriptions.',
    ogTitle: 'ia-router — your AI subscriptions, routed with data',
    ogDescription: 'Each task goes to the model that performs best, based on objective metrics. Open source.',
    imageAlt: 'The ia-router header in the terminal',
    schemaDescription: 'Router that splits tasks across the official AI CLIs (Claude, Codex, Antigravity) using objective metrics from Arena and Artificial Analysis, and connects your apps (Gmail, Calendar…) through MCP.',
    keywords: [
      'ia-router',
      'AI model router',
      'claude codex gemini cli',
      'arena artificial analysis metrics',
      'choose an AI model per task',
      'AI command line tool',
      'save AI subscription quota',
      'MCP connectors gmail calendar',
    ],
  },
} as const;

/** Metadata for the Spanish (`es`) or English (`en`) route of the ia-router page. */
export function iaRouterMetadata(lang: Language): Metadata {
  const c = COPY[lang];
  const base = buildLocalizedMetadata({ path: PATH, locale: lang, title: c.title, description: c.description, openGraphTitle: c.ogTitle, openGraphDescription: c.ogDescription });
  return {
    ...base,
    keywords: [...c.keywords],
    openGraph: { ...base.openGraph, images: [{ url: IMAGE, width: 2000, height: 926, alt: c.imageAlt }] },
  };
}

/** JSON-LD (software + FAQ) in the language of the route. */
export function iaRouterSchemas(lang: Language) {
  const c = COPY[lang];
  const url = absoluteUrl(PATH, lang);
  return {
    software: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ia-router',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'macOS, Linux, Windows (WSL 2)',
      url,
      inLanguage: lang,
      license: 'https://www.apache.org/licenses/LICENSE-2.0',
      codeRepository: 'https://github.com/Mgobeaalcoba/ia-suscription-router',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Person', name: 'Mgobeaalcoba', url: 'https://github.com/Mgobeaalcoba' },
      description: c.schemaDescription,
      image: IMAGE,
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: getIarFaq(lang).map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  };
}
