import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import NewsletterBanner from '@/components/shared/NewsletterBanner';
import ScrollTracker from '@/components/shared/ScrollTracker';
import RecursosClient from './RecursosClient';
import FloatingCTA from '@/components/shared/FloatingCTA';
import JsonLd from '@/components/shared/JsonLd';

const PAGE_URL = 'https://mgatc.com/recursos/';

export const metadata: Metadata = {
  title: 'Recursos Financieros | Calculadoras y Dashboard Argentina',
  description:
    'Herramientas financieras para Argentina: Calculadora Impuesto Ganancias 2026, Simulador Sueldo Neto/Bruto, Cotizaciones del Dólar en tiempo real, Dashboard de Inversiones.',
  keywords: [
    'calculadora ganancias argentina', 'simulador sueldo neto bruto', 'dolar blue hoy',
    'plazo fijo vs dolar', 'impuesto ganancias 2026', 'cotizaciones argentina',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Recursos Financieros Argentina - MGA',
    description: 'Calculadoras y herramientas financieras: Ganancias 2026, Simulador Sueldo, Cotizaciones.',
    url: PAGE_URL,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es el impuesto a las ganancias de cuarta categoría?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Es el tributo que grava los ingresos personales provenientes del trabajo en relación de dependencia, jubilaciones y pensiones. La calculadora ayuda a estimar la retención mensual y el sueldo de bolsillo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo se calcula la retención de ganancias?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La retención se calcula considerando el salario bruto, deducciones personales y familiares (mínimo no imponible, cónyuge, hijos) y otras deducciones admitidas por la AFIP. Se aplica la escala progresiva del artículo 94 de la Ley.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué tipos de dólar existen en Argentina?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'En Argentina existen varios tipos de dólar: oficial (BNA), blue (paralelo/informal), MEP o Bolsa (compra a través de bonos), contado con liqui (CCL), tarjeta/turista (oficial + impuestos), y cripto.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo afecta la inflación a los ingresos personales?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La inflación reduce el poder adquisitivo de los ingresos personales. Si el salario no sube al ritmo de la inflación, en términos reales se gana menos. Los indicadores de inflación mensual e interanual muestran la variación del IPC calculada por INDEC.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Conviene más un Plazo Fijo o invertir en dólares?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende de la tasa de inflación y de la devaluación del peso. Si la inflación supera la tasa del plazo fijo, el plazo fijo no protege el capital. El dashboard comparador permite visualizar ambas opciones en tiempo real.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es el UVA y para qué sirve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La Unidad de Valor Adquisitivo (UVA) es un índice creado por el BCRA que se actualiza diariamente según el Coeficiente de Estabilización de Referencia (CER), que refleja la inflación. Se usa para ajustar créditos hipotecarios y algunos depósitos.',
      },
    },
  ],
};

export default function RecursosPage() {
  return (
    <main className="min-h-screen">
      <JsonLd data={faqSchema} />
      <ScrollTracker />
      <Navbar />
      <RecursosClient />
      <NewsletterBanner />
      <Footer />
      <FloatingCTA labelKey="floating_cta_recursos" site_section="recursos" />
    </main>
  );
}
