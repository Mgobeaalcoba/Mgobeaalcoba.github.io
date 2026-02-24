'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { events } from '@/lib/gtag';
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative glass rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <CompanyLogo logo={job.companyLogo} company={job.company} size="sm" />
            <div>
              <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-1 rounded-full">
                {job.date[lang]}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-100 mb-1">{job.title[lang]}</h3>
          <p className="text-sky-400 font-medium mb-1">{job.company}</p>
          {job.startDate && (
            <p className="text-xs text-gray-500 mb-4">
              {formatDuration(job.startDate, job.endDate, lang)}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-300 rounded-full border border-sky-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <ul
            className="space-y-2 text-gray-300 text-sm leading-relaxed list-none"
            dangerouslySetInnerHTML={{ __html: job.description[lang] }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  isInView,
  onOpenModal,
}: {
  group: EmployerGroup;
  groupIndex: number;
  isInView: boolean;
  onOpenModal: (job: ExperienceItem) => void;
}) {
  const { lang } = useLanguage();
  const totalDuration = formatDuration(group.earliestStart, group.latestEnd, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Employer header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <CompanyLogo logo={group.companyLogo} company={group.company} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-100 text-base truncate">{group.company}</h3>
          {totalDuration && (
            <span className="text-xs text-gray-500">{totalDuration}</span>
          )}
        </div>
        <span className="text-xs text-gray-600 shrink-0">
          {group.roles.length === 1
            ? lang === 'es' ? '1 rol' : '1 role'
            : lang === 'es' ? `${group.roles.length} roles` : `${group.roles.length} roles`}
        </span>
      </div>

      {/* Roles list */}
      <div className="divide-y divide-white/5">
        {group.roles.map((job, roleIndex) => {
          const roleDuration = formatDuration(job.startDate, job.endDate, lang);
          return (
            <motion.button
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: groupIndex * 0.1 + roleIndex * 0.05 + 0.1 }}
              onClick={() => onOpenModal(job)}
              className="w-full text-left px-6 py-4 hover:bg-white/[0.04] transition-colors group flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-200 group-hover:text-sky-400 transition-colors text-sm truncate">
                  {job.title[lang]}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-sky-400/80 bg-sky-500/10 px-2 py-0.5 rounded-full">
                    {job.date[lang]}
                  </span>
                  {roleDuration && (
                    <span className="text-xs text-gray-500">{roleDuration}</span>
                  )}
                </div>
                {job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 bg-white/5 text-gray-500 rounded">
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 4 && (
                      <span className="text-xs text-gray-600">+{job.tags.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
              <ChevronRight
                size={15}
                className="text-gray-600 group-hover:text-sky-400 transition-all group-hover:translate-x-0.5 shrink-0 mt-0.5"
              />
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedJob, setSelectedJob] = useState<ExperienceItem | null>(null);
  const { experience, loading } = useSupabaseData();

  const groups = groupByEmployer(experience);

  const openModal = (job: ExperienceItem) => {
    setSelectedJob(job);
    events.experienceOpen(job.company, job.title[lang]);
  };

  return (
    <section id="experience" data-section="experience" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('experience_title')}</h2>

        {loading && (
          <div className="space-y-4">
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
                isInView={isInView}
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
