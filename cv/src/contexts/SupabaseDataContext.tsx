'use client';

/**
 * SupabaseDataContext
 *
 * Single fetch-on-mount for ALL Supabase-hosted data.
 * While the fetch is in flight, `loading` is true and collections are empty —
 * components should render a skeleton in that state.
 * If Supabase fails, `error` is set.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchExperience,
  fetchProjects,
  fetchEducation,
  fetchCertifications,
  fetchConsultingPacks,
  fetchCaseStudies,
  fetchCvMeta,
  fetchCvAbout,
  fetchTechStack,
  fetchConsultingMeta,
  fetchBlogPosts,
  fetchBlogCategories,
  fetchVideos,
} from '@/lib/queries';
import type {
  ExperienceItem,
  ProjectItem,
  EducationItem,
  CertificationItem,
  ConsultingPack,
  CaseStudy,
} from '@/types/content';
import type {
  CvMeta,
  CvAbout,
  TechStack,
  ConsultingMeta,
  BlogPostMeta,
  VideoItem,
} from '@/lib/queries';

interface SupabaseData {
  // Dynamic CV data
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  consultingPacks: ConsultingPack[];
  caseStudies: CaseStudy[];
  // CV static config
  cvMeta: CvMeta | null;
  cvAbout: CvAbout | null;
  techStack: TechStack;
  consultingMeta: ConsultingMeta | null;
  // Blog & Videos
  blogPosts: BlogPostMeta[];
  blogCategories: string[];
  videos: VideoItem[];
  /** true while the initial fetch is in progress */
  loading: boolean;
  /** non-null if Supabase fetch failed */
  error: Error | null;
}

const EMPTY: SupabaseData = {
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  consultingPacks: [],
  caseStudies: [],
  cvMeta: null,
  cvAbout: null,
  techStack: {},
  consultingMeta: null,
  blogPosts: [],
  blogCategories: [],
  videos: [],
  loading: true,
  error: null,
};

const SupabaseDataContext = createContext<SupabaseData>(EMPTY);

export function SupabaseDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SupabaseData>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          experience,
          projects,
          education,
          certifications,
          consultingPacks,
          caseStudies,
          cvMeta,
          cvAbout,
          techStack,
          consultingMeta,
          blogPosts,
          blogCategories,
          videos,
        ] = await Promise.all([
          fetchExperience(),
          fetchProjects(),
          fetchEducation(),
          fetchCertifications(),
          fetchConsultingPacks(),
          fetchCaseStudies(),
          fetchCvMeta(),
          fetchCvAbout(),
          fetchTechStack(),
          fetchConsultingMeta(),
          fetchBlogPosts(),
          fetchBlogCategories(),
          fetchVideos(),
        ]);

        if (!cancelled) {
          setData({
            experience,
            projects,
            education,
            certifications,
            consultingPacks,
            caseStudies,
            cvMeta,
            cvAbout,
            techStack,
            consultingMeta,
            blogPosts,
            blogCategories,
            videos,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[SupabaseData] fetch failed:', err);
          setData((prev) => ({ ...prev, loading: false, error: err as Error }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return <SupabaseDataContext.Provider value={data}>{children}</SupabaseDataContext.Provider>;
}

export function useSupabaseData(): SupabaseData {
  return useContext(SupabaseDataContext);
}
