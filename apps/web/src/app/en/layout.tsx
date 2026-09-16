import { LanguageProvider } from '@/contexts/LanguageContext';

/**
 * English subtree. The language of the URL wins over the stored preference so
 * the statically rendered HTML, the metadata and the JSON-LD are always English
 * for /en/*, which is what hreflang and crawlers rely on. The preference is
 * persisted so the rest of the site follows the visitor into English.
 *
 * Known limitation: `<html lang>` is owned by the root layout, so the served
 * markup still declares es. The provider sets documentElement.lang on mount.
 */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider initialLang="en" authoritative>
      {children}
    </LanguageProvider>
  );
}
