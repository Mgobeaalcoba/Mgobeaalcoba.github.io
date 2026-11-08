"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import StudioPageIntro from "@/components/shared/StudioPageIntro";
import { useLanguage } from "@/contexts/LanguageContext";
import { openContactModal } from "@/components/shared/ContactModal";

const CONTENT = {
  es: {
    eyebrow: "Racing Club / Estrategia Data & GenAI",
    title: "Tres desafíos comerciales.",
    emphasis: "Una estrategia de datos.",
    lead: "Organizamos las necesidades de datos de Racing Club en tres frentes conectados: gestión comercial, valor para sponsors y comercio unificado. El trabajo de consultoría definió una arquitectura compartida y una hoja de ruta para avanzar por entregables.",
    back: "Volver a proyectos",
    brief: "El trabajo de consultoría",
    scope: [
      "Diagnóstico y prioridades",
      "Arquitectura de datos",
      "Hoja de ruta de 90 días",
    ],
    challengeLabel: "01 / El desafío",
    challengeTitle: "Conectar la información con las decisiones.",
    challengeBody:
      "Ventas, socios, tienda y exposición de marcas planteaban preguntas distintas, pero compartían una necesidad: contar con información consistente. El diagnóstico permitió ordenar esos problemas y diseñar una base común para resolverlos.",
    modules: [
      {
        title: "Fundación de datos comercial",
        body: "Diseñamos una base para integrar ventas, márgenes, socios y productos, con definiciones compartidas y transformaciones versionadas.",
        output:
          "Modelo comercial, diccionario de datos, tablero ejecutivo y segmentación RFM.",
      },
      {
        title: "Medición de sponsors",
        body: "Estructuramos un sistema de medición que conecta exposición de marcas en video y redes con un modelo de valor de medios.",
        output:
          "Diseño de captura, detección de logos, indicadores de exposición e informes por marca.",
      },
      {
        title: "Comercio unificado",
        body: "Definimos una capa de datos para reunir la operación online y física de Locademia, independiente de la plataforma de venta.",
        output:
          "Modelo por producto y canal, margen por SKU y criterios para evaluar proveedores y plataformas.",
      },
    ],
    architectureLabel: "02 / La arquitectura",
    architectureTitle: "Una base. Varios casos de uso.",
    architectureBody:
      "La arquitectura de referencia evita construir tres soluciones aisladas. La ingesta, las transformaciones y las definiciones de negocio se comparten; cada frente consume la información que necesita.",
    architecture: [
      {
        title: "Conectar",
        items: "Fuentes comerciales · socios · tienda · medios",
        detail: "Ingesta con Python y n8n",
      },
      {
        title: "Organizar",
        items: "Modelo comercial y capas Bronze, Silver y Gold",
        detail: "BigQuery y transformaciones con dbt",
      },
      {
        title: "Decidir",
        items: "Gestión comercial · sponsors · comercio",
        detail: "Looker Studio / Power BI y análisis con GenAI",
      },
    ],
    deliveryLabel: "03 / Los entregables",
    deliveryTitle: "Un plan concreto para ejecutar y transferir.",
    deliveries: [
      "Mapa de necesidades y casos de uso priorizados.",
      "Arquitectura de referencia con una base de datos compartida.",
      "Definición de indicadores y modelos para los tres frentes.",
      "Roadmap de 90 días con implementación incremental.",
      "Modelo de acompañamiento y transferencia al equipo interno.",
    ],
    takeaway:
      "El criterio que ordenó el trabajo: independizar el dato de las plataformas y empezar por la base que comparten los casos de uso.",
    ctaLabel: "Para tu organización",
    ctaTitle: "Tus datos también pueden trabajar juntos.",
    cta: "Conversemos sobre tu caso",
  },
  en: {
    eyebrow: "Racing Club / Data & GenAI strategy",
    title: "Three business challenges.",
    emphasis: "One data strategy.",
    lead: "We organized Racing Club’s data needs into three connected areas: commercial management, sponsor value and unified commerce. The consulting work defined a shared architecture and a delivery-based roadmap.",
    back: "Back to projects",
    brief: "The consulting work",
    scope: ["Assessment and priorities", "Data architecture", "90-day roadmap"],
    challengeLabel: "01 / The challenge",
    challengeTitle: "Connect information with decisions.",
    challengeBody:
      "Sales, members, retail and brand exposure raised different questions but shared one need: consistent information. The assessment organized these challenges around a common foundation.",
    modules: [
      {
        title: "Commercial data foundation",
        body: "We designed a foundation for sales, margins, members and products, with shared definitions and versioned transformations.",
        output:
          "Commercial model, data dictionary, executive dashboard and RFM segmentation.",
      },
      {
        title: "Sponsor measurement",
        body: "We structured a measurement system connecting brand exposure in video and social media with a media-value model.",
        output:
          "Capture design, logo detection, exposure indicators and brand-specific reports.",
      },
      {
        title: "Unified commerce",
        body: "We defined a data layer to bring together Locademia’s online and physical retail operations, independent of its commerce platform.",
        output:
          "Product/channel model, SKU margins and criteria for evaluating providers and platforms.",
      },
    ],
    architectureLabel: "02 / The architecture",
    architectureTitle: "One foundation. Several use cases.",
    architectureBody:
      "The reference architecture avoids three isolated solutions. Ingestion, transformations and business definitions are shared; each area consumes the information it needs.",
    architecture: [
      {
        title: "Connect",
        items: "Commercial sources · members · retail · media",
        detail: "Python and n8n ingestion",
      },
      {
        title: "Organize",
        items: "Commercial model and Bronze, Silver and Gold layers",
        detail: "BigQuery and dbt transformations",
      },
      {
        title: "Decide",
        items: "Commercial management · sponsors · commerce",
        detail: "Looker Studio / Power BI and GenAI analysis",
      },
    ],
    deliveryLabel: "03 / The deliverables",
    deliveryTitle: "A concrete execution and handover plan.",
    deliveries: [
      "A map of needs and prioritized use cases.",
      "Reference architecture with a shared data foundation.",
      "Indicator and model definitions for the three areas.",
      "A 90-day incremental implementation roadmap.",
      "A support and knowledge-transfer model for the internal team.",
    ],
    takeaway:
      "The principle behind the work: decouple data from platforms and start with the foundation shared by the use cases.",
    ctaLabel: "For your organization",
    ctaTitle: "Your data can work together too.",
    cta: "Let’s discuss your case",
  },
};

