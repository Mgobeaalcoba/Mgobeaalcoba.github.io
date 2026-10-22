import type { Metadata } from 'next';
import type { Language } from '@/contexts/LanguageContext';
import { buildLocalizedMetadata } from '@/lib/localizedMetadata';

export const PYPI_STATS_PATH = '/recursos/pypi-stats/';

const COPY = {
  es: {
    title: 'Paquetes de PyPI de MGA en números | Descargas y evolución',
    description: 'Descargas diarias, versión y actividad de GitHub de los paquetes de Python que publica MGA Tech Consulting en PyPI, con datos abiertos de pypistats.org y una nota honesta de qué significan las cifras.',
    ogTitle: 'Paquetes de PyPI de MGA, en números',
    ogDescription: 'Descargas diarias y evolución de ia-router y de los otros paquetes de Python de MGA. Datos abiertos, actualizados a diario.',
    keywords: ['descargas pypi', 'estadísticas pypi', 'ia-router descargas', 'paquetes python open source', 'pypistats'],
  },
  en: {
    title: 'MGA PyPI packages in numbers | Downloads and trends',
    description: 'Daily downloads, version and GitHub activity of the Python packages MGA Tech Consulting publishes on PyPI, with open data from pypistats.org and an honest note on what the numbers mean.',
    ogTitle: 'MGA PyPI packages, in numbers',
    ogDescription: 'Daily downloads and trends for ia-router and the other MGA Python packages. Open data, refreshed daily.',
    keywords: ['pypi downloads', 'pypi statistics', 'ia-router downloads', 'open source python packages', 'pypistats'],
  },
} as const;

export function pypiStatsMetadata(lang: Language): Metadata {
  const c = COPY[lang];
  const base = buildLocalizedMetadata({ path: PYPI_STATS_PATH, locale: lang, title: c.title, description: c.description, openGraphTitle: c.ogTitle, openGraphDescription: c.ogDescription });
  return { ...base, keywords: [...c.keywords] };
}
