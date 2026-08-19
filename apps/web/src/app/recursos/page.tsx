import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollTracker from "@/components/shared/ScrollTracker";
import RecursosClient from "./RecursosClient";
import JsonLd from "@/components/shared/JsonLd";

const PAGE_URL = "https://www.mgatc.com/recursos/";

export const metadata: Metadata = {
  title: "Recursos Tech & Financieros | Arquitectura IA y Calculadoras",
  description:
    "Comparador de créditos hipotecarios UVA con primera cuota, fondos iniciales, gastos de escrituración y escenarios de cuota/ingreso, junto a herramientas para Argentina.",
  keywords: [
    "visualizador arquitectura n8n",
    "automatización procesos ia",
    "calculadora roi automatización",
    "arquitectura tech interactiva",
    "calculadora ganancias argentina",
    "calculadora credito hipotecario uva",
    "comparador bancos hipotecarios argentina",
    "primera cuota credito uva",
    "gastos escritura credito hipotecario",
    "comision inmobiliaria comprador",
    "dolar blue hoy",
    "transparency bi",
    "metricas ia tiempo real",
    "dashboard automatizacion",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Recursos Tech & Financieros - MGA",
    description:
      "Visualizador Ark, Calculadora ROI, Transparency BI y herramientas financieras.",
    url: PAGE_URL,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo se calcula la primera cuota de un crédito hipotecario UVA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La cuota financiera se calcula en UVA mediante sistema francés y la tasa efectiva mensual equivalente de la línea elegida. Para expresarla en pesos se multiplica por el valor vigente de la UVA.",
      },
    },
    {
      "@type": "Question",
      name: "¿La proyección de cuotas UVA es un pronóstico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Es un escenario educativo construido con supuestos editables sobre la evolución mensual de la UVA y del ingreso familiar. No predice inflación, salarios ni el tipo de cambio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué gastos iniciales debo considerar además del anticipo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La herramienta permite estimar una comisión inmobiliaria opcional y los gastos de escrituración. Usa 4% y 3% como referencias editables. Sellos, tasación, seguros y cargos bancarios dependen de la jurisdicción y de cada operación.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es Transparency BI en la integración de IA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es un panel de métricas en tiempo real que permite visualizar el desempeño de asistentes de IA, midiendo intenciones de los usuarios, tiempos de respuesta y tasas de conversión para demostrar el ROI real de la implementación.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es un visualizador de arquitectura de automatización?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es una herramienta interactiva que permite diseñar flujos de trabajo conectando disparadores (como WhatsApp o Webhooks), procesadores de IA (LLMs) y destinos (CRMs o Bases de Datos) para visualizar una solución automatizada.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se calcula el ROI de una automatización?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El ROI se calcula comparando el costo del tiempo manual ahorrado contra el costo de implementación y mantenimiento de la automatización. Nuestra calculadora utiliza una estimación de eficiencia del 85% para proyectar ahorros anuales.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el impuesto a las ganancias de cuarta categoría?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es el tributo que grava los ingresos personales provenientes del trabajo en relación de dependencia, jubilaciones y pensiones. La calculadora ayuda a estimar la retención mensual y el sueldo de bolsillo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué tipos de dólar existen en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En Argentina existen varios tipos de dólar: oficial (BNA), blue (paralelo/informal), MEP o Bolsa (compra a través de bonos), tarjeta/turista y cripto.",
      },
    },
  ],
};

export default function RecursosPage() {
  return (
    <main id="main-content" className="min-h-screen signal-tools-page">
      <JsonLd data={faqSchema} />
      <ScrollTracker />
      <Navbar />
      <RecursosClient />
      <Footer />
    </main>
  );
}
