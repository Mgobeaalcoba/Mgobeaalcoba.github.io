"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollTracker from "@/components/shared/ScrollTracker";
import ClientPortfolio from "@/components/consulting/ClientPortfolio";
import SystemArtwork from "@/components/consulting/SystemArtwork";
import WorkflowDemo from "@/components/consulting/WorkflowDemo";
import { openContactModal } from "@/components/shared/ContactModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath } from "@/lib/i18n-routes";
import { STUDIO_FAQ, STUDIO_SERVICES, STUDIO_STEPS } from "@/lib/studioContent";
import { events } from "@/lib/gtag";

export default function ConsultingPageClient() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const contact = (source: string, service?: string) => {
    events.contactClick(source);
    openContactModal(
      source,
      service
        ? es
          ? `Quiero conversar sobre ${service.toLowerCase()} para mi negocio.`
          : `I would like to discuss ${service.toLowerCase()} for my business.`
        : es
          ? "Quiero conversar sobre un proyecto. Mi idea o desafío es: "
          : "I would like to discuss a project. My idea or challenge is: "
    );
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="mga-home">
        <ScrollTracker site_section="consulting" />
        <section
          className="mga-hero mga-container"
          aria-labelledby="home-title"
        >
          <div className="mga-hero__eyebrow">
            <span className="mga-kicker">
              <span className="mga-status-dot" />
              {es
                ? "Estudio de tecnología aplicada"
                : "Applied technology studio"}
            </span>
            <span>BUENOS AIRES ↗ {es ? "EL MUNDO" : "THE WORLD"}</span>
          </div>
          <div className="mga-hero__grid">
            <div className="mga-hero__copy">
              <h1 id="home-title">
                {es ? (
                  <>
                    Menos tareas.
                    <br />
                    Más <em>posibilidades.</em>
                  </>
                ) : (
                  <>
                    Less busywork.
                    <br />
                    More <em>possibilities.</em>
                  </>
                )}
              </h1>
              <p>
                {es
                  ? "Agentes de IA, automatizaciones y software a medida para que tu negocio dé el próximo paso."
                  : "AI agents, automation and custom software to help your business take its next step."}
              </p>
              <div className="mga-hero__actions">
                <button
                  className="mga-button mga-button--lime"
                  onClick={() => contact("studio_hero")}
                >
                  {es
                    ? "Hablemos de tu proyecto"
                    : "Let’s talk about your project"}
                  <ArrowUpRight size={19} />
                </button>
                <a className="mga-text-link" href="#proyectos">
                  {es ? "Explorá nuestro trabajo" : "Explore our work"}
                  <ArrowDown size={16} />
                </a>
              </div>
            </div>
            <SystemArtwork />
          </div>
          <div className="mga-hero__foot">
            <span>
              {es
                ? "Pensamos con vos. Construimos para tu equipo."
                : "Thinking with you. Building for your team."}
            </span>
            <a href="#servicios">
              {es ? "Descubrí qué podemos hacer" : "Discover what we can do"}
              <ArrowDownRight size={19} />
            </a>
          </div>
        </section>
        <div className="mga-project-strip">
          <div className="mga-container">
            <span>
              {es
                ? "Algunos de nuestros proyectos"
                : "A selection of our projects"}
            </span>
            <a href="#proyectos">
              Neil<span>↗</span>
            </a>
            <a href="#proyectos">
              El Portugués<span>↗</span>
            </a>
            <a href="/trabajos/henry/">
              Henry<span>_</span>
            </a>
          </div>
        </div>

        <section
          id="servicios"
          className="mga-container mga-section"
          aria-labelledby="services-title"
        >
          <span id="soluciones" className="mga-anchor" />
          <div className="mga-section__heading">
            <div>
              <span className="mga-kicker">
                01 / {es ? "Qué hacemos" : "What we do"}
              </span>
              <h2 id="services-title">
                {es ? (
                  <>
                    Tecnología que
                    <br />
                    se pone a trabajar.
                  </>
                ) : (
                  <>
                    Technology that
                    <br />
                    gets to work.
                  </>
                )}
              </h2>
            </div>
            <p>
              {es
                ? "Partimos de tu desafío y elegimos cómo resolverlo. Combinamos criterio de negocio, diseño e ingeniería para construir algo que tu equipo use."
                : "We start with your challenge and choose how to solve it. We combine business judgment, design and engineering to build something your team will use."}
            </p>
          </div>
          <div className="mga-capabilities">
            {STUDIO_SERVICES.map((service, index) => (
              <details
                key={service.title.es}
                name="mga-services"
                open={index === 0}
              >
                <summary>
                  <span className="mga-capabilities__index">0{index + 1}</span>
                  <h3>{service.title[lang]}</h3>
                  <span className="mga-capabilities__hint">
                    {service.hint[lang]}
                  </span>
                  <Plus size={23} />
                </summary>
                <div className="mga-capabilities__body">
                  <p>{service.body[lang]}</p>
                  <div>
                    <ul>
                      {service.items.map((item) => (
                        <li key={item.es}>{item[lang]}</li>
                      ))}
                    </ul>
                    {service.href ? (
                      <Link
                        className="mga-text-link"
                        href={localizePath(service.href, lang)}
                      >
                        {es ? "Conocé el servicio" : "Explore the service"}
                        <ArrowUpRight size={16} />
                      </Link>
                    ) : (
                      <button
                        className="mga-text-link"
                        onClick={() =>
                          contact("studio_software", service.title[lang])
                        }
                      >
                        {es
                          ? "Contanos qué querés construir"
                          : "Tell us what you want to build"}
                        <ArrowUpRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>
          <div className="mga-services-note">
            <p>
              {es
                ? "¿Buscás una mirada experta antes de construir?"
                : "Need an expert perspective before you build?"}
            </p>
            <Link
              className="mga-text-link"
              href={localizePath("/servicios/", lang)}
            >
              {es
                ? "Diagnósticos, auditorías y mentorías"
                : "Diagnostics, audits & mentoring"}
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <WorkflowDemo />
        </section>

        <div className="mga-container">
          <ClientPortfolio />
        </div>

        <section
          id="estudio"
          className="mga-studio"
          aria-labelledby="studio-title"
        >
          <div className="mga-container">
            <span className="mga-kicker">
              03 / {es ? "El estudio" : "The studio"}
            </span>
            <div className="mga-studio__intro">
              <h2 id="studio-title">
                {es ? (
                  <>
                    La tecnología cambia.
                    <br />
                    <em>El criterio importa.</em>
                  </>
                ) : (
                  <>
                    Technology changes.
                    <br />
                    <em>Judgment matters.</em>
                  </>
                )}
              </h2>
              <ArrowDownRight size={60} strokeWidth={1} />
            </div>
            <div className="mga-studio__grid">
              <Link href="/portfolio/" className="mga-founder">
                <Image
                  src="/images/profile.png"
                  alt="Mariano Gobea Alcoba, fundador de MGA Tech Consulting"
                  width={88}
                  height={100}
                />
                <div>
                  <strong>Mariano Gobea Alcoba</strong>
                  <span>
                    {es
                      ? "Fundador · Data & Analytics · IA"
                      : "Founder · Data & Analytics · AI"}
                  </span>
                  <span>
                    {es ? "Conocé mi recorrido" : "Explore my background"}
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
              <div>
                <p>
                  {es
                    ? "MGA es una consultora independiente que conecta estrategia y ejecución. Trabajás directamente con quien entiende el problema y lleva adelante la solución."
                    : "MGA is an independent consultancy connecting strategy and execution. You work directly with the person who understands the problem and builds the solution."}
                </p>
                <p>
                  {es
                    ? "Nos interesan las preguntas correctas, los sistemas que se entienden y las entregas que tu equipo puede hacer propias."
                    : "We care about the right questions, systems people understand and work your team can make its own."}
                </p>
              </div>
            </div>
            <div className="mga-method-heading">
              <h3>
                {es
                  ? "Del primer «¿y si…?» a la entrega."
                  : "From the first “what if?” to delivery."}
              </h3>
              <Link href="/como-trabajamos/" className="mga-text-link">
                {es ? "Nuestro proceso" : "Our process"}
                <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="mga-method">
              {STUDIO_STEPS.map((step, index) => (
                <article key={index}>
                  <span>
                    0{index + 1}
                    <ArrowRight size={17} />
                  </span>
                  <h4>{step.title[lang]}</h4>
                  <p>{step.body[lang]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="mga-container mga-section mga-explore-section"
          aria-labelledby="ideas-title"
        >
          <div>
            <span className="mga-kicker">
              04 / {es ? "Conocimiento abierto" : "Open knowledge"}
            </span>
            <h2 id="ideas-title">
              {es ? (
                <>
                  También construimos
                  <br />
                  <em>en público.</em>
                </>
              ) : (
                <>
                  We also build
                  <br />
                  <em>in public.</em>
                </>
              )}
            </h2>
            <p>
              {es
                ? "Compartimos lo que probamos, lo que aprendemos y las herramientas que nos ayudan a trabajar mejor."
                : "We share what we test, what we learn and the tools that help us work better."}
            </p>
          </div>
          <div className="mga-explore-links">
            <Link href="/blog/">
              <span>01</span>
              <div>
                <h3>{es ? "Ideas y artículos" : "Ideas & articles"}</h3>
                <p>
                  {es
                    ? "IA, automatización y decisiones técnicas."
                    : "AI, automation and technical decisions."}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
            <Link href="/recursos/">
              <span>02</span>
              <div>
                <h3>{es ? "Herramientas abiertas" : "Open tools"}</h3>
                <p>
                  {es
                    ? "Datos, calculadoras y recursos para usar."
                    : "Data, calculators and resources to use."}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
            <Link href={localizePath("/agenthub/", lang)}>
              <span>03</span>
              <div>
                <h3>AgentHub</h3>
                <p>
                  {es
                    ? "Explorá agentes, capacidades y flujos."
                    : "Explore agents, capabilities and workflows."}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
          </div>
        </section>

        <section
          className="mga-container mga-section mga-faq"
          aria-labelledby="faq-title"
        >
          <div>
            <span className="mga-kicker">
              {es ? "Antes de empezar" : "Before we start"}
            </span>
            <h2 id="faq-title">
              {es ? "Hablemos claro." : "Let’s make it clear."}
            </h2>
          </div>
          <div>
            {STUDIO_FAQ.map((item) => (
              <details key={item.question.es}>
                <summary>
                  {item.question[lang]}
                  <Plus size={19} />
                </summary>
                <p>{item.answer[lang]}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="contacto"
          className="mga-contact"
          aria-labelledby="contact-title"
        >
          <div className="mga-container">
            <span className="mga-kicker">
              {es ? "Tu próximo paso" : "Your next step"}
            </span>
            <div className="mga-contact__heading">
              <h2 id="contact-title">
                {es ? (
                  <>
                    Eso que tenés
                    <br />
                    en mente.
                    <br />
                    <em>Hagámoslo.</em>
                  </>
                ) : (
                  <>
                    That thing
                    <br />
                    on your mind.
                    <br />
                    <em>Let’s build it.</em>
                  </>
                )}
              </h2>
              <button
                onClick={() => contact("studio_final_cta")}
                aria-label={
                  es
                    ? "Hablemos de tu proyecto"
                    : "Let’s talk about your project"
                }
              >
                <ArrowUpRight strokeWidth={1} />
              </button>
            </div>
            <div className="mga-contact__bottom">
              <p>
                {es
                  ? "Una idea, un proceso que frena o un producto por construir. Contanos dónde estás y pensemos el próximo paso."
                  : "An idea, a process holding you back or a product waiting to be built. Tell us where you are and let’s work out the next step."}
              </p>
              <a href="mailto:hola@mgatc.com">
                hola@mgatc.com
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
