"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import Brand from "./Brand";
import MobileNavigation from "./MobileNavigation";
import { openContactModal } from "./ContactModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath, splitLocale } from "@/lib/i18n-routes";
import { events } from "@/lib/gtag";

const EXPLORE = [
  {
    href: "/blog/",
    es: "Ideas y artículos",
    en: "Ideas & articles",
    detail: {
      es: "Lo que aprendemos al construir",
      en: "What we learn by building",
    },
  },
  {
    href: "/recursos/",
    es: "Herramientas abiertas",
    en: "Open tools",
    detail: {
      es: "Datos y recursos para usar",
      en: "Data and resources you can use",
    },
  },
  {
    href: "/agenthub/",
    es: "AgentHub",
    en: "AgentHub",
    detail: {
      es: "Agentes y flujos para explorar",
      en: "Explore agents and workflows",
    },
  },
  {
    href: "/servicios/",
    es: "Servicios a demanda",
    en: "On-demand services",
    detail: {
      es: "Diagnósticos, auditorías y mentorías",
      en: "Diagnostics, audits and mentoring",
    },
  },
];

export default function Navbar() {
  const pathname = usePathname();
  return <StudioNavbar key={pathname} pathname={pathname} />;
}

function StudioNavbar({ pathname }: { pathname: string }) {
  const { theme, cycleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const exploreButton = useRef<HTMLButtonElement>(null);
  const home = localizePath("/", lang);
  const es = lang === "es";
  const basePath = splitLocale(pathname).pathname;
  const closeMenus = () => {
    setExploreOpen(false);
  };
  const links = [
    { href: `${home}#servicios`, label: es ? "Servicios" : "Services" },
    { href: `${home}#proyectos`, label: es ? "Proyectos" : "Work" },
    { href: `${home}#estudio`, label: es ? "Estudio" : "Studio" },
  ];

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!exploreRef.current?.contains(event.target as Node))
        setExploreOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (exploreOpen) {
        setExploreOpen(false);
        exploreButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [exploreOpen]);

  const contact = () => {
    closeMenus();
    events.contactClick("studio_navigation");
    openContactModal(
      "studio_navigation",
      es
        ? "Quiero conversar sobre un proyecto para mi negocio."
        : "I would like to discuss a project for my business."
    );
  };

  const switchLanguage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const next = es ? "en" : "es";
    events.languageSwitch(lang, next);
    const target = localizePath(pathname, next);
    closeMenus();
    if (target === pathname) {
      event.preventDefault();
      setLang(next);
    } else {
      // Keep the link's destination stable until the native document navigation.
      // A synchronous context update would render the inverse language URL here.
      localStorage.setItem("language", next);
      event.currentTarget.href = `${target}${window.location.search}${window.location.hash}`;
    }
  };

  return (
    <>
      <header className="mga-nav">
        <nav
          className="mga-nav__inner"
          aria-label={es ? "Navegación principal" : "Main navigation"}
        >
          <Link
            href={home}
            className="mga-nav__brand"
            aria-label="MGA Tech Consulting — Home"
            onClick={closeMenus}
          >
            <Brand />
          </Link>
          <div className="mga-nav__links">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  closeMenus();
                  events.navClick(href, label);
                }}
              >
                {label}
              </Link>
            ))}
            <div className="mga-nav__explore" ref={exploreRef}>
              <button
                ref={exploreButton}
                onClick={() => setExploreOpen(!exploreOpen)}
                aria-expanded={exploreOpen}
                aria-controls="mga-explore"
              >
                {es ? "Explorar" : "Explore"}
                <ChevronDown size={13} />
              </button>
              {exploreOpen && (
                <div id="mga-explore" className="mga-nav__dropdown">
                  {EXPLORE.map((item) => (
                    <Link
                      href={localizePath(item.href, lang)}
                      key={item.href}
                      onClick={closeMenus}
                      aria-current={
                        basePath.startsWith(item.href) ? "page" : undefined
                      }
                    >
                      <span>
                        {item[lang]}
                        <ArrowUpRight size={16} />
                      </span>
                      <small>{item.detail[lang]}</small>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      closeMenus();
                      window.dispatchEvent(
                        new CustomEvent("toggle-command-palette")
                      );
                    }}
                  >
                    <Search size={15} />
                    {es ? "Buscar en el sitio" : "Search the site"}
                    <kbd>⌘ K</kbd>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mga-nav__actions">
            <a
              className="mga-nav__utility"
              href={localizePath(pathname, es ? "en" : "es")}
              onClick={switchLanguage}
              aria-label={es ? "Cambiar a inglés" : "Switch to Spanish"}
            >
              {lang.toUpperCase()}
            </a>
            <button
              className="mga-nav__utility"
              onClick={cycleTheme}
              aria-label={
                es
                  ? `Activar tema ${theme === "dark" ? "claro" : "oscuro"}`
                  : `Switch to ${theme === "dark" ? "light" : "dark"} theme`
              }
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="mga-nav__cta" onClick={contact}>
              {es ? "Hablemos" : "Let’s talk"}
              <ArrowUpRight size={17} />
            </button>
          </div>
        </nav>
      </header>
      <MobileNavigation pathname={pathname} onContact={contact} />
    </>
  );
}
