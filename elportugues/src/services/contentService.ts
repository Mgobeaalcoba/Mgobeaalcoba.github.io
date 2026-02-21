import content from '@/data/content.json';
import type {
  SiteContent, Hero, About, Services, History, Quality, Values,
  Contact, Footer, Brand, Meta, TransportCategory, WarehouseCategory,
  Automations, SalesProposal,
} from '@/types/content';

const typedContent = content as SiteContent;

const ContentRepository = {
  getAll: (): SiteContent => typedContent,
  getMeta: (): Meta => typedContent.meta,
  getBrand: (): Brand => typedContent.brand,
  getHero: (): Hero => typedContent.hero,
  getAbout: (): About => typedContent.about,
  getServices: (): Services => typedContent.services,
  getTransportCategory: (): TransportCategory => typedContent.services.categories[0] as TransportCategory,
  getWarehouseCategory: (): WarehouseCategory => typedContent.services.categories[1] as WarehouseCategory,
  getHistory: (): History => typedContent.history,
  getQuality: (): Quality => typedContent.quality,
  getValues: (): Values => typedContent.values,
  getContact: (): Contact => typedContent.contact,
  getFooter: (): Footer => typedContent.footer,
  getAutomations: (): Automations => typedContent.automations,
  getSalesProposal: (): SalesProposal => typedContent.salesProposal,
};

export default ContentRepository;
export type { SiteContent, Hero, About, Services, History, Quality, Values, Contact, Footer, Brand, Automations, SalesProposal };
