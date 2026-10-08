import { readFileSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import ContextBackLink from '@/components/shared/ContextBackLink';
import PypiDashboard from '@/components/recursos/PypiDashboard';
import { localizePath } from '@/lib/i18n-routes';
import type { Language } from '@/contexts/LanguageContext';
import type { Stats } from '@/lib/pypiStats';

/** Read at build time: the prebuild script (scripts/sync-pypi-stats.mjs) refreshes this file before every build. */
function loadStats(): Stats {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), 'public/data/pypi-stats.json'), 'utf8')) as Stats;
  } catch {
    return { generatedAt: '', owner: '', packages: [] };
  }
}

/**
 * Interactive dashboard of the Python packages published on PyPI (data: pypistats.org, pypi.org and GitHub, refreshed before each build).
 * The server renders the page and reads the data; the dashboard itself is a client component (filters, parameters and charts).
 */
export default function PypiStatsPage({ lang }: { lang: Language }) {
  const t = <T,>(es: T, en: T): T => (lang === 'es' ? es : en);
  const stats = loadStats();
  const dateFmt = new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const stale = stats.packages.some((pkg) => pkg.stale);

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
            'Un panel interactivo con las descargas, la versión y la actividad de GitHub de lo que publico en PyPI. Filtrá por paquete, período, sistema operativo o versión de Python y respondé preguntas concretas. Los datos son públicos y se actualizan todos los días.',
            'An interactive dashboard with the downloads, version and GitHub activity of what I publish on PyPI. Filter by package, period, operating system or Python version and answer concrete questions. The data is public and refreshed every day.',
          )}
        </p>
      </header>

      <section className="signal-pypi-section signal-pypi-dash" aria-label={t('Panel de métricas', 'Metrics dashboard')}>
        {stats.packages.length ? <PypiDashboard stats={stats} lang={lang} /> : <p className="signal-pypi-fine">{t('Todavía no hay datos para mostrar.', 'There is no data to show yet.')}</p>}
      </section>

      <section className="signal-pypi-section" aria-labelledby="pypi-notes">
        <div className="signal-pypi-head">
          <span className="signal-eyebrow">{t('Con honestidad', 'In all honesty')}</span>
          <h2 id="pypi-notes">{t('Cómo leer estas cifras.', 'How to read these numbers.')}</h2>
        </div>
        <ul className="signal-pypi-notes">
          <li><b>{t('Son descargas, no usuarios.', 'They are downloads, not users.')}</b> {t('Una persona que reinstala, un CI que corre en cada commit o un bot cuentan como descargas. Se excluyen los espejos, pero no el resto.', 'Someone who reinstalls, a CI that runs on every commit or a bot all count as downloads. Mirrors are excluded, the rest is not.')}</li>
          <li><b>{t('Homebrew no publica estadísticas de taps propios.', 'Homebrew does not publish statistics for custom taps.')}</b> {t('La fórmula de ia-router baja el código fuente desde PyPI, así que esas instalaciones aparecen acá mezcladas con otras descargas y no se pueden separar.', 'The ia-router formula downloads the source from PyPI, so those installs show up here mixed with other downloads and cannot be told apart.')}</li>
          <li><b>{t('El sistema operativo suele ser “desconocido”.', 'The operating system is often “unknown”.')}</b> {t('Solo algunos clientes (sobre todo pip) informan su sistema y su versión de Python. El resto cae en “Desconocido”, por eso los porcentajes por sistema se calculan sobre los que sí informan.', 'Only some clients (mostly pip) report their system and Python version. The rest fall under “Unknown”, which is why the per-system percentages are computed over the ones that do report.')}</li>
          <li><b>{t('Un paquete nuevo arranca con un pico.', 'A new package starts with a spike.')}</b> {t('Los primeros días suelen incluir escaneos automáticos y pruebas propias; la tendencia dice más que un día suelto.', 'The first days usually include automated scans and my own tests; the trend says more than a single day.')}</li>
          <li><b>{t('Los datos tienen retraso y límite.', 'The data lags and has a limit.')}</b> {t('pypistats.org publica con aproximadamente un día de demora y guarda unos 180 días. PyPI no publica descargas por versión del paquete ni por país en una API abierta.', 'pypistats.org publishes with roughly a day of delay and keeps about 180 days. PyPI does not publish downloads per package version or per country in an open API.')}</li>
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
