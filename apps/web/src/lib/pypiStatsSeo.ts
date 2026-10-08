import type { Metadata } from 'next';
import type { Language } from '@/contexts/LanguageContext';
import { buildLocalizedMetadata } from '@/lib/localizedMetadata';

export const PYPI_STATS_PATH = '/recursos/pypi-stats/';

const COPY = {
  es: {
    title: 'Mis paquetes de PyPI en números | Descargas y evolución',
    description: 'Descargas diarias, versión y actividad de GitHub de los paquetes de Python que publico en PyPI, con datos abiertos de pypistats.org y una nota honesta de qué significan las cifras.',
    ogTitle: 'Mis paquetes de PyPI, en números',
    ogDescription: 'Descargas diarias y evolución de ia-router y de mis otros paquetes de Python. Datos abiertos, actualizados a diario.',
    keywords: ['descargas pypi', 'estadísticas pypi', 'ia-router descargas', 'paquetes python open source', 'pypistats'],
  },
  en: {
    title: 'My PyPI packages in numbers | Downloads and trends',
    description: 'Daily downloads, version and GitHub activity of the Python packages I publish on PyPI, with open data from pypistats.org and an honest note on what the numbers mean.',
    ogTitle: 'My PyPI packages, in numbers',
    ogDescription: 'Daily downloads and trends for ia-router and my other Python packages. Open data, refreshed daily.',
    keywords: ['pypi downloads', 'pypi statistics', 'ia-router downloads', 'open source python packages', 'pypistats'],
  },
} as const;

export function pypiStatsMetadata(lang: Language): Metadata {
  const c = COPY[lang];
  const base = buildLocalizedMetadata({ path: PYPI_STATS_PATH, locale: lang, title: c.title, description: c.description, openGraphTitle: c.ogTitle, openGraphDescription: c.ogDescription });
  return { ...base, keywords: [...c.keywords] };
}
