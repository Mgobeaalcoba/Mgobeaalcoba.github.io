import { readFileSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import ContextBackLink from '@/components/shared/ContextBackLink';
import { localizePath } from '@/lib/i18n-routes';
import type { Language } from '@/contexts/LanguageContext';

type Point = { date: string; downloads: number };
type Pkg = {
  name: string;
  repo: string | null;
  homebrew: string | null;
  version?: string;
  summary?: string;
  releasedAt?: string | null;
  recent: { day: number; week: number; month: number };
  history: Point[];
  github?: { stars: number; forks: number; openIssues: number; url: string } | null;
  stale?: boolean;
};
type Stats = { generatedAt: string; owner: string; packages: Pkg[] };

const PALETTE = ['#22d3ee', '#a78bfa', '#fbbf24', '#34d399', '#f472b6', '#60a5fa', '#fb923c'];
const CHART_DAYS = 90;

/** Read at build time: the prebuild script (scripts/sync-pypi-stats.mjs) refreshes this file before every build. */
function loadStats(): Stats {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), 'public/data/pypi-stats.json'), 'utf8')) as Stats;
  } catch {
    return { generatedAt: '', owner: '', packages: [] };
  }
}

const sum = (points: Point[]) => points.reduce((total, point) => total + point.downloads, 0);

function lastDates(packages: Pkg[], days: number): string[] {
  const all = new Set<string>();
  packages.forEach((pkg) => pkg.history.forEach((point) => all.add(point.date)));
  return Array.from(all).sort().slice(-days);
}

function StackedBars({ packages, dates, label, locale }: { packages: Pkg[]; dates: string[]; label: string; locale: string }) {
  const W = 960;
  const H = 280;
  const pad = { left: 44, right: 12, top: 14, bottom: 30 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const byPackage = packages.map((pkg) => new Map(pkg.history.map((point) => [point.date, point.downloads])));
  const totals = dates.map((date) => byPackage.reduce((total, series) => total + (series.get(date) ?? 0), 0));
  const maxValue = Math.max(10, ...totals);
  const niceMax = Math.ceil(maxValue / 10) * 10 || 10;
  const slot = innerW / Math.max(1, dates.length);
  const barW = Math.max(2, slot - 2);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(niceMax * fraction));
  const fmt = new Intl.NumberFormat(locale);
  const monthFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' });

  return (
    <svg className="signal-pypi-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {ticks.map((tick) => {
        const y = pad.top + innerH - (tick / niceMax) * innerH;
        return (
          <g key={tick}>
            <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} className="signal-pypi-grid" />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" className="signal-pypi-axis">{fmt.format(tick)}</text>
          </g>
        );
      })}
      {dates.map((date, index) => {
        let y = pad.top + innerH;
        const x = pad.left + index * slot + (slot - barW) / 2;
        return (
          <g key={date}>
            <title>{`${monthFmt.format(new Date(`${date}T00:00:00Z`))}: ${fmt.format(totals[index])}`}</title>
            {packages.map((pkg, pkgIndex) => {
              const value = byPackage[pkgIndex].get(date) ?? 0;
              if (!value) return null;
              const height = (value / niceMax) * innerH;
              y -= height;
              return <rect key={pkg.name} x={x} y={y} width={barW} height={height} fill={PALETTE[pkgIndex % PALETTE.length]} rx={1} />;
            })}
          </g>
        );
      })}
      {dates.map((date, index) => (index % Math.ceil(dates.length / 6) === 0 ? (
        <text key={date} x={pad.left + index * slot + slot / 2} y={H - 8} textAnchor="middle" className="signal-pypi-axis">{monthFmt.format(new Date(`${date}T00:00:00Z`))}</text>
      ) : null))}
    </svg>
  );
}

