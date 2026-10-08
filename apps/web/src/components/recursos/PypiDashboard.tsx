'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  LogarithmicScale,
  PointElement,
  Tooltip,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import type { Language } from '@/contexts/LanguageContext';
import {
  type Granularity,
  type Pkg,
  type Segment,
  type Stats,
  addDays,
  breakdown,
  buildSeries,
  calendarCells,
  cumulative,
  dailyMap,
  dateRange,
  earliestDate,
  indexed,
  kpis,
  latestDate,
  mirrorShare,
  movingAverage,
  osLabel,
  previousWindow,
  pyLabel,
  releaseImpacts,
  starsOver,
  sumOver,
  toCsv,
  totalsOf,
  weekdayTotals,
  weekStart,
} from '@/lib/pypiStats';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, LogarithmicScale, PointElement, Tooltip);

type Mode = 'bars' | 'lines' | 'cumulative' | 'share' | 'index';
type RangeKey = '7' | '30' | '90' | '180' | 'custom';
type SortKey = 'name' | 'total' | 'delta' | 'perDay' | 'stars';
type State = {
  pkgs: string[] | null;          // null = every package
  range: RangeKey;
  from: string;
  to: string;
  gran: Granularity;
  mode: Mode;
  segment: Segment;
  ma: boolean;
  log: boolean;
  releases: boolean;
};

const PALETTE = ['#22d3ee', '#a78bfa', '#fbbf24', '#34d399', '#f472b6', '#60a5fa', '#fb923c', '#94a3b8'];
const OS_COLORS: Record<string, string> = { Linux: '#fbbf24', Darwin: '#a78bfa', Windows: '#60a5fa', other: '#94a3b8', null: '#475569' };
const MODES: Mode[] = ['bars', 'lines', 'cumulative', 'share', 'index'];

const DEFAULTS: State = { pkgs: null, range: '90', from: '', to: '', gran: 'day', mode: 'bars', segment: { kind: 'all' }, ma: false, log: false, releases: true };

// ---------- chart plugin: dashed vertical lines where a release happened ----------

type Marker = { index: number; text: string; color: string };
const releasePlugin: Plugin = {
  id: 'releaseMarkers',
  afterDatasetsDraw(chart, _args, options) {
    const markers = (options as unknown as { markers?: Marker[] })?.markers;
    const x = chart.scales.x;
    if (!markers?.length || !x) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    markers.forEach((marker, order) => {
      const px = x.getPixelForValue(marker.index);
      if (px < chartArea.left || px > chartArea.right) return;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = marker.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, chartArea.top);
      ctx.lineTo(px, chartArea.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = marker.color;
      ctx.font = '10px ui-monospace, monospace';
      ctx.textAlign = px > chartArea.right - 90 ? 'right' : 'left';
      ctx.fillText(marker.text, px + (ctx.textAlign === 'left' ? 4 : -4), chartArea.top + 11 + (order % 3) * 12);
    });
    ctx.restore();
  },
};

// ---------- theme: the charts follow the site's light and dark mode ----------

type Theme = { text: string; muted: string; grid: string; surface: string };
const DARK: Theme = { text: '#e6edf7', muted: '#94a3b8', grid: 'rgba(148,163,184,.16)', surface: '#0d1424' };

