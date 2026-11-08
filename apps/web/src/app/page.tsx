import type { Metadata } from "next";
import ConsultingPageClient from "./consulting/ConsultingPageClient";
import JsonLd from "@/components/shared/JsonLd";
import { buildLocalizedMetadata } from "@/lib/localizedMetadata";
import { getConsultingSchema } from "@/lib/consultingSchema";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = buildLocalizedMetadata({
  path: "/",
  locale: "es",
  title: "MGA Tech Consulting | Agentes de IA, automatización y software",
  description:
    "Agentes de IA, automatizaciones, desarrollo de software y datos para tu negocio. Un estudio independiente que conecta estrategia, diseño e implementación.",
  openGraphTitle: "MGA Tech Consulting — Menos tareas. Más posibilidades.",
  openGraphDescription:
    "Agentes de IA, automatizaciones y software a medida para que tu negocio dé el próximo paso. Explorá proyectos reales y contanos tu idea.",
});

export default function HomePage() {
  return (
    <LanguageProvider initialLang="es" authoritative>
      <JsonLd data={getConsultingSchema("es")} />
      <ConsultingPageClient />
    </LanguageProvider>
  );
}
