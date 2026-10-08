/**
 * Pure helpers for the PyPI stats dashboard (/recursos/pypi-stats/). No React, no DOM: everything here takes plain data
 * (the JSON written by scripts/sync-pypi-stats.mjs) and returns plain data, so it can be checked on its own.
 * Dates are 'YYYY-MM-DD' strings in UTC.
 */

export type Point = { date: string; downloads: number };
export type Pivot = { dates: string[]; series: Record<string, number[]> };
export type Release = { version: string; date: string };
export type Github = {
  stars: number;
  forks: number;
  openIssues: number;
  url: string;
  createdAt?: string;
  pushedAt?: string;
  language?: string;
  license?: string;
  starHistory?: string[];
  commits?: { week: string; total: number }[];
};
export type Pkg = {
  name: string;
  repo: string | null;
  homebrew: string | null;
  version?: string;
  summary?: string;
  releasedAt?: string | null;
  releases?: Release[] | number;
  recent: { day: number; week: number; month: number };
  history: Point[];
  withMirrors?: Point[];
  system?: Pivot | null;
  python?: Pivot | null;
  github?: Github | null;
  stale?: boolean;
};
export type Stats = { generatedAt: string; owner: string; packages: Pkg[] };

/** What the main series is made of: every download, or only the ones from one operating system or one Python version. */
export type Segment = { kind: 'all' } | { kind: 'os'; value: string } | { kind: 'py'; value: string };
export type Granularity = 'day' | 'week' | 'month';

// ---------- dates ----------

const DAY = 86_400_000;
export const toTime = (date: string) => Date.parse(`${date}T00:00:00Z`);
export const fromTime = (time: number) => new Date(time).toISOString().slice(0, 10);
export const addDays = (date: string, days: number) => fromTime(toTime(date) + days * DAY);
export const daysBetween = (from: string, to: string) => Math.round((toTime(to) - toTime(from)) / DAY);

/** Every date from `from` to `to`, both included. */
export function dateRange(from: string, to: string): string[] {
  const out: string[] = [];
  for (let date = from; date <= to && out.length < 4000; date = addDays(date, 1)) out.push(date);
  return out;
}

/** Monday of the week of `date`. */
export function weekStart(date: string): string {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return addDays(date, -((day + 6) % 7));
}

export function bucketStart(date: string, gran: Granularity): string {
  if (gran === 'week') return weekStart(date);
  if (gran === 'month') return `${date.slice(0, 7)}-01`;
  return date;
}

export function latestDate(packages: Pkg[]): string {
  let latest = '';
  for (const pkg of packages) for (const point of pkg.history) if (point.date > latest) latest = point.date;
  return latest;
}

export function earliestDate(packages: Pkg[]): string {
  let earliest = '9999-12-31';
  for (const pkg of packages) for (const point of pkg.history) if (point.date < earliest) earliest = point.date;
  return earliest;
}

// ---------- series ----------

/** Downloads per date of one package for the chosen segment. Dates without data are simply absent. */
export function dailyMap(pkg: Pkg, segment: Segment): Map<string, number> {
  const map = new Map<string, number>();
  if (segment.kind === 'all') {
    pkg.history.forEach((point) => map.set(point.date, point.downloads));
    return map;
  }
  const pivot = segment.kind === 'os' ? pkg.system : pkg.python;
  const values = pivot?.series[segment.value];
  if (pivot && values) pivot.dates.forEach((date, index) => map.set(date, values[index] ?? 0));
  return map;
}

export const sumOver = (map: Map<string, number>, from: string, to: string) => {
  let total = 0;
  map.forEach((value, date) => {
    if (date >= from && date <= to) total += value;
  });
  return total;
};

export type Series = { labels: string[]; keys: string[]; values: Record<string, number[]> };

