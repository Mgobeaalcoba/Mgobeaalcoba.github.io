'use client';

import { useEffect, useState } from 'react';
import PypiDashboard from './PypiDashboard';
import type { Language } from '@/contexts/LanguageContext';
import { yesterday, type Stats } from '@/lib/pypiStats';

type WorldMap = { width: number; height: number; countries: Record<string, { d: string; cx: number; cy: number; a: number }> };
// Scheduled GitHub builds refresh this artifact even when Cloudflare has not rebuilt the page.
const DAILY_SNAPSHOT = 'https://raw.githubusercontent.com/Mgobeaalcoba/Mgobeaalcoba.github.io/gh-pages/data/pypi-stats.json';

export default function PypiStatsLive({ initial, lang, worldMap }: { initial: Stats; lang: Language; worldMap: WorldMap }) {
  const [stats, setStats] = useState(initial);
  const [target, setTarget] = useState(initial.targetDate || yesterday(new Date(initial.generatedAt || '2000-01-01')));
  const t = (es: string, en: string) => lang === 'es' ? es : en;
  useEffect(() => {
    const controller = new AbortController();
    let refreshing = false;
    const refresh = async () => {
      if (refreshing) return;
      refreshing = true;
      const date = yesterday();
      setTarget(date);
      try {
        for (const source of ['/data/pypi-stats.json', DAILY_SNAPSHOT]) {
          try {
            const response = await fetch(`${source}?through=${date}`, { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20_000)]) });
            if (!response.ok) continue;
            const next = await response.json() as Stats;
            if (!Number.isFinite(Date.parse(next.generatedAt)) || !Array.isArray(next.packages) || !next.packages.length) continue;
            setStats((current) => next.generatedAt > current.generatedAt ? next : current);
          } catch {
            // Keep the last successful snapshot when either public host is unavailable.
          }
        }
      } finally {
        refreshing = false;
      }
    };
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
    void refresh();
    const timer = setInterval(() => void refresh(), 15 * 60_000);
    document.addEventListener('visibilitychange', onVisible);
    return () => { controller.abort(); clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  return <>
    <PypiDashboard stats={stats} lang={lang} worldMap={worldMap} target={target} />
    <p className="signal-pypi-fine" aria-live="polite">
      {t('Última actualización: ', 'Last refresh: ')}{stats.generatedAt ? new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(stats.generatedAt)) : '—'} UTC.
      {stats.packages.some((pkg) => pkg.stale || pkg.clickpyStale) ? ` ${t('Algunas fuentes conservan datos de la última consulta exitosa.', 'Some sources retain data from the last successful request.')}` : ''}
    </p>
  </>;
}
