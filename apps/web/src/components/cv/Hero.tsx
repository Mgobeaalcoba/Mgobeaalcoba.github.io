"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Loader2,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath } from "@/lib/i18n-routes";
import { events } from "@/lib/gtag";
import { getCareerExperienceLabel } from "@/lib/experience";

export default function Hero() {
  const { lang } = useLanguage();
  const es = lang === "es";
  const [downloading, setDownloading] = useState(false);
  const handleDownloadCV = async () => {
    if (downloading) return;
    setDownloading(true);
    events.downloadCV();
    try {
      const { generateCVPdf } = await import("@/lib/generatePdf");
      await generateCVPdf(lang);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <section
        className="mga-founder-hero mga-container"
        aria-labelledby="portfolio-title"
      >
        <div>
          <span className="mga-kicker">
            MGA / {es ? "Detrás del estudio" : "Behind the studio"}
          </span>
          <h1 id="portfolio-title">
            Mariano
            <br />
            <em>Gobea Alcoba.</em>
          </h1>
          <p className="mga-founder-hero__role">
            Data &amp; Analytics Technical Leader
          </p>
          <p className="mga-founder-hero__lead">
            {es
              ? "Construyo sistemas de datos, productos de IA y equipos que convierten complejidad técnica en decisiones de negocio."
              : "I build data systems, AI products and teams that turn technical complexity into business decisions."}
          </p>
          <div className="mga-founder-hero__actions">
            <Link
              href={localizePath("/", lang)}
              className="mga-button mga-button--lime"
              onClick={() => events.consultingClick()}
            >
              {es ? "Conocé el estudio" : "Explore the studio"}
              <ArrowUpRight size={18} />
            </Link>
            <button
              className="mga-text-link"
              onClick={handleDownloadCV}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Download size={16} />
              )}
              {downloading
                ? es
                  ? "Generando…"
                  : "Generating…"
                : es
                  ? "Descargar CV"
                  : "Download CV"}
            </button>
          </div>
          <div
            className="signal-social-links"
            aria-label={es ? "Perfiles profesionales" : "Professional profiles"}
          >
            <a
              href="https://www.linkedin.com/in/mariano-gobea-alcoba/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
            <a
              href="https://github.com/Mgobeaalcoba"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} />
              GitHub
            </a>
            <a href="mailto:mariano@mgatc.com">
              <Mail size={16} />
              Email
            </a>
          </div>
          <dl className="mga-founder-facts">
            <div>
              <dt>{es ? "Experiencia" : "Experience"}</dt>
              <dd>{getCareerExperienceLabel(lang)} · Data &amp; Analytics</dd>
            </div>
            <div>
              <dt>{es ? "Foco" : "Focus"}</dt>
              <dd>{es ? "Datos, IA y producto" : "Data, AI & product"}</dd>
            </div>
            <div>
              <dt>{es ? "Base" : "Based in"}</dt>
              <dd>Buenos Aires · {es ? "Remoto" : "Remote"}</dd>
            </div>
          </dl>
        </div>
        <figure className="mga-founder-hero__portrait">
          <div>
            <Image
              src="/images/profile.png"
              alt={
                es
                  ? "Mariano Gobea Alcoba, fundador de MGA"
                  : "Mariano Gobea Alcoba, founder of MGA"
              }
              fill
              sizes="(max-width: 560px) 100vw, 35vw"
              priority
            />
          </div>
          <figcaption>
            <span>Mariano Gobea Alcoba</span>
            <span>{es ? "Fundador de MGA" : "Founder of MGA"}</span>
          </figcaption>
        </figure>
      </section>
      <nav
        className="mga-section-nav mga-container"
        aria-label={es ? "Secciones del portfolio" : "Portfolio sections"}
      >
        <a href="#about">{es ? "Perfil" : "Profile"}</a>
        <a href="#experience">{es ? "Recorrido" : "Experience"}</a>
        <a href="#projects">{es ? "Proyectos" : "Projects"}</a>
        <a href="#education">{es ? "Formación" : "Learning"}</a>
        <a href="#contact">{es ? "Contacto" : "Contact"}</a>
      </nav>
    </>
  );
}