/** One array per package, one slot per bucket (day, week or month) between `from` and `to`. */
export function buildSeries(packages: Pkg[], segment: Segment, from: string, to: string, gran: Granularity): Series {
  const days = dateRange(from, to);
  const keys: string[] = [];
  const index = new Map<string, number>();
  for (const day of days) {
    const key = bucketStart(day, gran);
    if (!index.has(key)) {
      index.set(key, keys.length);
      keys.push(key);
    }
  }
  const values: Record<string, number[]> = {};
  for (const pkg of packages) {
    const map = dailyMap(pkg, segment);
    const row = new Array<number>(keys.length).fill(0);
    for (const day of days) row[index.get(bucketStart(day, gran)) ?? 0] += map.get(day) ?? 0;
    values[pkg.name] = row;
  }
  return { labels: keys, keys, values };
}

export function totalsOf(series: Series): number[] {
  return series.keys.map((_, index) => Object.values(series.values).reduce((total, row) => total + row[index], 0));
}

export function movingAverage(values: number[], window: number): number[] {
  return values.map((_, index) => {
    const start = Math.max(0, index - window + 1);
    const slice = values.slice(start, index + 1);
    return slice.reduce((total, value) => total + value, 0) / slice.length;
  });
}

export function cumulative(values: number[]): number[] {
  let running = 0;
  return values.map((value) => (running += value));
}

/** Each value as a percentage of the largest one (100 = the best bucket of that series). */
export function indexed(values: number[]): number[] {
  const max = Math.max(...values, 0);
  return max ? values.map((value) => (value / max) * 100) : values.map(() => 0);
}

// ---------- period comparison ----------

export type Window = { from: string; to: string };

/** The window of the same length that ends the day before `window` starts. */
export function previousWindow(window: Window): Window {
  const length = daysBetween(window.from, window.to) + 1;
  return { from: addDays(window.from, -length), to: addDays(window.from, -1) };
}

export function change(current: number, previous: number): number | null {
  if (!previous) return null;
  return (current - previous) / previous;
}

export type Kpis = {
  total: number;
  previous: number;
  previousCovered: boolean;
  delta: number | null;
  perDay: number;
  peak: { date: string; value: number };
  median: number;
  activeDays: number;
  days: number;
};

export function kpis(packages: Pkg[], segment: Segment, window: Window, firstDate: string): Kpis {
  const days = dateRange(window.from, window.to);
  const perDay = days.map(() => 0);
  const maps = packages.map((pkg) => dailyMap(pkg, segment));
  days.forEach((day, index) => {
    maps.forEach((map) => {
      perDay[index] += map.get(day) ?? 0;
    });
  });
  const total = perDay.reduce((sum, value) => sum + value, 0);
  const prevWindow = previousWindow(window);
  const previous = maps.reduce((sum, map) => sum + sumOver(map, prevWindow.from, prevWindow.to), 0);
  const peakIndex = perDay.reduce((best, value, index) => (value > perDay[best] ? index : best), 0);
  const sorted = [...perDay].sort((a, b) => a - b);
  const median = sorted.length ? (sorted[Math.floor((sorted.length - 1) / 2)] + sorted[Math.ceil((sorted.length - 1) / 2)]) / 2 : 0;
  return {
    total,
    previous,
    previousCovered: prevWindow.from >= firstDate,
    delta: change(total, previous),
    perDay: days.length ? total / days.length : 0,
    peak: { date: days[peakIndex] ?? window.to, value: perDay[peakIndex] ?? 0 },
    median,
    activeDays: perDay.filter((value) => value > 0).length,
    days: days.length,
  };
}

// ---------- patterns ----------

