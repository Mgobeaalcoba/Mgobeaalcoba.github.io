"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Brand from "./Brand";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath } from "@/lib/i18n-routes";
import { CONSENT_SETTINGS_EVENT } from "./ConsentBanner";

export default function Footer() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const es = lang === "es";
  const home = localizePath("/", lang);
  const portfolio = pathname.startsWith("/portfolio");
  const email = portfolio ? "mariano@mgatc.com" : "hola@mgatc.com";
  const linkedin = portfolio
    ? "https://www.linkedin.com/in/mariano-gobea-alcoba/"
    : "https://www.linkedin.com/company/mga-tech-consulting";

  return (
    <footer className="mga-footer">
      <div className="mga-container">
        <div className="mga-footer__top">
          <div>
            <Link href={home} aria-label="MGA Tech Consulting — Home">
              <Brand />
            </Link>
            <p>
              {es
                ? "Ideas claras. Sistemas que funcionan."
                : "Clear ideas. Systems that work."}
              <br />
              Buenos Aires → {es ? "cualquier lugar" : "anywhere"}.
            </p>
          </div>
          <div>
            <span>{es ? "El estudio" : "The studio"}</span>
            <Link href={`${home}#servicios`}>
              {es ? "Qué hacemos" : "What we do"}
            </Link>
            <Link href={`${home}#proyectos`}>{es ? "Proyectos" : "Work"}</Link>
            <Link href="/como-trabajamos/">
              {es ? "Cómo trabajamos" : "Our process"}
            </Link>
            <Link href="/portfolio/">
              {es ? "Conocé al fundador" : "Meet the founder"}
            </Link>
          </div>
          <div>
            <span>{es ? "Para explorar" : "Explore"}</span>
            <Link href="/blog/">
              {es ? "Ideas y artículos" : "Ideas & articles"}
            </Link>
            <Link href="/recursos/">
              {es ? "Herramientas abiertas" : "Open tools"}
            </Link>
            <Link href={localizePath("/agenthub/", lang)}>AgentHub</Link>
            <Link href={localizePath("/servicios/", lang)}>
              {es ? "Servicios a demanda" : "On-demand services"}
            </Link>
          </div>
          <div>
            <span>{es ? "Conversemos" : "Get in touch"}</span>
            <a href={`mailto:${email}`}>
              {email}
              <ArrowUpRight size={14} />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
              <ArrowUpRight size={14} />
            </a>
            {portfolio && (
              <a
                href="https://github.com/Mgobeaalcoba"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
        <div className="mga-footer__signature" aria-hidden="true">
          Make good
          <br />
          <em>things happen.</em>
          <span>↗</span>
        </div>
        <div className="mga-footer__bottom">
          <span>© {new Date().getFullYear()} MGA Tech Consulting</span>
          <span>
            {es
              ? "Tecnología con criterio humano."
              : "Technology. Human judgment."}
          </span>
          <div>
            <Link href="/privacidad/">{es ? "Privacidad" : "Privacy"}</Link>
            <button
              onClick={() =>
                window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))
              }
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
