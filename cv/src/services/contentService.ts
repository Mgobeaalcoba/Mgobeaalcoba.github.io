/**
 * ContentRepository — local static data only.
 *
 * Dynamic content (experience, projects, education, certifications,
 * consulting packs and case studies) is served from Supabase via
 * src/lib/queries.ts and provided through SupabaseDataContext.
 */
import contentData from '@/data/content.json';
import type { ContentData } from '@/types/content';

const data = contentData as ContentData;

export class ContentRepository {
  static getMeta() {
    return data.meta;
  }

  static getAbout() {
    return data.about;
  }

  static getTechStack() {
    return data.techStack;
  }

  static getConsulting() {
    return data.consulting;
  }

  static getAllTags(): string[] {
    return [];
  }
}
