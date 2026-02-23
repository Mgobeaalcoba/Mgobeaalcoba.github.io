'use client';

/**
 * SupabaseDataContext
 *
 * Fetches all Supabase-hosted data once on mount and exposes it to every
 * child component. While the fetch is in flight, the JSON fallback from
 * content.json is served so there is zero layout shift.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ContentRepository } from '@/services/contentService';
import {
  fetchExperience,
  fetchProjects,
  fetchEducation,
  fetchCertifications,
  fetchConsultingPacks,
  fetchCaseStudies,
} from '@/lib/queries';
import type {
  ExperienceItem,
  ProjectItem,
  EducationItem,
  CertificationItem,
  ConsultingPack,
  CaseStudy,
} from '@/types/content';

interface SupabaseData {
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  consultingPacks: ConsultingPack[];
  caseStudies: CaseStudy[];
  /** true while the first fetch is in progress; after that always false */
  loading: boolean;
  /** non-null if Supabase fetch failed; fallback data is still served */
  error: Error | null;
}

const fallback: SupabaseData = {
  experience: ContentRepository.getExperience(),
  projects: ContentRepository.getProjects(),
  education: ContentRepository.getEducation(),
  certifications: ContentRepository.getCertifications(),
  consultingPacks: ContentRepository.getConsulting().packs,
  caseStudies: ContentRepository.getConsulting().caseStudies,
  loading: true,
  error: null,
};

const SupabaseDataContext = createContext<SupabaseData>(fallback);

export function SupabaseDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SupabaseData>(fallback);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [experience, projects, education, certifications, consultingPacks, caseStudies] =
          await Promise.all([
            fetchExperience(),
            fetchProjects(),
            fetchEducation(),
            fetchCertifications(),
            fetchConsultingPacks(),
            fetchCaseStudies(),
          ]);

        if (!cancelled) {
          setData({
            experience,
            projects,
            education,
            certifications,
            consultingPacks,
            caseStudies,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          // Keep fallback data, mark error so devs can inspect
          console.warn('[SupabaseData] fetch failed, using local fallback:', err);
          setData((prev) => ({ ...prev, loading: false, error: err as Error }));
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <SupabaseDataContext.Provider value={data}>
      {children}
    </SupabaseDataContext.Provider>
  );
}

export function useSupabaseData(): SupabaseData {
  return useContext(SupabaseDataContext);
}
