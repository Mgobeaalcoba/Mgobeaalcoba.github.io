import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ContextBackLink from "@/components/shared/ContextBackLink";
import { DASHBOARDS } from "@/lib/indec/types";
import { SITE_URL } from "@/lib/site";

export function indecMetadata(index: number): Metadata {
  const d = DASHBOARDS[index];
  const url = `${SITE_URL}/recursos/${d.slug}/`;
  return {
    title: `${d.title}: dashboard interactivo de Argentina | MGA`,
    description: `${d.question} ${d.description} Datos del INDEC, gráficos interactivos e informe de resultados.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${d.title} · Argentina en datos`,
      description: d.description,
      url,
      locale: "es_AR",
      type: "website",
    },
  };
}
export default function IndecPage({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  const d = DASHBOARDS[index];
  return (
    <main
      id="main-content"
      className={`min-h-screen indec-page indec-page--${d.color}`}
    >
      <Navbar />
      <div className="indec-container">
        <header className="indec-hero">
          <ContextBackLink
            href="/recursos/#argentina-en-datos"
            label="Volver a recursos"
          />
          <div className="indec-hero__top">
            <span className="signal-eyebrow">MGA / Argentina en datos</span>
            <span className="indec-edition">
              LAB {d.number} <i /> INDEC
            </span>
          </div>
          <h1>
            {d.title}
            <em>en perspectiva.</em>
          </h1>
          <div className="indec-hero__bottom">
            <p>
              {d.description} Cambiá los parámetros y construí tu propia
              lectura.
            </p>
            <a className="indec-hero__anchor" href="#dashboard">
              Explorar dashboard <span aria-hidden="true">↘</span>
            </a>
          </div>
        </header>
        <nav className="indec-page-tabs" aria-label="Dashboards de Argentina">
          {DASHBOARDS.map((item, i) => (
            <Link
              key={item.slug}
              href={`/recursos/${item.slug}/`}
              aria-current={index === i ? "page" : undefined}
            >
              <span>{item.number}</span>
              {item.title}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <div
          id="dashboard"
          className="indec-dashboard"
          data-analytics-surface={`indec_${d.slug.replaceAll("-", "_")}`}
        >
          {children}
        </div>
        <footer className="indec-data-footer">
          <span>MGA / Data & Analytics</span>
          <p>
            Fuente primaria:{" "}
            <a
              href="https://api.indec.gob.ar/"
              target="_blank"
              rel="noopener noreferrer"
            >
              INDEC
            </a>
            . Los cálculos e interpretaciones de estas páginas son elaboraciones
            propias.
          </p>
          <Link href="/servicios/">
            Convertí los datos de tu negocio en decisiones →
          </Link>
        </footer>
      </div>
      <Footer />
    </main>
  );
}
export function MissingData() {
  return (
    <section className="indec-empty">
      <h2>La fuente todavía no tiene un snapshot disponible.</h2>
      <p>Volvé a consultar después de la próxima actualización de datos.</p>
      <a
        href="https://api.indec.gob.ar/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Consultar la fuente oficial
      </a>
    </section>
  );
}
