import type { Metadata } from 'next';
import type { Language } from '@/contexts/LanguageContext';
import { DEFAULT_LOCALE, LOCALIZED_PREFIX, hasEnglishRoute } from './i18n-routes';
import { SITE_URL } from './site';

/** Builds the absolute URL for a locale-free path in the given locale. */
export function absoluteUrl(path: string, locale: Language = DEFAULT_LOCALE): string {
  const base = path.startsWith('/') ? path : `/${path}`;
  const withSlash = base.endsWith('/') ? base : `${base}/`;
  return locale === 'en' ? `${SITE_URL}${LOCALIZED_PREFIX}${withSlash}` : `${SITE_URL}${withSlash}`;
}

/**
 * Canonical plus hreflang alternates for a locale-free path.
 * Paths without an English route only get a canonical, so a page can never
 * advertise an alternate that does not exist.
 */
export function localizedAlternates(path: string, locale: Language = DEFAULT_LOCALE): NonNullable<Metadata['alternates']> {
  const canonical = absoluteUrl(path, locale);
  if (!hasEnglishRoute(path)) return { canonical };

  return {
    canonical,
    languages: {
      'es-AR': absoluteUrl(path, DEFAULT_LOCALE),
      en: absoluteUrl(path, 'en'),
      'x-default': absoluteUrl(path, DEFAULT_LOCALE),
    },
  };
}

/**
 * Metadata shared by every localized page: title, description, canonical,
 * hreflang alternates and an OpenGraph block with the matching locale.
 */
export function buildLocalizedMetadata({
  path,
  locale,
  title,
  description,
  openGraphTitle,
  openGraphDescription,
}: {
  path: string;
  locale: Language;
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: localizedAlternates(path, locale),
    openGraph: {
      locale: locale === 'en' ? 'en_US' : 'es_AR',
      url: absoluteUrl(path, locale),
      title: openGraphTitle ?? title,
      description: openGraphDescription ?? description,
    },
  };
}
