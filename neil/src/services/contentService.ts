import contentData from '@/data/content.json';
import esTranslation from '@/data/translations/es.json';
import enTranslation from '@/data/translations/en.json';
import itTranslation from '@/data/translations/it.json';
import frTranslation from '@/data/translations/fr.json';
import ptTranslation from '@/data/translations/pt.json';
import deTranslation from '@/data/translations/de.json';
import type { ContentData, Translation, LangCode } from '@/types/content';

const content = contentData as ContentData;

const translations: Record<LangCode, Translation> = {
  es: esTranslation as Translation,
  en: enTranslation as Translation,
  it: itTranslation as Translation,
  fr: frTranslation as Translation,
  pt: ptTranslation as Translation,
  de: deTranslation as Translation,
};

const ContentRepository = {
  getMeta: () => content.meta,
  getBrand: () => content.brand,
  getFlags: () => content.flags,
  getHero: () => content.hero,
  getProducts: () => content.products,
  getProductCategories: () => content.products.categories,
  getProductCategoryById: (id: string) => content.products.categories.find(c => c.id === id),
  getPreCooling: () => content.preCooling,
  getEurope: () => content.europe,
  getContact: () => content.contact,
  getFooterLinks: () => content.footer.links,
  getAutomations: () => content.automations,
  getSalesProposal: () => content.salesProposal,
  getTranslation: (lang: LangCode): Translation => translations[lang] ?? translations.es,
  getAvailableLangs: () => content.meta.availableLangs as LangCode[],
};

export default ContentRepository;
