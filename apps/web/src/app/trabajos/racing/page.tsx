import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollTracker from "@/components/shared/ScrollTracker";
import RacingCaseStudy from "@/components/work/RacingCaseStudy";

export const metadata: Metadata = {
  title: "Racing Club · Estrategia Data & GenAI",
  description:
    "Diagnóstico, arquitectura de datos y hoja de ruta para gestión comercial, medición de sponsors y comercio unificado en Racing Club.",
  alternates: { canonical: "https://www.mgatc.com/trabajos/racing/" },
};

export default function RacingWorkPage() {
  return (
    <main id="main-content" className="min-h-screen signal-work-page">
      <ScrollTracker />
      <Navbar />
      <RacingCaseStudy />
      <Footer />
    </main>
  );
}
