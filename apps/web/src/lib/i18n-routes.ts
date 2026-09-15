import type { Language } from '@/contexts/LanguageContext';

export const LOCALIZED_PREFIX = '/en';

/**
 * Routes that have a statically generated English counterpart under /en.
 * Everything else in the site keeps the single-URL runtime toggle behaviour:
 * only these routes need a locale-aware URL for SEO.
 */
const ENGLISH_ROUTE_PATTERNS: RegExp[] = [
  /^\/servicios\/$/,
  /^\/servicios\/[^/]+\/$/,
  /^\/servicios\/gracias\/$/,
];

function withTrailingSlash(pathname: string): string {
  if (!pathname) return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/** Splits a pathname into its locale and the locale-free path. */
export function splitLocale(pathname: string): { locale: Language; pathname: string } {
  const normalized = withTrailingSlash(pathname);
  if (normalized === `${LOCALIZED_PREFIX}/`) return { locale: 'en', pathname: '/' };
  if (normalized.startsWith(`${LOCALIZED_PREFIX}/`)) {
    return { locale: 'en', pathname: normalized.slice(LOCALIZED_PREFIX.length) };
  }
  return { locale: 'es', pathname: normalized };
}

export function hasEnglishRoute(pathname: string): boolean {
  const base = splitLocale(pathname).pathname;
  return ENGLISH_ROUTE_PATTERNS.some((pattern) => pattern.test(base));
}

/**
 * Maps a pathname to its counterpart in the requested language.
 * Paths without an English route resolve to their locale-free version, so the
 * language toggle keeps working as a runtime switch outside /servicios/.
 */
export function localizePath(pathname: string, lang: Language): string {
  const base = splitLocale(pathname).pathname;
  if (lang === 'en' && hasEnglishRoute(base)) return `${LOCALIZED_PREFIX}${base}`;
  return base;
}