/** Downloads by weekday, Monday first, summed over the window. */
export function weekdayTotals(packages: Pkg[], segment: Segment, window: Window): number[] {
  const totals = new Array<number>(7).fill(0);
  for (const pkg of packages) {
    dailyMap(pkg, segment).forEach((value, date) => {
      if (date < window.from || date > window.to) return;
      totals[(new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7] += value;
    });
  }
  return totals;
}

export type HeatCell = { date: string; value: number; inRange: boolean };

/** Calendar heatmap: columns are weeks (Monday first), rows are weekdays. */
export function calendarCells(packages: Pkg[], segment: Segment, window: Window): HeatCell[][] {
  const maps = packages.map((pkg) => dailyMap(pkg, segment));
  const start = weekStart(window.from);
  const weeks: HeatCell[][] = [];
  for (let weekDate = start; weekDate <= window.to; weekDate = addDays(weekDate, 7)) {
    weeks.push(
      Array.from({ length: 7 }, (_, offset) => {
        const date = addDays(weekDate, offset);
        const inRange = date >= window.from && date <= window.to;
        return { date, inRange, value: inRange ? maps.reduce((sum, map) => sum + (map.get(date) ?? 0), 0) : 0 };
      }),
    );
  }
  return weeks;
}

/** Downloads per category (operating system or Python version) summed over the window, for every package given. */
export function breakdown(packages: Pkg[], pick: 'system' | 'python', window: Window): Record<string, number> {
  const out: Record<string, number> = {};
  for (const pkg of packages) {
    const pivot = pkg[pick];
    if (!pivot) continue;
    for (const [category, values] of Object.entries(pivot.series)) {
      let sum = 0;
      pivot.dates.forEach((date, index) => {
        if (date >= window.from && date <= window.to) sum += values[index] ?? 0;
      });
      out[category] = (out[category] ?? 0) + sum;
    }
  }
  return out;
}

export function mirrorShare(pkg: Pkg, window: Window): { clean: number; withMirrors: number; share: number | null } {
  const clean = sumOver(dailyMap(pkg, { kind: 'all' }), window.from, window.to);
  const map = new Map<string, number>();
  (pkg.withMirrors ?? []).forEach((point) => map.set(point.date, point.downloads));
  const withMirrors = sumOver(map, window.from, window.to);
  return { clean, withMirrors, share: withMirrors ? Math.max(0, (withMirrors - clean) / withMirrors) : null };
}

// ---------- releases ----------

export type ReleaseImpact = { pkg: string; version: string; date: string; before: number; after: number; covered: boolean };

/**
 * Downloads in the 7 days from the release day (included) against the 7 days before, from the daily history.
 * `covered` is false when the history does not span both weeks, in which case the numbers are partial.
 */
export function releaseImpacts(packages: Pkg[], latest: string): ReleaseImpact[] {
  const out: ReleaseImpact[] = [];
  for (const pkg of packages) {
    if (!Array.isArray(pkg.releases) || !pkg.history.length) continue;
    const map = dailyMap(pkg, { kind: 'all' });
    const first = pkg.history[0].date;
    for (const release of pkg.releases) {
      const after = sumOver(map, release.date, addDays(release.date, 6));
      const before = sumOver(map, addDays(release.date, -7), addDays(release.date, -1));
      out.push({ pkg: pkg.name, version: release.version, date: release.date, before, after,
        covered: addDays(release.date, -7) >= first && addDays(release.date, 6) <= latest });
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

// ---------- github ----------

/** Cumulative stars on each date of `dates` (a star is counted from the day it was given). */
export function starsOver(stars: string[] | undefined, dates: string[]): number[] {
  const sorted = [...(stars ?? [])].sort();
  let cursor = 0;
  return dates.map((date) => {
    while (cursor < sorted.length && sorted[cursor] <= date) cursor += 1;
    return cursor;
  });
}

// ---------- export ----------

export function toCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map((cell) => (typeof cell === 'string' && /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : String(cell))).join(',')).join('\n');
}

export const OS_LABELS: Record<string, string> = { Linux: 'Linux', Darwin: 'macOS', Windows: 'Windows', other: 'Other', null: 'Unknown' };
export const osLabel = (key: string) => OS_LABELS[key] ?? key;
export const pyLabel = (key: string) => (key === 'null' ? 'Unknown' : key);
