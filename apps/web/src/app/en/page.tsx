import type { Metadata } from "next";
import ConsultingPageClient from "../consulting/ConsultingPageClient";
import JsonLd from "@/components/shared/JsonLd";
import { buildLocalizedMetadata } from "@/lib/localizedMetadata";
import { getConsultingSchema } from "@/lib/consultingSchema";

export const metadata: Metadata = buildLocalizedMetadata({
  path: "/",
  locale: "en",
  title: "AI agents, automation and software",
  description:
    "AI agents, automation, software development and data for your business. An independent studio connecting strategy, design and implementation.",
  openGraphTitle: "MGA Tech Consulting — Less busywork. More possibilities.",
  openGraphDescription:
    "AI agents, automation and custom software to help your business take its next step. Explore real projects and tell us your idea.",
});

export default function EnglishHomePage() {
  return (
    <>
      <JsonLd data={getConsultingSchema("en")} />
      <ConsultingPageClient />
    </>
  );
}
