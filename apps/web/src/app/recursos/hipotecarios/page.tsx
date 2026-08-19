import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import MortgageUvaCalculator from '@/components/recursos/MortgageUvaCalculator';

const PAGE_URL = 'https://www.mgatc.com/recursos/hipotecarios/';

export const metadata: Metadata = {
  title: 'Comparador de Créditos Hipotecarios UVA | Cuota y Bancos',
  description: 'Compará créditos hipotecarios UVA, calculá la primera cuota, el anticipo, la comisión inmobiliaria y los gastos de escritura con datos oficiales del BCRA.',
  keywords: [
    'comparador créditos hipotecarios UVA',
    'calculadora primera cuota UVA',
    'tasas hipotecarias bancos Argentina',
    'simulador crédito hipotecario',
    'gastos escrituración Argentina',
    'comisión inmobiliaria comprador',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Comparador Hipotecario UVA — MGA',
    description: 'Primera cuota, bancos compatibles y escenarios explícitos de cuota/ingreso.',
    url: PAGE_URL,
  },
};

const mortgageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Comparador Hipotecario UVA',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: PAGE_URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS' },
  description: 'Herramienta informativa para comparar líneas hipotecarias UVA, estimar la primera cuota y calcular los fondos iniciales de la operación.',
};

export default function MortgagePage() {
  return (
    <main id="main-content" className="min-h-screen signal-tools-page signal-mortgage-standalone">
      <JsonLd data={mortgageSchema} />
      <ScrollTracker />
      <Navbar />
      <section>
        <MortgageUvaCalculator />
      </section>
      <Footer />
    </main>
  );
}