function Spark({ points, color }: { points: Point[]; color: string }) {
  const data = points.slice(-30);
  const W = 160;
  const H = 40;
  if (data.length < 2) return <span className="signal-pypi-nodata">—</span>;
  const max = Math.max(1, ...data.map((point) => point.downloads));
  const step = W / (data.length - 1);
  const line = data.map((point, index) => `${index === 0 ? 'M' : 'L'}${(index * step).toFixed(1)} ${(H - 4 - (point.downloads / max) * (H - 8)).toFixed(1)}`).join(' ');
  return (
    <svg className="signal-pypi-spark" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" preserveAspectRatio="none">
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill={color} opacity=".12" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * Dashboard of the Python packages published on PyPI (data: pypistats.org, pypi.org and GitHub, refreshed before each build).
 * Server component: it renders static HTML and SVG, so it needs no JavaScript in the browser.
 */
export default function PypiStatsPage({ lang }: { lang: Language }) {
  const t = <T,>(es: T, en: T): T => (lang === 'es' ? es : en);
  const locale = lang === 'es' ? 'es-AR' : 'en-US';
  const stats = loadStats();
  const packages = [...stats.packages].sort((a, b) => b.recent.month - a.recent.month);
  const dates = lastDates(packages, CHART_DAYS);
  const fmt = new Intl.NumberFormat(locale);
  const dateFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const totals = {
    day: packages.reduce((total, pkg) => total + pkg.recent.day, 0),
    week: packages.reduce((total, pkg) => total + pkg.recent.week, 0),
    month: packages.reduce((total, pkg) => total + pkg.recent.month, 0),
  };
  const stale = packages.some((pkg) => pkg.stale);

  return (
    <>
      <header className="signal-pypi-hero">
        <ContextBackLink href={localizePath('/recursos/', lang)} label={t('Volver a recursos', 'Back to resources')} />
        <span className="signal-eyebrow">{t('Recursos · datos abiertos', 'Resources · open data')}</span>
        <h1>
          {t('Mis paquetes de PyPI, ', 'My PyPI packages, ')}
          <em>{t('en números.', 'in numbers.')}</em>
        </h1>
        <p>
          {t(
            'Descargas diarias, versión y actividad de GitHub de lo que publico en PyPI. Los datos son públicos (pypistats.org, PyPI y GitHub) y se actualizan todos los días; abajo explico qué significan y qué no.',
            'Daily downloads, version and GitHub activity of what I publish on PyPI. The data is public (pypistats.org, PyPI and GitHub) and refreshed every day; below I explain what it means and what it does not.',
          )}
        </p>
      </header>

      <section className="signal-pypi-section" aria-label={t('Resumen', 'Summary')}>
        <div className="signal-pypi-cards">
          {[
            { label: t('Último día', 'Last day'), value: totals.day },
            { label: t('Últimos 7 días', 'Last 7 days'), value: totals.week },
            { label: t('Últimos 30 días', 'Last 30 days'), value: totals.month },
            { label: t('Paquetes', 'Packages'), value: packages.length },
          ].map((card) => (
            <div key={card.label} className="signal-pypi-card">
              <span>{card.label}</span>
              <strong>{fmt.format(card.value)}</strong>
            </div>
          ))}
        </div>
        <p className="signal-pypi-fine">{t('Descargas sumadas de todos los paquetes, sin espejos. El último día es el último que PyPI ya publicó (suele tener un día de retraso).', 'Downloads added up across all packages, mirrors excluded. The last day is the latest one PyPI has already published (usually a day behind).')}</p>
      </section>

      <section className="signal-pypi-section" aria-labelledby="pypi-chart">
        <div className="signal-pypi-head">
          <span className="signal-eyebrow">{t('Evolución', 'Trend')}</span>
          <h2 id="pypi-chart">{t('Descargas por día, por paquete.', 'Downloads per day, by package.')}</h2>
          <p>{t(`Los últimos ${dates.length} días con datos. Cada color es un paquete.`, `The last ${dates.length} days with data. Each color is a package.`)}</p>
        </div>
        <div className="signal-pypi-panel">
          <div className="signal-pypi-chartwrap">
            <StackedBars packages={packages} dates={dates} locale={locale} label={t('Gráfico de barras apiladas con las descargas diarias de cada paquete', 'Stacked bar chart with the daily downloads of each package')} />
          </div>
          <ul className="signal-pypi-legend">
            {packages.map((pkg, index) => (
              <li key={pkg.name}><i style={{ background: PALETTE[index % PALETTE.length] }} aria-hidden="true" />{pkg.name}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="signal-pypi-section" aria-labelledby="pypi-packages">
        <div className="signal-pypi-head">
          <span className="signal-eyebrow">{t('Paquete por paquete', 'Package by package')}</span>
          <h2 id="pypi-packages">{t('Qué hay publicado.', 'What is published.')}</h2>
        </div>
        <div className="signal-pypi-grid-cards">
          {packages.map((pkg, index) => (
            <article key={pkg.name} className="signal-pypi-pkg">
              <div className="signal-pypi-pkg__top">
                <h3>
                  <a href={`https://pypi.org/project/${pkg.name}/`} target="_blank" rel="noopener noreferrer">{pkg.name}</a>
                </h3>
                {pkg.version ? <span className="signal-pypi-badge">v{pkg.version}</span> : null}
              </div>
              {pkg.summary ? <p className="signal-pypi-pkg__summary">{pkg.summary}</p> : null}
              <dl className="signal-pypi-nums">
                <div><dt>{t('Día', 'Day')}</dt><dd>{fmt.format(pkg.recent.day)}</dd></div>
                <div><dt>{t('7 días', '7 days')}</dt><dd>{fmt.format(pkg.recent.week)}</dd></div>
                <div><dt>{t('30 días', '30 days')}</dt><dd>{fmt.format(pkg.recent.month)}</dd></div>
              </dl>
              <Spark points={pkg.history} color={PALETTE[index % PALETTE.length]} />
              <p className="signal-pypi-pkg__meta">
                {pkg.releasedAt ? <span>{t('Última versión: ', 'Latest release: ')}{dateFmt.format(new Date(pkg.releasedAt))}</span> : null}
                {pkg.github ? (
                  <span>
                    <a href={pkg.github.url} target="_blank" rel="noopener noreferrer">GitHub</a> · ★ {fmt.format(pkg.github.stars)} · {fmt.format(pkg.github.forks)} forks
                  </span>
                ) : null}
                {pkg.homebrew ? <span>Homebrew: <code>brew install {pkg.homebrew}</code></span> : null}
                {pkg.stale ? <span className="signal-pypi-stale">{t('No se pudo actualizar hoy; se muestran los últimos datos conocidos.', 'Could not be refreshed today; showing the last known data.')}</span> : null}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="signal-pypi-section" aria-labelledby="pypi-notes">
        <div className="signal-pypi-head">
          <span className="signal-eyebrow">{t('Con honestidad', 'In all honesty')}</span>
          <h2 id="pypi-notes">{t('Cómo leer estas cifras.', 'How to read these numbers.')}</h2>
        </div>
        <ul className="signal-pypi-notes">
          <li><b>{t('Son descargas, no usuarios.', 'They are downloads, not users.')}</b> {t('Una persona que reinstala, un CI que corre en cada commit o un bot cuentan como descargas. Se excluyen los espejos, pero no el resto.', 'Someone who reinstalls, a CI that runs on every commit or a bot all count as downloads. Mirrors are excluded, the rest is not.')}</li>
          <li><b>{t('Homebrew no publica estadísticas de taps propios.', 'Homebrew does not publish statistics for custom taps.')}</b> {t('La fórmula de ia-router baja el código fuente desde PyPI, así que esas instalaciones aparecen acá mezcladas con otras descargas y no se pueden separar.', 'The ia-router formula downloads the source from PyPI, so those installs show up here mixed with other downloads and cannot be told apart.')}</li>
          <li><b>{t('Un paquete nuevo arranca con un pico.', 'A new package starts with a spike.')}</b> {t('Los primeros días suelen incluir escaneos automáticos y pruebas propias; la tendencia dice más que un día suelto.', 'The first days usually include automated scans and my own tests; the trend says more than a single day.')}</li>
          <li><b>{t('Los datos tienen retraso.', 'The data lags.')}</b> {t('pypistats.org publica con aproximadamente un día de demora y guarda unos 180 días.', 'pypistats.org publishes with roughly a day of delay and keeps about 180 days.')}</li>
        </ul>
      </section>

      <section className="signal-pypi-section signal-pypi-source" aria-label={t('Fuentes', 'Sources')}>
        <p>
          {t('Fuentes: ', 'Sources: ')}
          <a href="https://pypistats.org/" target="_blank" rel="noopener noreferrer">pypistats.org</a>, <a href="https://pypi.org/" target="_blank" rel="noopener noreferrer">PyPI</a> {t('y', 'and')} <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">GitHub</a>.
          {stats.generatedAt ? <> {t('Actualizado el ', 'Updated on ')}{dateFmt.format(new Date(stats.generatedAt))}.</> : null}
          {stale ? <> {t('Algún paquete usa datos de la última actualización exitosa.', 'Some package uses data from the last successful refresh.')}</> : null}
        </p>
        <p>
          <Link href={localizePath('/recursos/ia-router/', lang)}>{t('Conocé ia-router, el paquete más reciente →', 'Meet ia-router, the newest package →')}</Link>
        </p>
      </section>
    </>
  );
}
