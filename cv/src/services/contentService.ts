import contentData from '@/data/content.json';
import type { ContentData, ExperienceItem, ProjectItem } from '@/types/content';

const data = contentData as ContentData;

export class ContentRepository {
  static getMeta() {
    return data.meta;
  }

  static getAbout() {
    return data.about;
  }

  static getExperience(): ExperienceItem[] {
    return data.experience;
  }

  static getProjects(): ProjectItem[] {
    return data.projects;
  }

  static getProjectsByTag(tag: string): ProjectItem[] {
    return data.projects.filter((p) => p.tags.includes(tag));
  }

  static getEducation() {
    return data.education;
  }

  static getCertifications() {
    return data.certifications;
  }

  static getTechStack() {
    return data.techStack;
  }

  static getConsulting() {
    return data.consulting;
  }

  static getAllTags(): string[] {
    const tags = new Set<string>();
    data.projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }
}
