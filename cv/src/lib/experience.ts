export const CAREER_START = { year: 2019, month: 4, day: 1 } as const;

export function getCareerExperienceYears(now = new Date()): number {
  let years = now.getFullYear() - CAREER_START.year;
  const anniversaryHasPassed = now.getMonth() > CAREER_START.month
    || (now.getMonth() === CAREER_START.month && now.getDate() >= CAREER_START.day);

  if (!anniversaryHasPassed) years -= 1;
  return Math.max(0, years);
}

export function getCareerExperienceLabel(lang: 'es' | 'en', now = new Date()): string {
  const years = getCareerExperienceYears(now);
  return lang === 'es' ? `${years}+ años` : `${years}+ years`;
}
