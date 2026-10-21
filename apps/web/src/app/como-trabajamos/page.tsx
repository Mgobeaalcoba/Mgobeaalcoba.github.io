import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import JsonLd from '@/components/shared/JsonLd';
import { absoluteUrl, buildLocalizedMetadata } from '@/lib/localizedMetadata';

export const metadata: Metadata = buildLocalizedMetadata({
  path: '/como-trabajamos/',
  locale: 'es',
  title: 'Cómo trabajamos: proceso de consultoría en automatización e IA',
  description:
    'Las 4 etapas con las que MGA Tech Consulting lleva un proyecto de automatización, IA o datos desde el diagnóstico gratuito hasta el soporte continuo.',
});

const STEPS = [
  { n: '01', title: 'Diagnóstico gratuito', text: 'Una reunión de 30 minutos para identificar cuellos de botella y oportunidades de automatización en tu operación.' },
  { n: '02', title: 'Propuesta personalizada', text: 'Una solución a medida con ROI estimado, un cronograma realista y las tecnologías específicas que vamos a usar.' },
  { n: '03', title: 'Implementación ágil', text: 'Sprints cortos con MVPs funcionales en 2 a 4 semanas, para validar valor temprano y ajustar sobre la marcha.' },
  { n: '04', title: 'Soporte continuo', text: 'Capacitamos a tu equipo y acompañamos después del lanzamiento para que la solución siga funcionando.' },
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo trabaja MGA Tech Consulting',
  description: 'Proceso en 4 etapas para proyectos de automatización, IA y datos.',
  inLanguage: 'es',
  url: absoluteUrl('/como-trabajamos/'),
  step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text })),
};

export default function HowWeWorkPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={schema} />
      <main id="main-content" className="signal-privacy">
        <div className="signal-privacy__eyebrow">MGA / PROCESO</div>
        <h1>Cómo trabajamos.<br /><span>Cuatro etapas claras.</span></h1>
        <p className="signal-privacy__lead">
          En MGA Tech Consulting ayudamos a PyMEs a automatizar procesos, aplicar IA y ordenar sus datos. Este es el camino que seguimos en cada proyecto.
        </p>
        <div className="signal-privacy__grid">
          {STEPS.map((s) => (
            <section key={s.n}>
              <span>{s.n}</span>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
        <p className="signal-privacy__lead">
          ¿Querés empezar? Escribinos a <a href="mailto:hola@mgatc.com">hola@mgatc.com</a> o mirá los <a href="/servicios/">servicios con precio y alcance definidos</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