function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(DARK);
  useEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement);
      const pick = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
      const light = document.documentElement.classList.contains('light-mode');
      setTheme({
        text: pick('--signal-text', DARK.text),
        muted: pick('--signal-muted', DARK.muted),
        grid: light ? 'rgba(15,23,42,.12)' : DARK.grid,
        surface: pick('--signal-surface', DARK.surface),
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

// ---------- small helpers ----------

const pct = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`;
const segmentKey = (segment: Segment) => (segment.kind === 'all' ? 'all' : `${segment.kind}:${segment.value}`);
const parseSegment = (raw: string | null): Segment => {
  if (raw?.startsWith('os:')) return { kind: 'os', value: raw.slice(3) };
  if (raw?.startsWith('py:')) return { kind: 'py', value: raw.slice(3) };
  return { kind: 'all' };
};

function readUrl(first: string, latest: string): Partial<State> {
  const params = new URLSearchParams(window.location.search);
  const out: Partial<State> = {};
  const pkgs = params.get('pkgs');
  if (pkgs) out.pkgs = pkgs.split(',').filter(Boolean);
  const range = params.get('range') as RangeKey | null;
  if (range && ['7', '30', '90', '180', 'custom'].includes(range)) out.range = range;
  const from = params.get('from');
  const to = params.get('to');
  if (from && to && from >= first && to <= latest && from <= to) Object.assign(out, { from, to });
  const gran = params.get('gran') as Granularity | null;
  if (gran && ['day', 'week', 'month'].includes(gran)) out.gran = gran;
  const mode = params.get('mode') as Mode | null;
  if (mode && MODES.includes(mode)) out.mode = mode;
  if (params.get('seg')) out.segment = parseSegment(params.get('seg'));
  if (params.has('ma')) out.ma = params.get('ma') === '1';
  if (params.has('log')) out.log = params.get('log') === '1';
  if (params.has('rel')) out.releases = params.get('rel') !== '0';
  return out;
}

function writeUrl(state: State, all: string[]) {
  const params = new URLSearchParams();
  if (state.pkgs && state.pkgs.length !== all.length) params.set('pkgs', state.pkgs.join(','));
  if (state.range !== DEFAULTS.range) params.set('range', state.range);
  if (state.range === 'custom') {
    params.set('from', state.from);
    params.set('to', state.to);
  }
  if (state.gran !== DEFAULTS.gran) params.set('gran', state.gran);
  if (state.mode !== DEFAULTS.mode) params.set('mode', state.mode);
  if (state.segment.kind !== 'all') params.set('seg', segmentKey(state.segment));
  if (state.ma) params.set('ma', '1');
  if (state.log) params.set('log', '1');
  if (!state.releases) params.set('rel', '0');
  const query = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
}

// ---------- the dashboard ----------

export default function PypiDashboard({ stats, lang }: { stats: Stats; lang: Language }) {
  const t = <T,>(es: T, en: T): T => (lang === 'es' ? es : en);
  const locale = lang === 'es' ? 'es-AR' : 'en-US';
  const theme = useTheme();
  const all = useMemo(() => [...stats.packages].sort((a, b) => b.recent.month - a.recent.month), [stats.packages]);
  const colorOf = useMemo(() => new Map(all.map((pkg, index) => [pkg.name, PALETTE[index % PALETTE.length]])), [all]);
  const latest = useMemo(() => latestDate(all), [all]);
  const first = useMemo(() => earliestDate(all), [all]);

  const [state, setState] = useState<State>(DEFAULTS);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'total', dir: -1 });
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);
  const patch = useCallback((change: Partial<State>) => setState((current) => ({ ...current, ...change })), []);

  useEffect(() => {
    setState((current) => ({ ...current, ...readUrl(first, latest) }));
    setReady(true);
  }, [first, latest]);
  useEffect(() => {
    if (ready) writeUrl(state, all.map((pkg) => pkg.name));
  }, [state, ready, all]);

  const fmt = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const compact = useMemo(() => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }), [locale]);
  const shortDate = useMemo(() => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }), [locale]);
  const longDate = useMemo(() => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }), [locale]);
  const monthDate = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }), [locale]);
  const dateLabel = useCallback((date: string) => shortDate.format(new Date(`${date}T00:00:00Z`)), [shortDate]);
  const bucketLabel = useCallback((key: string) => (state.gran === 'month' ? monthDate.format(new Date(`${key}T00:00:00Z`)) : state.gran === 'week' ? `${dateLabel(key)} →` : dateLabel(key)), [state.gran, monthDate, dateLabel]);

  // --- selection and window ---
  const selected: Pkg[] = useMemo(() => all.filter((pkg) => !state.pkgs || state.pkgs.includes(pkg.name)), [all, state.pkgs]);
  const windowRange = useMemo(() => {
    if (state.range === 'custom' && state.from && state.to) return { from: state.from, to: state.to };
    const days = Number(state.range === 'custom' ? 90 : state.range);
    const from = addDays(latest, -(days - 1));
    return { from: from < first ? first : from, to: latest };
  }, [state.range, state.from, state.to, latest, first]);
  const segmentLabel = state.segment.kind === 'all' ? t('Todas las descargas', 'All downloads') : state.segment.kind === 'os' ? `${t('Sistema', 'OS')}: ${osLabel(state.segment.value)}` : `Python ${pyLabel(state.segment.value)}`;

  const k = useMemo(() => kpis(selected, state.segment, windowRange, first), [selected, state.segment, windowRange, first]);
  const series = useMemo(() => buildSeries(selected, state.segment, windowRange.from, windowRange.to, state.gran), [selected, state.segment, windowRange, state.gran]);
  const totalsByPkg = useMemo(() => selected.map((pkg) => ({ pkg, total: sumOver(dailyMap(pkg, state.segment), windowRange.from, windowRange.to) })), [selected, state.segment, windowRange]);

  const toggle = (name: string) => {
    const current = state.pkgs ?? all.map((pkg) => pkg.name);
    const next = current.includes(name) ? current.filter((item) => item !== name) : [...current, name];
    patch({ pkgs: next.length ? next : current });
  };
  const solo = (name: string) => patch({ pkgs: [name] });
  const isSolo = state.pkgs?.length === 1;
  const reset = () => setState(DEFAULTS);
  const showAll = () => patch({ pkgs: null });

  // --- chart options shared by every chart ---
  const axisBase = useCallback(
    (extra: Record<string, unknown> = {}) => ({ ticks: { color: theme.muted, font: { size: 11 } }, grid: { color: theme.grid }, border: { color: theme.grid }, ...extra }),
    [theme],
  );
  const baseOptions = useCallback(
    <T extends 'bar' | 'line' | 'doughnut'>(extra: Record<string, unknown> = {}): ChartOptions<T> =>
      ({
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: theme.surface, titleColor: theme.text, bodyColor: theme.text, borderColor: theme.grid, borderWidth: 1, padding: 10 } },
        ...extra,
      }) as unknown as ChartOptions<T>,
    [theme],
  );

  // --- main chart ---
  const main = useMemo(() => {
    const labels = series.labels.map(bucketLabel);
    const names = selected.map((pkg) => pkg.name);
    const color = (name: string) => colorOf.get(name) ?? '#94a3b8';
    const windowSize = 7;
    let datasets: Record<string, unknown>[] = [];
    if (state.mode === 'bars') {
      datasets = names.map((name) => ({ label: name, data: series.values[name], backgroundColor: color(name), borderRadius: 2, stack: 'a', order: 2 }));
      if (state.ma && state.gran === 'day') {
        datasets.push({ type: 'line', label: t('Promedio 7 días', '7-day average'), data: movingAverage(totalsOf(series), windowSize), borderColor: theme.text, backgroundColor: theme.text, borderWidth: 2, pointRadius: 0, tension: 0.3, order: 1 });
      }
    } else if (state.mode === 'share') {
      const totals = totalsOf(series);
      datasets = names.map((name) => ({ label: name, data: series.values[name].map((value, index) => (totals[index] ? (value / totals[index]) * 100 : 0)), backgroundColor: color(name), stack: 'a' }));
    } else {
      datasets = names.map((name) => {
        let data = series.values[name];
        if (state.mode === 'cumulative') data = cumulative(data);
        else if (state.mode === 'index') data = indexed(data);
        if (state.ma && state.gran === 'day' && state.mode !== 'cumulative') data = movingAverage(data, windowSize);
        return { label: name, data, borderColor: color(name), backgroundColor: `${color(name)}22`, borderWidth: 2, pointRadius: data.length > 60 ? 0 : 2, tension: 0.25, fill: false, spanGaps: true };
      });
    }
    // Releases on the same bucket of the same package are drawn as one marker ("pkg v0.3.0 +2"), so the labels never pile up.
    const grouped = new Map<string, { pkg: string; index: number; versions: string[] }>();
    if (state.releases) {
      for (const pkg of selected) {
        if (!Array.isArray(pkg.releases)) continue;
        for (const release of pkg.releases) {
          if (release.date < windowRange.from || release.date > windowRange.to) continue;
          const key = state.gran === 'month' ? `${release.date.slice(0, 7)}-01` : state.gran === 'week' ? weekStart(release.date) : release.date;
          const index = series.keys.indexOf(key);
          if (index < 0) continue;
          const id = `${pkg.name}|${index}`;
          const entry = grouped.get(id) ?? { pkg: pkg.name, index, versions: [] };
          entry.versions.push(release.version);
          grouped.set(id, entry);
        }
      }
    }
    const markers: Marker[] = Array.from(grouped.values()).sort((a, b) => a.index - b.index).map((entry) => ({
      index: entry.index,
      text: `${entry.pkg} v${entry.versions[entry.versions.length - 1]}${entry.versions.length > 1 ? ` +${entry.versions.length - 1}` : ''}`,
      color: color(entry.pkg),
    }));
    return { labels, datasets, markers: markers.slice(0, 14) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, selected, state.mode, state.ma, state.gran, state.releases, windowRange, theme, bucketLabel, colorOf, lang]);

  const mainOptions = useMemo(() => {
    const stacked = state.mode === 'bars' || state.mode === 'share';
    const yTitle = state.mode === 'share' ? '%' : state.mode === 'index' ? t('% del pico de cada paquete', '% of each package peak') : '';
    return baseOptions<'bar'>({
      scales: {
        x: axisBase({ stacked, grid: { display: false }, ticks: { color: theme.muted, maxRotation: 0, autoSkip: true, maxTicksLimit: 10, font: { size: 11 } } }),
        y: axisBase({ stacked, beginAtZero: true, type: state.log && !stacked ? 'logarithmic' : 'linear', max: state.mode === 'share' ? 100 : undefined, title: { display: !!yTitle, text: yTitle, color: theme.muted } }),
      },
      plugins: {
        legend: { display: true, position: 'bottom', labels: { color: theme.text, boxWidth: 10, boxHeight: 10, usePointStyle: true } },
        tooltip: {
          backgroundColor: theme.surface, titleColor: theme.text, bodyColor: theme.text, borderColor: theme.grid, borderWidth: 1, padding: 10,
          callbacks: {
            label: (item: { dataset: { label?: string }; parsed: { y: number } }) => `${item.dataset.label}: ${state.mode === 'share' || state.mode === 'index' ? `${item.parsed.y.toFixed(1)}%` : fmt.format(Math.round(item.parsed.y * 10) / 10)}`,
            footer: (items: { parsed: { y: number }; dataset: { type?: string } }[]) => (state.mode === 'bars' ? `${t('Total', 'Total')}: ${fmt.format(items.filter((item) => item.dataset.type !== 'line').reduce((sum, item) => sum + item.parsed.y, 0))}` : ''),
          },
        },
        releaseMarkers: { markers: main.markers },
      },
    });
  }, [state.mode, state.log, theme, baseOptions, axisBase, main.markers, fmt, lang]);

  // --- share and ranking ---
  const sharePie = useMemo(() => ({
    labels: totalsByPkg.map(({ pkg }) => pkg.name),
    datasets: [{ data: totalsByPkg.map(({ total }) => total), backgroundColor: totalsByPkg.map(({ pkg }) => colorOf.get(pkg.name) ?? '#94a3b8'), borderColor: theme.surface, borderWidth: 2 }],
  }), [totalsByPkg, colorOf, theme.surface]);
  const grandTotal = totalsByPkg.reduce((sum, row) => sum + row.total, 0);

  // --- weekday pattern and heatmap ---
  const weekdays = useMemo(() => weekdayTotals(selected, state.segment, windowRange), [selected, state.segment, windowRange]);
  const weekdayNames = t(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const weekdaySum = weekdays.reduce((sum, value) => sum + value, 0);
  const weekendShare = weekdaySum ? (weekdays[5] + weekdays[6]) / weekdaySum : 0;
  const heat = useMemo(() => calendarCells(selected, state.segment, windowRange), [selected, state.segment, windowRange]);
  const heatMax = Math.max(1, ...heat.flat().map((cell) => cell.value));

  // --- who installs: OS and Python ---
  const perPkgOs = useMemo(() => selected.map((pkg) => ({ pkg, data: breakdown([pkg], 'system', windowRange) })), [selected, windowRange]);
  const osCategories = useMemo(() => {
    const totals: Record<string, number> = {};
    perPkgOs.forEach(({ data }) => Object.entries(data).forEach(([key, value]) => (totals[key] = (totals[key] ?? 0) + value)));
    return Object.keys(totals).filter((key) => totals[key] > 0).sort((a, b) => totals[b] - totals[a]);
  }, [perPkgOs]);
  const osTotals = useMemo(() => breakdown(selected, 'system', windowRange), [selected, windowRange]);
  const pyTotals = useMemo(() => breakdown(selected, 'python', windowRange), [selected, windowRange]);
  const pyList = Object.entries(pyTotals).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const osSum = Object.values(osTotals).reduce((sum, value) => sum + value, 0);
  const knownOs = osSum - (osTotals.null ?? 0);

  // --- mirrors ---
  const mirrors = useMemo(() => selected.map((pkg) => ({ pkg, ...mirrorShare(pkg, windowRange) })), [selected, windowRange]);

  // --- releases ---
  const impacts = useMemo(() => releaseImpacts(selected, latest).filter((row) => row.date >= addDays(windowRange.from, -7)).slice(0, 14), [selected, latest, windowRange]);

  // --- github ---
  const starDates = useMemo(() => {
    const starts = selected.map((pkg) => pkg.github?.createdAt).filter(Boolean) as string[];
    const from = starts.length ? starts.sort()[0] : addDays(latest, -180);
    return dateRange(weekStart(from), latest).filter((_, index) => index % 7 === 0);
  }, [selected, latest]);
  const hasCommits = selected.some((pkg) => pkg.github?.commits?.length);
  const commitWeeks = useMemo(() => dateRange(addDays(weekStart(latest), -7 * 51), weekStart(latest)).filter((_, index) => index % 7 === 0), [latest]);

  // --- table ---
  const rows = useMemo(() => {
    const prev = previousWindow(windowRange);
    const data = selected
      .filter((pkg) => pkg.name.includes(query.trim().toLowerCase()))
      .map((pkg) => {
        const map = dailyMap(pkg, state.segment);
        const total = sumOver(map, windowRange.from, windowRange.to);
        const before = sumOver(map, prev.from, prev.to);
        const days = dateRange(windowRange.from, windowRange.to).length;
        return { pkg, total, delta: before ? (total - before) / before : null, perDay: total / days, stars: pkg.github?.stars ?? 0 };
      });
    const value = (row: (typeof data)[number]) => (sort.key === 'name' ? row.pkg.name : sort.key === 'delta' ? row.delta ?? -Infinity : row[sort.key]);
    return data.sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }, [selected, query, windowRange, state.segment, sort]);

  // --- insights ---
  const insights = useMemo(() => {
    const list: string[] = [];
    if (k.delta !== null && k.previousCovered) {
      list.push(t(`En los ${k.days} días elegidos hubo ${fmt.format(k.total)} descargas, ${pct(Math.abs(k.delta))} ${k.delta >= 0 ? 'más' : 'menos'} que en los ${k.days} anteriores (${fmt.format(k.previous)}).`,
        `In the ${k.days} selected days there were ${fmt.format(k.total)} downloads, ${pct(Math.abs(k.delta))} ${k.delta >= 0 ? 'more' : 'fewer'} than in the previous ${k.days} (${fmt.format(k.previous)}).`));
    } else {
      list.push(t(`En los ${k.days} días elegidos hubo ${fmt.format(k.total)} descargas. Todavía no hay historia suficiente para compararlas con el período anterior.`, `In the ${k.days} selected days there were ${fmt.format(k.total)} downloads. There is not enough history yet to compare with the previous period.`));
    }
    const top = [...totalsByPkg].sort((a, b) => b.total - a.total)[0];
    if (top && grandTotal > 0 && totalsByPkg.length > 1) list.push(t(`${top.pkg.name} concentra el ${pct(top.total / grandTotal)} de las descargas del período.`, `${top.pkg.name} accounts for ${pct(top.total / grandTotal)} of the period's downloads.`));
    if (k.peak.value > 0 && k.median >= 0) list.push(t(`El día más fuerte fue el ${longDate.format(new Date(`${k.peak.date}T00:00:00Z`))}, con ${fmt.format(k.peak.value)} descargas${k.median ? ` (${(k.peak.value / k.median).toFixed(1)} veces la mediana diaria)` : ''}.`, `The strongest day was ${longDate.format(new Date(`${k.peak.date}T00:00:00Z`))} with ${fmt.format(k.peak.value)} downloads${k.median ? ` (${(k.peak.value / k.median).toFixed(1)}× the daily median)` : ''}.`));
    if (weekdaySum > 0) list.push(t(`${pct(1 - weekendShare)} de las descargas ocurren de lunes a viernes: el uso es sobre todo laboral o automatizado.`, `${pct(1 - weekendShare)} of downloads happen Monday to Friday: usage is mostly work or automation.`));
    if (osSum > 0) {
      const ranked = Object.entries(osTotals).filter(([key]) => key !== 'null').sort((a, b) => b[1] - a[1]);
      if (ranked[0] && knownOs > 0) list.push(t(`Entre las descargas que informan su sistema, ${osLabel(ranked[0][0])} lidera con el ${pct(ranked[0][1] / knownOs)}. Pero ${pct((osTotals.null ?? 0) / osSum)} de las descargas no informa su sistema.`, `Among the downloads that report their system, ${osLabel(ranked[0][0])} leads with ${pct(ranked[0][1] / knownOs)}. But ${pct((osTotals.null ?? 0) / osSum)} of downloads do not report their system.`));
    }
    const mirrored = mirrors.filter((row) => row.share !== null);
    if (mirrored.length) {
      const clean = mirrored.reduce((sum, row) => sum + row.clean, 0);
      const withM = mirrored.reduce((sum, row) => sum + row.withMirrors, 0);
      if (withM > 0) list.push(t(`Con los espejos de PyPI incluidos serían ${fmt.format(withM)} descargas; ${pct((withM - clean) / withM)} son réplicas y no se cuentan acá.`, `With PyPI mirrors included it would be ${fmt.format(withM)} downloads; ${pct((withM - clean) / withM)} are replicas and are not counted here.`));
    }
    const recent = impacts.find((row) => row.covered && row.before + row.after > 0);
    if (recent) list.push(t(`${recent.pkg} v${recent.version} (${dateLabel(recent.date)}): ${fmt.format(recent.after)} descargas en los 7 días siguientes contra ${fmt.format(recent.before)} en los 7 anteriores.`, `${recent.pkg} v${recent.version} (${dateLabel(recent.date)}): ${fmt.format(recent.after)} downloads in the next 7 days against ${fmt.format(recent.before)} in the previous 7.`));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k, totalsByPkg, grandTotal, weekdaySum, weekendShare, osSum, osTotals, knownOs, mirrors, impacts, lang]);

  const exportCsv = () => {
    const header = [t('Período', 'Period'), ...selected.map((pkg) => pkg.name), 'Total'];
    const body = series.keys.map((key, index) => [key, ...selected.map((pkg) => series.values[pkg.name][index]), selected.reduce((sum, pkg) => sum + series.values[pkg.name][index], 0)]);
    const blob = new Blob([toCsv([header, ...body])], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pypi-downloads-${windowRange.from}_${windowRange.to}-${state.gran}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const sortBy = (key: SortKey) => setSort((current) => ({ key, dir: current.key === key ? (current.dir === 1 ? -1 : 1) : key === 'name' ? 1 : -1 }));
  const arrow = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? ' ▲' : ' ▼') : '');
  const modeNames: Record<Mode, string> = { bars: t('Barras apiladas', 'Stacked bars'), lines: t('Líneas', 'Lines'), cumulative: t('Acumulado', 'Cumulative'), share: t('Participación %', 'Share %'), index: t('Índice (pico = 100)', 'Index (peak = 100)') };
  const rangeNames: Record<RangeKey, string> = { '7': t('7 días', '7 days'), '30': t('30 días', '30 days'), '90': t('90 días', '90 days'), '180': t('180 días', '180 days'), custom: t('Personalizado', 'Custom') };
  const hasFilter = state.pkgs !== null || state.segment.kind !== 'all';

  return (
    <div className="signal-pd">
      {/* ---------- controls ---------- */}
      <div className="signal-pd-controls" role="region" aria-label={t('Filtros', 'Filters')}>
        <div className="signal-pd-ctl">
          <span className="signal-pd-ctl__label">{t('Paquetes', 'Packages')}</span>
          <div className="signal-pd-chips">
            {all.map((pkg) => {
              const on = !state.pkgs || state.pkgs.includes(pkg.name);
              return (
                <button key={pkg.name} type="button" className={`signal-pd-chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => toggle(pkg.name)} onDoubleClick={() => solo(pkg.name)} title={t('Doble clic: solo este', 'Double click: only this one')}>
                  <i style={{ background: colorOf.get(pkg.name) }} aria-hidden="true" />
                  {pkg.name}
                </button>
              );
            })}
            <button type="button" className="signal-pd-link" onClick={showAll}>{t('Todos', 'All')}</button>
          </div>
        </div>
        <div className="signal-pd-ctl">
          <span className="signal-pd-ctl__label">{t('Período', 'Period')}</span>
          <div className="signal-pd-seg" role="group" aria-label={t('Período', 'Period')}>
            {(Object.keys(rangeNames) as RangeKey[]).map((key) => (
              <button key={key} type="button" className={state.range === key ? 'is-on' : ''} aria-pressed={state.range === key} onClick={() => patch(key === 'custom' ? { range: 'custom', from: windowRange.from, to: windowRange.to } : { range: key })}>
                {rangeNames[key]}
              </button>
            ))}
          </div>
          {state.range === 'custom' ? (
            <div className="signal-pd-dates">
              <label>{t('Desde', 'From')}<input type="date" min={first} max={state.to || latest} value={state.from} onChange={(event) => event.target.value && patch({ from: event.target.value })} /></label>
              <label>{t('Hasta', 'To')}<input type="date" min={state.from || first} max={latest} value={state.to} onChange={(event) => event.target.value && patch({ to: event.target.value })} /></label>
            </div>
          ) : null}
        </div>
        <div className="signal-pd-ctl">
          <span className="signal-pd-ctl__label">{t('Agrupar por', 'Group by')}</span>
          <div className="signal-pd-seg" role="group">
            {(['day', 'week', 'month'] as Granularity[]).map((gran) => (
              <button key={gran} type="button" className={state.gran === gran ? 'is-on' : ''} aria-pressed={state.gran === gran} onClick={() => patch({ gran, ma: gran === 'day' ? state.ma : false })}>
                {gran === 'day' ? t('Día', 'Day') : gran === 'week' ? t('Semana', 'Week') : t('Mes', 'Month')}
              </button>
            ))}
          </div>
        </div>
        <div className="signal-pd-ctl">
          <span className="signal-pd-ctl__label">{t('Segmento', 'Segment')}</span>
          <select value={segmentKey(state.segment)} onChange={(event) => patch({ segment: parseSegment(event.target.value) })} aria-label={t('Segmento', 'Segment')}>
            <option value="all">{t('Todas las descargas', 'All downloads')}</option>
            <optgroup label={t('Por sistema operativo', 'By operating system')}>
              {Object.keys(osTotals).filter((key) => osTotals[key] > 0).map((key) => <option key={key} value={`os:${key}`}>{osLabel(key)}</option>)}
            </optgroup>
            <optgroup label={t('Por versión de Python', 'By Python version')}>
              {Object.keys(pyTotals).filter((key) => pyTotals[key] > 0).map((key) => <option key={key} value={`py:${key}`}>Python {pyLabel(key)}</option>)}
            </optgroup>
          </select>
        </div>
        <div className="signal-pd-ctl signal-pd-ctl--actions">
          <button type="button" className="signal-pd-btn" onClick={reset} disabled={!hasFilter && state.range === DEFAULTS.range && state.gran === 'day' && state.mode === 'bars'}>{t('Restablecer', 'Reset')}</button>
          <button type="button" className="signal-pd-btn" onClick={exportCsv}>{t('Exportar CSV', 'Export CSV')}</button>
        </div>
      </div>
      <p className="signal-pd-context" aria-live="polite">
        {t('Mostrando', 'Showing')} <b>{segmentLabel}</b> · {selected.map((pkg) => pkg.name).join(', ')} · {longDate.format(new Date(`${windowRange.from}T00:00:00Z`))} → {longDate.format(new Date(`${windowRange.to}T00:00:00Z`))}
      </p>

      {/* ---------- insights ---------- */}
      <section className="signal-pd-block" aria-labelledby="pd-insights">
        <h3 id="pd-insights" className="signal-pd-q">{t('Lo que dicen los datos', 'What the data says')}</h3>
        <ul className="signal-pd-insights">
          {insights.map((text) => <li key={text}>{text}</li>)}
        </ul>
      </section>

      {/* ---------- Q1: how many, growing? ---------- */}
      <section className="signal-pd-block" aria-labelledby="pd-q1">
        <h3 id="pd-q1" className="signal-pd-q">{t('¿Cuántas descargas hay y está creciendo?', 'How many downloads are there, and is it growing?')}</h3>
        <div className="signal-pd-kpis">
          <div className="signal-pd-kpi"><span>{t('Descargas', 'Downloads')}</span><strong>{fmt.format(k.total)}</strong>
            <em className={k.delta === null || !k.previousCovered ? '' : k.delta >= 0 ? 'is-up' : 'is-down'}>{k.delta === null || !k.previousCovered ? t('sin período previo comparable', 'no comparable previous period') : `${k.delta >= 0 ? '▲' : '▼'} ${pct(Math.abs(k.delta))} ${t('vs período anterior', 'vs previous period')}`}</em></div>
          <div className="signal-pd-kpi"><span>{t('Promedio por día', 'Average per day')}</span><strong>{k.perDay.toFixed(k.perDay < 10 ? 1 : 0)}</strong><em>{t('mediana', 'median')} {fmt.format(k.median)}</em></div>
          <div className="signal-pd-kpi"><span>{t('Día pico', 'Peak day')}</span><strong>{fmt.format(k.peak.value)}</strong><em>{dateLabel(k.peak.date)}</em></div>
          <div className="signal-pd-kpi"><span>{t('Días con descargas', 'Days with downloads')}</span><strong>{k.activeDays}<small>/{k.days}</small></strong><em>{pct(k.days ? k.activeDays / k.days : 0)}</em></div>
        </div>
        <div className="signal-pd-panel">
          <div className="signal-pd-panel__bar">
            <div className="signal-pd-seg" role="group" aria-label={t('Tipo de gráfico', 'Chart type')}>
              {MODES.map((mode) => <button key={mode} type="button" className={state.mode === mode ? 'is-on' : ''} aria-pressed={state.mode === mode} onClick={() => patch({ mode })}>{modeNames[mode]}</button>)}
            </div>
            <label className={`signal-pd-check${state.gran !== 'day' || state.mode === 'cumulative' || state.mode === 'share' ? ' is-disabled' : ''}`}><input type="checkbox" checked={state.ma} disabled={state.gran !== 'day' || state.mode === 'cumulative' || state.mode === 'share'} onChange={(event) => patch({ ma: event.target.checked })} />{t('Promedio de 7 días', '7-day average')}</label>
            <label className={`signal-pd-check${state.mode === 'bars' || state.mode === 'share' ? ' is-disabled' : ''}`}><input type="checkbox" checked={state.log} disabled={state.mode === 'bars' || state.mode === 'share'} onChange={(event) => patch({ log: event.target.checked })} />{t('Escala logarítmica', 'Log scale')}</label>
            <label className="signal-pd-check"><input type="checkbox" checked={state.releases} onChange={(event) => patch({ releases: event.target.checked })} />{t('Marcar versiones', 'Mark releases')}</label>
          </div>
          <div className="signal-pd-chart signal-pd-chart--main" role="img" aria-label={t('Descargas a lo largo del tiempo', 'Downloads over time')}>
            {state.mode === 'bars' || state.mode === 'share'
              ? <Bar data={{ labels: main.labels, datasets: main.datasets } as never} options={mainOptions} plugins={[releasePlugin]} />
              : <Line data={{ labels: main.labels, datasets: main.datasets } as never} options={mainOptions as unknown as ChartOptions<'line'>} plugins={[releasePlugin]} />}
          </div>
        </div>
      </section>

      {/* ---------- Q2: which package ---------- */}
      <section className="signal-pd-block" aria-labelledby="pd-q2">
        <h3 id="pd-q2" className="signal-pd-q">{t('¿Qué paquete mueve las descargas?', 'Which package drives the downloads?')}</h3>
        <div className="signal-pd-two">
          <div className="signal-pd-panel">
            <h4>{t('Participación en el período', 'Share of the period')}</h4>
            <div className="signal-pd-chart signal-pd-chart--pie" role="img" aria-label={t('Participación de cada paquete', 'Share of each package')}>
              <Doughnut data={sharePie} options={baseOptions<'doughnut'>({ cutout: '62%', interaction: { mode: 'nearest', intersect: true }, plugins: { legend: { display: true, position: 'right', labels: { color: theme.text, boxWidth: 10, boxHeight: 10, usePointStyle: true } }, tooltip: { backgroundColor: theme.surface, titleColor: theme.text, bodyColor: theme.text, borderColor: theme.grid, borderWidth: 1, callbacks: { label: (item: { label: string; parsed: number }) => `${item.label}: ${fmt.format(item.parsed)} (${grandTotal ? pct(item.parsed / grandTotal, 1) : '0%'})` } } } })} />
            </div>
          </div>
          <div className="signal-pd-panel">
            <h4>{t('Descargas por paquete', 'Downloads per package')}</h4>
            <div className="signal-pd-chart signal-pd-chart--pie" role="img" aria-label={t('Ranking de paquetes', 'Package ranking')}>
              <Bar
                data={{ labels: [...totalsByPkg].sort((a, b) => b.total - a.total).map(({ pkg }) => pkg.name), datasets: [{ data: [...totalsByPkg].sort((a, b) => b.total - a.total).map(({ total }) => total), backgroundColor: [...totalsByPkg].sort((a, b) => b.total - a.total).map(({ pkg }) => colorOf.get(pkg.name) ?? '#94a3b8'), borderRadius: 4 }] }}
                options={baseOptions<'bar'>({ indexAxis: 'y', scales: { x: axisBase({ beginAtZero: true }), y: axisBase({ grid: { display: false } }) } })}
              />
            </div>
          </div>
        </div>
        <div className="signal-pd-panel signal-pd-tablewrap">
          <div className="signal-pd-tablebar">
            <h4>{t('Paquete por paquete', 'Package by package')}</h4>
            <input type="search" placeholder={t('Buscar paquete…', 'Search package…')} value={query} onChange={(event) => setQuery(event.target.value)} aria-label={t('Buscar paquete', 'Search package')} />
          </div>
          <table className="signal-pd-table">
            <thead>
              <tr>
                <th><button type="button" onClick={() => sortBy('name')}>{t('Paquete', 'Package')}{arrow('name')}</button></th>
                <th><button type="button" onClick={() => sortBy('total')}>{t('Descargas', 'Downloads')}{arrow('total')}</button></th>
                <th><button type="button" onClick={() => sortBy('delta')}>{t('vs anterior', 'vs previous')}{arrow('delta')}</button></th>
                <th><button type="button" onClick={() => sortBy('perDay')}>{t('Por día', 'Per day')}{arrow('perDay')}</button></th>
                <th className="txt">{t('Tendencia', 'Trend')}</th>
                <th><button type="button" onClick={() => sortBy('stars')}>★{arrow('stars')}</button></th>
                <th>{t('Última versión', 'Latest')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ pkg, total, delta, perDay, stars }) => {
                const map = dailyMap(pkg, state.segment);
                const days = dateRange(windowRange.from, windowRange.to).slice(-30);
                const values = days.map((day) => map.get(day) ?? 0);
                const peak = Math.max(1, ...values);
                return (
                  <tr key={pkg.name} className={isSolo && state.pkgs?.[0] === pkg.name ? 'is-solo' : ''}>
                    <td><button type="button" className="signal-pd-name" onClick={() => solo(pkg.name)} title={t('Ver solo este paquete', 'View only this package')}><i style={{ background: colorOf.get(pkg.name) }} aria-hidden="true" />{pkg.name}</button>
                      <a className="signal-pd-ext" href={`https://pypi.org/project/${pkg.name}/`} target="_blank" rel="noopener noreferrer" aria-label={`${pkg.name} on PyPI`}>PyPI ↗</a></td>
                    <td className="num">{fmt.format(total)}</td>
                    <td className={`num ${delta === null ? '' : delta >= 0 ? 'is-up' : 'is-down'}`}>{delta === null ? '—' : `${delta >= 0 ? '▲' : '▼'} ${pct(Math.abs(delta))}`}</td>
                    <td className="num">{perDay.toFixed(perDay < 10 ? 1 : 0)}</td>
                    <td className="txt"><svg className="signal-pd-spark" viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke={colorOf.get(pkg.name)} strokeWidth="1.6" points={values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 120},${26 - (value / peak) * 24}`).join(' ')} vectorEffect="non-scaling-stroke" /></svg></td>
                    <td className="num">{stars ? fmt.format(stars) : '—'}</td>
                    <td className="num">{pkg.version ? `v${pkg.version}` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- Q3: when ---------- */}
      <section className="signal-pd-block" aria-labelledby="pd-q3">
        <h3 id="pd-q3" className="signal-pd-q">{t('¿Cuándo se descarga?', 'When are they downloaded?')}</h3>
        <div className="signal-pd-two signal-pd-two--wide-right">
          <div className="signal-pd-panel">
            <h4>{t('Por día de la semana', 'By day of the week')}</h4>
            <div className="signal-pd-chart signal-pd-chart--small" role="img" aria-label={t('Descargas por día de la semana', 'Downloads by weekday')}>
              <Bar data={{ labels: weekdayNames, datasets: [{ data: weekdays, backgroundColor: weekdays.map((_, index) => (index >= 5 ? '#fbbf24' : '#22d3ee')), borderRadius: 4 }] }} options={baseOptions<'bar'>({ scales: { x: axisBase({ grid: { display: false } }), y: axisBase({ beginAtZero: true }) } })} />
            </div>
            <p className="signal-pd-note">{t('Fin de semana', 'Weekend')}: <b>{pct(weekendShare)}</b> · {t('Lunes a viernes', 'Monday to Friday')}: <b>{pct(weekdaySum ? 1 - weekendShare : 0)}</b></p>
          </div>
          <div className="signal-pd-panel">
            <h4>{t('Calendario', 'Calendar')}</h4>
            <div className="signal-pd-heat" role="img" aria-label={t('Calendario de descargas por día', 'Calendar of downloads per day')}>
              <div className="signal-pd-heat__days" aria-hidden="true">{weekdayNames.map((name, index) => <span key={name} style={{ gridRow: index + 1 }}>{index % 2 === 0 ? name : ''}</span>)}</div>
              <div className="signal-pd-heat__grid" style={{ gridTemplateColumns: `repeat(${heat.length}, 1fr)` }}>
                {heat.map((week) => week.map((cell, row) => (
                  <span key={cell.date} className={`signal-pd-heat__cell${cell.inRange ? '' : ' is-out'}`} style={{ gridRow: row + 1, background: cell.inRange && cell.value ? `rgba(34,211,238,${(0.18 + 0.82 * Math.sqrt(cell.value / heatMax)).toFixed(2)})` : undefined }} title={`${longDate.format(new Date(`${cell.date}T00:00:00Z`))}: ${fmt.format(cell.value)}`} />
                )))}
              </div>
            </div>
            <p className="signal-pd-note">{t('Más intenso = más descargas ese día. Pasá el mouse sobre un día para ver el número.', 'Brighter = more downloads that day. Hover a day to see the number.')}</p>
          </div>
        </div>
      </section>

      {/* ---------- Q4: who ---------- */}
      <section className="signal-pd-block" aria-labelledby="pd-q4">
        <h3 id="pd-q4" className="signal-pd-q">{t('¿Desde qué sistemas y versiones de Python?', 'From which systems and Python versions?')}</h3>
        <div className="signal-pd-two">
          <div className="signal-pd-panel">
            <h4>{t('Sistema operativo, por paquete', 'Operating system, by package')}</h4>
            <div className="signal-pd-chart signal-pd-chart--small" role="img" aria-label={t('Sistema operativo por paquete', 'Operating system by package')}>
              <Bar
                data={{ labels: perPkgOs.map(({ pkg }) => pkg.name), datasets: osCategories.map((category) => ({ label: osLabel(category), data: perPkgOs.map(({ data }) => { const sum = Object.values(data).reduce((a, b) => a + b, 0); return sum ? ((data[category] ?? 0) / sum) * 100 : 0; }), backgroundColor: OS_COLORS[category] ?? '#94a3b8', stack: 's' })) }}
                options={baseOptions<'bar'>({ indexAxis: 'y', scales: { x: axisBase({ stacked: true, max: 100, ticks: { color: theme.muted, callback: (value: number | string) => `${value}%` } }), y: axisBase({ stacked: true, grid: { display: false } }) }, plugins: { legend: { display: true, position: 'bottom', labels: { color: theme.text, boxWidth: 10, boxHeight: 10, usePointStyle: true } }, tooltip: { backgroundColor: theme.surface, titleColor: theme.text, bodyColor: theme.text, borderColor: theme.grid, borderWidth: 1, callbacks: { label: (item: { dataset: { label?: string }; parsed: { x: number } }) => `${item.dataset.label}: ${item.parsed.x.toFixed(0)}%` } } }, onClick: (_event: unknown, elements: { datasetIndex: number }[]) => { const element = elements[0]; if (element) patch({ segment: { kind: 'os', value: osCategories[element.datasetIndex] } }); } })}
              />
            </div>
            <p className="signal-pd-note">{t('Hacé clic en una barra para filtrar la tendencia por ese sistema. “Desconocido” son descargas de clientes que no informan su sistema (no es un error).', 'Click a bar to filter the trend by that system. “Unknown” are downloads from clients that do not report their system (it is not an error).')}</p>
          </div>
          <div className="signal-pd-panel">
            <h4>{t('Versión de Python', 'Python version')}</h4>
            <div className="signal-pd-chart signal-pd-chart--small" role="img" aria-label={t('Descargas por versión de Python', 'Downloads by Python version')}>
              <Bar
                data={{ labels: pyList.map(([key]) => pyLabel(key)), datasets: [{ data: pyList.map(([, value]) => value), backgroundColor: pyList.map(([key]) => (key === 'null' ? '#475569' : '#a78bfa')), borderRadius: 4 }] }}
                options={baseOptions<'bar'>({ scales: { x: axisBase({ grid: { display: false } }), y: axisBase({ beginAtZero: true }) }, onClick: (_event: unknown, elements: { index: number }[]) => { const element = elements[0]; if (element) patch({ segment: { kind: 'py', value: pyList[element.index][0] } }); } })}
              />
            </div>
            <p className="signal-pd-note">{t('Clic en una barra: filtra la tendencia por esa versión.', 'Click a bar: filters the trend by that version.')}</p>
          </div>
        </div>
      </section>

      {/* ---------- Q5: releases ---------- */}
      <section className="signal-pd-block" aria-labelledby="pd-q5">
        <h3 id="pd-q5" className="signal-pd-q">{t('¿Las versiones nuevas mueven las descargas?', 'Do new releases move the downloads?')}</h3>
        <div className="signal-pd-panel signal-pd-tablewrap">
          <table className="signal-pd-table">
            <thead><tr><th>{t('Versión', 'Release')}</th><th className="txt">{t('Fecha', 'Date')}</th><th>{t('7 días antes', '7 days before')}</th><th>{t('7 días después', '7 days after')}</th><th>{t('Cambio', 'Change')}</th></tr></thead>
            <tbody>
              {impacts.length === 0 ? <tr><td colSpan={5} className="signal-pd-empty">{t('No hay versiones en este período.', 'There are no releases in this period.')}</td></tr> : impacts.map((row) => {
                const change = row.covered && row.before ? (row.after - row.before) / row.before : null;
                return (
                  <tr key={`${row.pkg}-${row.version}`} className={row.covered ? '' : 'is-partial'}>
                    <td><i className="signal-pd-dot" style={{ background: colorOf.get(row.pkg) }} aria-hidden="true" />{row.pkg} <b>v{row.version}</b></td>
                    <td className="txt">{dateLabel(row.date)}</td>
                    <td className="num">{fmt.format(row.before)}</td>
                    <td className="num">{fmt.format(row.after)}</td>
                    <td className={`num ${change === null ? '' : change >= 0 ? 'is-up' : 'is-down'}`}>{change === null ? '—' : `${change >= 0 ? '▲' : '▼'} ${pct(Math.abs(change))}`}{row.covered ? '' : ` ${t('(parcial)', '(partial)')}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="signal-pd-note">{t('Cuenta las descargas del día de la versión y los 6 siguientes, contra los 7 días previos. “Parcial” indica que todavía no pasó una semana o que falta historia. Una correlación no prueba causa: los picos también vienen de escaneos y CI.', 'It counts the release day and the next 6 days against the 7 days before. “Partial” means a week has not passed yet or history is missing. Correlation is not causation: spikes also come from scans and CI.')}</p>
        </div>
      </section>

      {/* ---------- Q6: how clean ---------- */}
      <section className="signal-pd-block" aria-labelledby="pd-q6">
        <h3 id="pd-q6" className="signal-pd-q">{t('¿Qué tan reales son estas cifras?', 'How real are these numbers?')}</h3>
        <div className="signal-pd-panel">
          <h4>{t('Descargas reales vs. réplicas (espejos)', 'Downloads vs. mirror replicas')}</h4>
          <div className="signal-pd-chart signal-pd-chart--small" role="img" aria-label={t('Descargas sin y con espejos', 'Downloads without and with mirrors')}>
            <Bar
              data={{ labels: mirrors.map((row) => row.pkg.name), datasets: [
                { label: t('Descargas contadas', 'Counted downloads'), data: mirrors.map((row) => row.clean), backgroundColor: '#22d3ee', stack: 'm' },
                { label: t('Réplicas de espejos (no se cuentan)', 'Mirror replicas (not counted)'), data: mirrors.map((row) => Math.max(0, row.withMirrors - row.clean)), backgroundColor: '#475569', stack: 'm' },
              ] }}
              options={baseOptions<'bar'>({ indexAxis: 'y', scales: { x: axisBase({ stacked: true, beginAtZero: true }), y: axisBase({ stacked: true, grid: { display: false } }) }, plugins: { legend: { display: true, position: 'bottom', labels: { color: theme.text, boxWidth: 10, boxHeight: 10, usePointStyle: true } }, tooltip: { backgroundColor: theme.surface, titleColor: theme.text, bodyColor: theme.text, borderColor: theme.grid, borderWidth: 1 } } })}
            />
          </div>
          <p className="signal-pd-note">{t('Aun sin espejos, las descargas incluyen CI, bots y reinstalaciones: no son usuarios únicos. Los números de “Participación” y “Tendencia” usan solo las descargas contadas.', 'Even without mirrors, downloads include CI, bots and reinstalls: they are not unique users. The “Share” and “Trend” numbers use only the counted downloads.')}</p>
        </div>
      </section>

      {/* ---------- Q7: github ---------- */}
      <section className="signal-pd-block" aria-labelledby="pd-q7">
        <h3 id="pd-q7" className="signal-pd-q">{t('¿El interés en GitHub acompaña a las descargas?', 'Is GitHub interest following the downloads?')}</h3>
        <div className="signal-pd-two">
          <div className="signal-pd-panel">
            <h4>{t('Estrellas acumuladas', 'Cumulative stars')}</h4>
            <div className="signal-pd-chart signal-pd-chart--small" role="img" aria-label={t('Estrellas acumuladas por repositorio', 'Cumulative stars per repository')}>
              <Line
                data={{ labels: starDates.map((date) => monthDate.format(new Date(`${date}T00:00:00Z`))), datasets: selected.filter((pkg) => pkg.github).map((pkg) => ({ label: pkg.name, data: starsOver(pkg.github?.starHistory, starDates), borderColor: colorOf.get(pkg.name), backgroundColor: colorOf.get(pkg.name), borderWidth: 2, pointRadius: 0, stepped: true })) }}
                options={baseOptions<'line'>({ scales: { x: axisBase({ grid: { display: false }, ticks: { color: theme.muted, maxTicksLimit: 8, maxRotation: 0 } }), y: axisBase({ beginAtZero: true, ticks: { color: theme.muted, precision: 0 } }) }, plugins: { legend: { display: true, position: 'bottom', labels: { color: theme.text, boxWidth: 10, boxHeight: 10, usePointStyle: true } }, tooltip: { backgroundColor: theme.surface, titleColor: theme.text, bodyColor: theme.text, borderColor: theme.grid, borderWidth: 1 } } })}
              />
            </div>
          </div>
          <div className="signal-pd-panel">
            <h4>{t('Commits por semana (último año)', 'Commits per week (last year)')}</h4>
            {hasCommits ? (
              <div className="signal-pd-chart signal-pd-chart--small" role="img" aria-label={t('Commits por semana', 'Commits per week')}>
                <Bar
                  data={{ labels: commitWeeks.map((week) => dateLabel(week)), datasets: selected.filter((pkg) => pkg.github?.commits?.length).map((pkg) => ({ label: pkg.name, data: commitWeeks.map((week) => pkg.github?.commits?.find((entry) => entry.week === week)?.total ?? 0), backgroundColor: colorOf.get(pkg.name), stack: 'c' })) }}
                  options={baseOptions<'bar'>({ scales: { x: axisBase({ stacked: true, grid: { display: false }, ticks: { color: theme.muted, maxTicksLimit: 8, maxRotation: 0 } }), y: axisBase({ stacked: true, beginAtZero: true, ticks: { color: theme.muted, precision: 0 } }) }, plugins: { legend: { display: true, position: 'bottom', labels: { color: theme.text, boxWidth: 10, boxHeight: 10, usePointStyle: true } }, tooltip: { backgroundColor: theme.surface, titleColor: theme.text, bodyColor: theme.text, borderColor: theme.grid, borderWidth: 1 } } })}
                />
              </div>
            ) : <p className="signal-pd-empty">{t('Sin commits en el último año para los paquetes elegidos.', 'No commits in the last year for the selected packages.')}</p>}
          </div>
        </div>
        <div className="signal-pd-panel signal-pd-tablewrap">
          <table className="signal-pd-table">
            <thead><tr><th>{t('Repositorio', 'Repository')}</th><th>★</th><th>Forks</th><th>Issues</th><th className="txt">{t('Lenguaje', 'Language')}</th><th className="txt">{t('Licencia', 'License')}</th><th className="txt">{t('Último push', 'Last push')}</th><th>{t('★ cada 1.000 descargas', '★ per 1,000 downloads')}</th></tr></thead>
            <tbody>
              {selected.filter((pkg) => pkg.github).map((pkg) => {
                const total = totalsByPkg.find((row) => row.pkg.name === pkg.name)?.total ?? 0;
                const g = pkg.github!;
                return (
                  <tr key={pkg.name}>
                    <td><i className="signal-pd-dot" style={{ background: colorOf.get(pkg.name) }} aria-hidden="true" /><a href={g.url} target="_blank" rel="noopener noreferrer">{pkg.repo}</a></td>
                    <td className="num">{fmt.format(g.stars)}</td><td className="num">{fmt.format(g.forks)}</td><td className="num">{fmt.format(g.openIssues)}</td>
                    <td className="txt">{g.language || '—'}</td><td className="txt">{g.license && g.license !== 'NOASSERTION' ? g.license : '—'}</td>
                    <td className="txt">{g.pushedAt ? dateLabel(g.pushedAt) : '—'}</td>
                    <td className="num">{total ? ((g.stars / total) * 1000).toFixed(1) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="signal-pd-note">{t('Las estrellas son el total histórico del repositorio, no del período; la última columna las compara con las descargas del período elegido solo como referencia.', 'Stars are the repository’s all-time total, not the period’s; the last column compares them with the selected period’s downloads only as a reference.')} <span className="signal-pd-short">{compact.format(grandTotal)} {t('descargas en el período', 'downloads in the period')}</span></p>
        </div>
      </section>
    </div>
  );
}