export default function RacingCaseStudy() {
  const { lang } = useLanguage();
  const c = CONTENT[lang];
  return (
    <div className="mga-case">
      <StudioPageIntro
        eyebrow={c.eyebrow}
        title={
          <>
            {c.title}
            <br />
            <em>{c.emphasis}</em>
          </>
        }
        description={c.lead}
        aside={
          <div className="mga-case-brief">
            <span className="mga-kicker">{c.brief}</span>
            {c.scope.map((item, index) => (
              <div key={item}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        }
      >
        <Link href="/#proyectos" className="mga-text-link">
          ← {c.back}
        </Link>
      </StudioPageIntro>
      <section className="mga-case-section mga-container">
        <div className="mga-case-heading">
          <div>
            <span className="mga-kicker">{c.challengeLabel}</span>
            <h2>{c.challengeTitle}</h2>
          </div>
          <p>{c.challengeBody}</p>
        </div>
        <div className="mga-case-grid">
          {c.modules.map((module, index) => (
            <article key={module.title}>
              <span className="mga-kicker">0{index + 1}</span>
              <h3>{module.title}</h3>
              <p>{module.body}</p>
              <div className="mga-case-output">
                <ArrowUpRight size={17} />
                <p>{module.output}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mga-case-section mga-container">
        <div className="mga-case-heading">
          <div>
            <span className="mga-kicker">{c.architectureLabel}</span>
            <h2>{c.architectureTitle}</h2>
          </div>
          <p>{c.architectureBody}</p>
        </div>
        <ol className="mga-case-architecture">
          {c.architecture.map((stage, index) => (
            <li key={stage.title}>
              <span className="mga-kicker">
                0{index + 1} / {stage.title}
              </span>
              <h3>{stage.items}</h3>
              <p>{stage.detail}</p>
              {index < c.architecture.length - 1 && (
                <ArrowRight size={19} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </section>
      <section className="mga-case-section mga-container">
        <div className="mga-case-heading">
          <div>
            <span className="mga-kicker">{c.deliveryLabel}</span>
            <h2>{c.deliveryTitle}</h2>
          </div>
          <ul className="mga-case-deliveries">
            {c.deliveries.map((item) => (
              <li key={item}>
                <ArrowUpRight size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="mga-case-takeaway">{c.takeaway}</p>
      </section>
      <section className="signal-offer-final">
        <span>{c.ctaLabel}</span>
        <h2>{c.ctaTitle}</h2>
        <button
          type="button"
          className="signal-offer-button"
          onClick={() => openContactModal("work_racing")}
        >
          {c.cta}
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}
