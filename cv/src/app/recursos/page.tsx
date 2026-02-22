import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import NewsletterBanner from '@/components/shared/NewsletterBanner';
import ScrollTracker from '@/components/shared/ScrollTracker';
import RecursosClient from './RecursosClient';
import FloatingCTA from '@/components/shared/FloatingCTA';

export const metadata: Metadata = {
  title: 'Recursos Financieros | Calculadoras y Dashboard Argentina',
  description:
    'Herramientas financieras para Argentina: Calculadora Impuesto Ganancias 2026, Simulador Sueldo Neto/Bruto, Cotizaciones del Dólar en tiempo real, Dashboard de Inversiones.',
  keywords: [
    'calculadora ganancias argentina', 'simulador sueldo neto bruto', 'dolar blue hoy',
    'plazo fijo vs dolar', 'impuesto ganancias 2026', 'cotizaciones argentina',
  ],
  openGraph: {
    title: 'Recursos Financieros Argentina - MGA',
    description: 'Calculadoras y herramientas financieras: Ganancias 2026, Simulador Sueldo, Cotizaciones.',
    url: 'https://mgobeaalcoba.github.io/recursos/',
  },
};

export default function RecursosPage() {
  return (
    <main className="min-h-screen">
      <ScrollTracker />
      <Navbar />
      <RecursosClient />
      <NewsletterBanner />
      <Footer />
      <FloatingCTA labelKey="floating_cta_recursos" site_section="recursos" />
    </main>
  );
}
