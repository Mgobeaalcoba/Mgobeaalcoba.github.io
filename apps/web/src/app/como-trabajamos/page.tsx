import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import JsonLd from "@/components/shared/JsonLd";
import { absoluteUrl, buildLocalizedMetadata } from "@/lib/localizedMetadata";
import { STUDIO_STEPS } from "@/lib/studioContent";

export const metadata: Metadata = buildLocalizedMetadata({
  path: "/como-trabajamos/",
  locale: "es",
  title: "Cómo trabajamos: proceso de consultoría en automatización e IA",
  description:
    "Entender, diseñar, construir y acompañar: el proceso de MGA para proyectos de agentes de IA, automatización, software y datos, con alcance y entregas acordados.",
});

const STEPS = STUDIO_STEPS.map((step, index) => ({
  n: `0${index + 1}`,
  title: step.title.es,
  text: step.body.es,
}));

const schema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo trabaja MGA Tech Consulting",
  description:
    "Proceso en 4 etapas para proyectos de automatización, IA y datos.",
  inLanguage: "es",
  url: absoluteUrl("/como-trabajamos/"),
  step: STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.text,
  })),
};

export default function HowWeWorkPage() {
  return (
    <>
      <Navbar />
      <JsonLd data={schema} />
      <main id="main-content" className="signal-privacy">
        <div className="signal-privacy__eyebrow">MGA / PROCESO</div>
        <h1>
          Cómo trabajamos.
          <br />
          <span>Cuatro etapas claras.</span>
        </h1>
        <p className="signal-privacy__lead">
          Partimos de tu desafío y construimos con vos. Agentes de IA,
          automatizaciones, software y datos: cada proyecto empieza por entender
          qué necesita tu equipo.
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
          ¿Querés empezar? Escribinos a{" "}
          <a href="mailto:hola@mgatc.com">hola@mgatc.com</a> o mirá los{" "}
          <a href="/servicios/">servicios con precio y alcance definidos</a>. El
          diagnóstico es un servicio pago; el valor aplicable se descuenta si
          avanzamos con la implementación.
        </p>
      </main>
      <Footer />
    </>
  );
}
