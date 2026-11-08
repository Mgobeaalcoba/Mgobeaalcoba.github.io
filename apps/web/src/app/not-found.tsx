"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath } from "@/lib/i18n-routes";

const KNOWN_REDIRECTS = [
  { pattern: /\/consulting/i, target: "/" },
  { pattern: /\/consultoria/i, target: "/" },
  { pattern: /\/cv\b/i, target: "/portfolio/" },
];
const PAGES = [
  { href: "/", es: "El estudio", en: "The studio" },
  { href: "/servicios/", es: "Servicios", en: "Services" },
  { href: "/blog/", es: "Ideas y artículos", en: "Ideas & articles" },
  { href: "/recursos/", es: "Herramientas abiertas", en: "Open tools" },
];
export default function NotFound() {
  const { lang } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    const match = KNOWN_REDIRECTS.find(({ pattern }) =>
      pattern.test(window.location.pathname)
    );
    if (match) router.replace(match.target);
  }, [router]);
  return (
    <>
      <Navbar />
      <main id="main-content" className="mga-container mga-error-page">
        <span className="mga-kicker">MGA / 404</span>
        <h1>
          {lang === "es"
            ? "Esta idea todavía no tiene página."
            : "This idea does not have a page yet."}
        </h1>
        <p>
          {lang === "es"
            ? "La dirección que buscás no existe o cambió de lugar. Podés seguir explorando desde acá."
            : "The address you are looking for does not exist or has moved. Keep exploring from here."}
        </p>
        <nav
          className="mga-error-links"
          aria-label={lang === "es" ? "Seguir explorando" : "Keep exploring"}
        >
          {PAGES.map((page) => (
            <Link key={page.href} href={localizePath(page.href, lang)}>
              {page[lang]}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
        <button className="mga-text-link" onClick={() => window.history.back()}>
          <ArrowLeft size={16} />
          {lang === "es"
            ? "Volver a la página anterior"
            : "Back to the previous page"}
        </button>
      </main>
      <Footer />
    </>
  );
}
