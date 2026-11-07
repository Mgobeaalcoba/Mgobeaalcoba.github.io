"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ClientPortfolio() {
  const { lang } = useLanguage();
  const es = lang === "es";
  return (
    <section
      id="proyectos"
      className="mga-section mga-work"
      aria-labelledby="work-title"
    >
      <span id="casos" className="mga-anchor" />
      <span id="proyectos-clientes" className="mga-anchor" />
      <div className="mga-section__heading">
        <div>
          <span className="mga-kicker">
            02 / {es ? "Trabajo seleccionado" : "Selected work"}
          </span>
          <h2 id="work-title">
            {es ? (
              <>
                Las ideas se ven
                <br />
                en lo que hacemos.
              </>
            ) : (
              <>
                Ideas show up
                <br />
                in what we build.
              </>
            )}
          </h2>
        </div>
        <p>
          {es
            ? "Productos, formación y propuestas. Cada trabajo tiene un contexto, una disciplina y algo concreto para explorar."
            : "Products, education and proposals. Every project has a context, a discipline and something tangible to explore."}
        </p>
      </div>
      <div className="mga-work__grid">
        <a
          className="mga-work-card"
          href="https://www.mgatc.com/neil-site/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            es
              ? "Visitar sitio de Neil Climatizadores (abre en otra pestaña)"
              : "Visit Neil Climatizadores (opens a new tab)"
          }
        >
          <div className="mga-work-card__visual mga-work-card__visual--neil">
            <div className="mga-work-card__visual-top">
              <span>NEIL</span>
              <span>WEB / {es ? "INDUSTRIA" : "INDUSTRY"}</span>
            </div>
            <div className="mga-neil-sheet">
              <span>
                {es ? "Climatización." : "Climate control."}
                <br />
                <strong>{es ? "En movimiento." : "On the move."}</strong>
              </span>
              <Image
                src="/images/work-neil.webp"
                alt={
                  es
                    ? "Climatizador Neil HDK 2200"
                    : "Neil HDK 2200 climate control unit"
                }
                width={500}
                height={500}
              />
              <span>
                NEIL CLIMATIZADORES <ArrowUpRight size={18} />
              </span>
            </div>
            <span className="mga-work-card__floating">
              {es ? "Producto digital" : "Digital product"}
            </span>
          </div>
          <div className="mga-work-card__caption">
            <div>
              <h3>Neil Climatizadores</h3>
              <p>
                {es
                  ? "Sitio institucional y catálogo técnico multilenguaje."
                  : "Corporate website and multilingual technical catalog."}
              </p>
            </div>
            <ArrowUpRight size={25} />
          </div>
        </a>
        <a
          className="mga-work-card"
          href="/trabajos/henry/"
          aria-label={
            es
              ? "Leer caso Henry: diseño curricular de AI Automation"
              : "Read Henry case study: AI Automation curriculum design"
          }
        >
          <div className="mga-work-card__visual mga-work-card__visual--henry">
            <div className="mga-work-card__visual-top">
              <Image
                src="/logos/henry.svg"
                alt="Henry"
                width={100}
                height={18}
                style={{ width: 110, height: "auto" }}
              />
              <span>LEARNING / AI</span>
            </div>
            <div className="mga-henry-type">
              <span>Build.</span>
              <span>Automate.</span>
              <span>
                Repeat<span className="mga-henry-dot">.</span>
              </span>
            </div>
            <div className="mga-work-card__visual-bottom">
              <span>
                {es
                  ? "Diseñar cómo se aprende a construir."
                  : "Designing how people learn to build."}
              </span>
              <span>↗</span>
            </div>
          </div>
          <div className="mga-work-card__caption">
            <div>
              <h3>Henry / AI Automation</h3>
              <p>
                {es
                  ? "Diseño curricular para aprender con proyectos reales."
                  : "Curriculum design for learning through real projects."}
              </p>
            </div>
            <ArrowUpRight size={25} />
          </div>
        </a>
      </div>
      <div className="mga-work__more">
        <a
          href="https://www.mgatc.com/elportugues-site/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>El Portugués S.A.</span>
          <small>
            {es
              ? "Producto digital · Logística"
              : "Digital product · Logistics"}
          </small>
          <ArrowUpRight size={20} />
        </a>
        <a
          href="https://www.mgatc.com/racing-propuesta/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Racing Club</span>
          <small>
            {es ? "Propuesta · Data & GenAI" : "Proposal · Data & GenAI"}
          </small>
          <ArrowUpRight size={20} />
        </a>
        <a href="/trabajos/unicorn-academy/">
          <span>Unicorn Academy</span>
          <small>
            {es
              ? "Colaboración académica · En curso"
              : "Academic collaboration · In progress"}
          </small>
          <ArrowUpRight size={20} />
        </a>
      </div>
    </section>
  );
}
