import type { Language } from '@/contexts/LanguageContext';

export const DEFAULT_LOCALE: Language = 'es';
export const LOCALIZED_PREFIX = '/en';
export const LOCALIZED_LANGUAGE = 'en';

/**
 * Registry of locale-free paths that have an English counterpart under /en.
 *
 * This is the only place to edit when a page gains a localized route: add the
 * pattern here, create the page under `app/en/...`, and every consumer (nav,
 * footer, command palette, language toggle, metadata helper) picks it up.
 *
 * A path is added only when its content genuinely exists in both languages.
 * Pages whose content source is Spanish-only (blog articles, Argentina tax and
 * salary tools, the privacy policy) stay on the runtime toggle with one URL.
 */
export const LOCALIZED_ROUTE_PATTERNS: RegExp[] = [
  /^\/$/,
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
  return { locale: DEFAULT_LOCALE, pathname: normalized };
}

/** True when the locale-free path has a generated English route. */
export function hasEnglishRoute(pathname: string): boolean {
  const base = splitLocale(pathname).pathname;
  return LOCALIZED_ROUTE_PATTERNS.some((pattern) => pattern.test(base));
}

/**
 * Maps a pathname to its counterpart in the requested language.
 * Paths without an English route resolve to their locale-free version, so the
 * language toggle keeps working as a runtime switch outside the localized set.
 */
export function localizePath(pathname: string, lang: Language): string {
  const base = splitLocale(pathname).pathname;
  if (lang === LOCALIZED_LANGUAGE && hasEnglishRoute(base)) return `${LOCALIZED_PREFIX}${base}`;
  return base;
}
