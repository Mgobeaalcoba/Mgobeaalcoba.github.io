'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { events } from '@/lib/gtag';
import OverlayShell from '@/components/shared/OverlayShell';
import type { ExperienceItem } from '@/types/content';

// ─── Duration helpers ────────────────────────────────────────

function calcDuration(startDate: string, endDate: string | null): { years: number; months: number } {
  if (!startDate) return { years: 0, months: 0 };
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (totalMonths < 0) totalMonths = 0;
  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
}

function formatDuration(startDate: string, endDate: string | null, lang: 'es' | 'en'): string {
  const { years, months } = calcDuration(startDate, endDate);
  if (years === 0 && months === 0) return '';
  if (lang === 'es') {
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
    return parts.join(' ');
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ');
}

// ─── Employer grouping ───────────────────────────────────────

interface EmployerGroup {
  company: string;
  companyLogo: string | null;
  roles: ExperienceItem[];
  earliestStart: string;
  latestEnd: string | null;
}

function groupByEmployer(items: ExperienceItem[]): EmployerGroup[] {
  const seen = new Map<string, EmployerGroup>();
  const order: string[] = [];

  for (const item of items) {
    if (!seen.has(item.company)) {
      seen.set(item.company, {
        company: item.company,
        companyLogo: item.companyLogo,
        roles: [],
        earliestStart: item.startDate,
        latestEnd: item.endDate,
      });
      order.push(item.company);
    }
    const group = seen.get(item.company)!;
    group.roles.push(item);
    if (item.startDate && (!group.earliestStart || item.startDate < group.earliestStart)) {
      group.earliestStart = item.startDate;
    }
    // latestEnd: null means "current" — always wins
    if (item.endDate === null) {
      group.latestEnd = null;
    } else if (group.latestEnd !== null && item.endDate > group.latestEnd) {
      group.latestEnd = item.endDate;
    }
  }

  return order.map((c) => seen.get(c)!);
}

// ─── Modal ───────────────────────────────────────────────────

function ExperienceModal({ job, onClose }: { job: ExperienceItem; onClose: () => void }) {
  const { lang } = useLanguage();

  return (
    <OverlayShell
      isOpen
      onClose={onClose}
      layer={`experience-${job.id}`}
      eyebrow={job.company}
      title={job.title[lang]}
      meta={`${job.date[lang]} · ${formatDuration(job.startDate, job.endDate, lang)}`}
    >
      <div className="signal-experience-detail__intro">
        <CompanyLogo logo={job.companyLogo} company={job.company} size="md" />
        <p>{lang === 'es' ? 'Alcance, decisiones y resultados de esta etapa profesional.' : 'Scope, decisions and results from this career stage.'}</p>
      </div>
      <section className="signal-experience-detail__section">
        <span>01 / {lang === 'es' ? 'Impacto' : 'Impact'}</span>
        <div className="signal-prose" dangerouslySetInnerHTML={{ __html: job.description[lang] }} />
      </section>
      <section className="signal-experience-detail__section">
        <span>02 / Stack</span>
        <div className="signal-detail-tags">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </section>
    </OverlayShell>
  );
}

// ─── Company logo component ──────────────────────────────────

function CompanyLogo({
  logo,
  company,
  size = 'md',
}: {
  logo: string | null;
  company: string;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'w-9 h-9' : 'w-12 h-12';

  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={`${company} logo`}
        className={`${dim} rounded-lg object-contain bg-white/5 p-1 shrink-0`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div className={`${dim} rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0`}>
      <Building2 size={size === 'sm' ? 16 : 20} className="text-sky-400" />
    </div>
  );
}

// ─── Employer group card ─────────────────────────────────────

function EmployerGroupCard({
  group,
  groupIndex,
  onOpenModal,
}: {
  group: EmployerGroup;
  groupIndex: number;
  onOpenModal: (job: ExperienceItem) => void;
}) {
  const { lang } = useLanguage();
  const totalDuration = formatDuration(group.earliestStart, group.latestEnd, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
      className="signal-career-company"
    >
      {/* Employer header */}
      <div className="signal-career-company__header">
        <CompanyLogo logo={group.companyLogo} company={group.company} size="md" />
        <div className="flex-1 min-w-0">
          <h3>{group.company}</h3>
          {totalDuration && (
            <span className="text-xs text-gray-500">{totalDuration}</span>
          )}
        </div>
        <span className="signal-career-company__count">
          {group.roles.length === 1
            ? lang === 'es' ? '1 rol' : '1 role'
            : lang === 'es' ? `${group.roles.length} roles` : `${group.roles.length} roles`}
        </span>
      </div>

      {/* Roles list */}
      <div className="signal-career-roles">
        {group.roles.map((job, roleIndex) => {
          const roleDuration = formatDuration(job.startDate, job.endDate, lang);
          return (
            <motion.button
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: groupIndex * 0.1 + roleIndex * 0.05 + 0.1 }}
              onClick={() => onOpenModal(job)}
              className="signal-career-role group"
            >
              <div className="flex-1 min-w-0">
                <p className="signal-career-role__title">
                  {job.title[lang]}
                </p>
                <div className="signal-career-role__meta">
                  <span>
                    {job.date[lang]}
                  </span>
                  {roleDuration && (
                    <span className="text-xs text-gray-500">{roleDuration}</span>
                  )}
                </div>
                {job.tags.length > 0 && (
                  <div className="signal-career-role__tags">
                    {job.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 4 && (
                      <span className="text-xs text-gray-600">+{job.tags.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
              <ArrowUpRight size={18} className="signal-career-role__arrow" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────

export default function Experience() {
  const { lang, t } = useLanguage();
  const [selectedJob, setSelectedJob] = useState<ExperienceItem | null>(null);
  const { experience, loading } = useSupabaseData();

  const groups = groupByEmployer(experience);

  const openModal = (job: ExperienceItem) => {
    setSelectedJob(job);
    events.experienceOpen(job.company, job.title[lang]);
  };

  return (
    <section id="experience" data-section="experience" className="signal-portfolio-chapter signal-career-v2">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="signal-chapter-heading">
          <span className="signal-eyebrow">02 / {lang === 'es' ? 'Trayectoria' : 'Career'}</span>
          <h2>{t('experience_title')}</h2>
          <p>{lang === 'es' ? 'Una evolución de alcance: de construir soluciones a diseñar sistemas y habilitar equipos.' : 'An evolution of scope: from building solutions to designing systems and enabling teams.'}</p>
        </div>

        {loading && (
          <div className="signal-career-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/10 rounded w-40" />
                    <div className="h-3 bg-white/10 rounded w-24" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {groups.map((group, i) => (
              <EmployerGroupCard
                key={group.company}
                group={group}
                groupIndex={i}
                onOpenModal={openModal}
              />
            ))}
          </div>
        )}
      </motion.div>

      {selectedJob && <ExperienceModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </section>
  );
}
