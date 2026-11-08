"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Home,
  Layers3,
  Briefcase,
  Compass,
  MessageSquareText,
  BookOpen,
  Wrench,
  Bot,
  UserRound,
  Route,
  Search,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath, splitLocale } from "@/lib/i18n-routes";
import { events } from "@/lib/gtag";

const subscribeHash = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
};
const hashSnapshot = () => window.location.hash;
const serverHash = () => "";
const DESTINATIONS = [
  {
    href: "/blog/",
    es: "Ideas y artículos",
    en: "Ideas & articles",
    icon: BookOpen,
  },
  { href: "/recursos/", es: "Herramientas", en: "Tools", icon: Wrench },
  { href: "/agenthub/", es: "AgentHub", en: "AgentHub", icon: Bot },
  {
    href: "/servicios/",
    es: "Servicios a demanda",
    en: "On-demand services",
    icon: Layers3,
  },
  {
    href: "/portfolio/",
    es: "El fundador",
    en: "The founder",
    icon: UserRound,
  },
];

export default function MobileNavigation({
  pathname,
  onContact,
}: {
  pathname: string;
  onContact: () => void;
}) {
  const { lang } = useLanguage();
  const es = lang === "es";
  const home = localizePath("/", lang);
  const path = splitLocale(pathname).pathname;
  const hash = useSyncExternalStore(subscribeHash, hashSnapshot, serverHash);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const active = open
    ? "explore"
    : path.startsWith("/servicios/") || (path === "/" && hash === "#servicios")
      ? "services"
      : path.startsWith("/trabajos/") ||
          (path === "/" && hash.startsWith("#proyectos"))
        ? "work"
        : path === "/"
          ? "home"
          : "explore";

  const close = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => trigger.current?.focus());
  };

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("mga-mobile-explore-open");
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => trigger.current?.focus());
      }
    };
    const media = window.matchMedia("(min-width: 821px)");
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    window.addEventListener("keydown", escape);
    media.addEventListener("change", resize);
    return () => {
      document.body.classList.remove("mga-mobile-explore-open");
      window.removeEventListener("keydown", escape);
      media.removeEventListener("change", resize);
    };
  }, [open]);

  const keepFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(
      panel.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not(:disabled)"
      ) ?? []
    );
    const first = controls[0],
      last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const follow = (href: string, label: string) => {
    close();
    events.navClick(href, label);
  };
  return (
    <>
      {open && (
        <div className="mga-mobile-sheet-scrim" onClick={() => close(true)}>
          <div
            ref={panel}
            className="mga-mobile-sheet"
            id="mga-mobile-explore"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mga-mobile-explore-title"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={keepFocus}
          >
            <div className="mga-mobile-sheet__heading">
              <div>
                <span className="mga-kicker">
                  MGA / {es ? "Para explorar" : "Explore"}
                </span>
                <h2 id="mga-mobile-explore-title">
                  {es ? "Ideas, herramientas y más." : "Ideas, tools and more."}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => close(true)}
                aria-label={es ? "Cerrar explorar" : "Close explore"}
              >
                <X size={20} />
              </button>
            </div>
            <nav
              className="mga-mobile-sheet__links"
              aria-label={es ? "Más secciones" : "More sections"}
            >
              {DESTINATIONS.map(({ href, icon: Icon, ...copy }) => (
                <Link
                  key={href}
                  href={localizePath(href, lang)}
                  onClick={() => follow(href, copy[lang])}
                  aria-current={path.startsWith(href) ? "page" : undefined}
                >
                  <Icon size={20} />
                  <span>{copy[lang]}</span>
                  <ArrowUpRight size={13} />
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  close();
                  window.dispatchEvent(new CustomEvent("open-ai-assistant"));
                }}
              >
                <MessageSquareText size={20} />
                <span>{es ? "Asistente de IA" : "AI assistant"}</span>
                <ArrowUpRight size={13} />
              </button>
            </nav>
            <div className="mga-mobile-sheet__footer">
              <Link
                className="mga-mobile-sheet__process"
                href="/como-trabajamos/"
                onClick={() => close()}
              >
                <Route size={16} />
                {es ? "Cómo trabajamos" : "Our process"}
              </Link>
              <button
                className="mga-mobile-sheet__search"
                type="button"
                onClick={() => {
                  close();
                  window.dispatchEvent(
                    new CustomEvent("toggle-command-palette")
                  );
                }}
              >
                <Search size={17} />
                {es ? "Buscar" : "Search"}
              </button>
            </div>
          </div>
        </div>
      )}
      <nav
        className="mga-mobile-bar"
        aria-label={es ? "Navegación inferior" : "Bottom navigation"}
      >
        <a
          href={home}
          onClick={() => follow(home, es ? "Inicio" : "Home")}
          className={active === "home" ? "is-active" : ""}
          aria-current={active === "home" ? "page" : undefined}
        >
          <Home size={21} />
          <span>{es ? "Inicio" : "Home"}</span>
        </a>
        <a
          href={`${home}#servicios`}
          onClick={() =>
            follow(`${home}#servicios`, es ? "Servicios" : "Services")
          }
          className={active === "services" ? "is-active" : ""}
          aria-current={active === "services" ? "location" : undefined}
        >
          <Layers3 size={21} />
          <span>{es ? "Servicios" : "Services"}</span>
        </a>
        <a
          href={`${home}#proyectos`}
          onClick={() => follow(`${home}#proyectos`, es ? "Proyectos" : "Work")}
          className={active === "work" ? "is-active" : ""}
          aria-current={active === "work" ? "location" : undefined}
        >
          <Briefcase size={21} />
          <span>{es ? "Proyectos" : "Work"}</span>
        </a>
        <button
          ref={trigger}
          type="button"
          className={active === "explore" ? "is-active" : ""}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mga-mobile-explore"
        >
          <Compass size={21} />
          <span>{es ? "Explorar" : "Explore"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            close();
            onContact();
          }}
        >
          <MessageSquareText size={21} />
          <span>{es ? "Contacto" : "Contact"}</span>
        </button>
      </nav>
    </>
  );
}
