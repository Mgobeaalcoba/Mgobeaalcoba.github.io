import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import ReportContent from './ReportContent';

export const metadata: Metadata = {
  title: 'Layoffs, Contratación & GenAI: El Gran Reajuste Laboral | MGA Tech',
  description:
    'Análisis 100% data-driven sobre despidos masivos en IT y sectores white collar, tendencias de contratación y su correlación con los hitos de la IA Generativa.',
  alternates: {
    canonical: 'https://www.mgatc.com/blog/special/layoffs-genai/',
  },
  openGraph: {
    title: 'Layoffs, Contratación & GenAI — El Gran Reajuste Laboral',
    description:
      'Análisis global con datos verificables, gráficos interactivos y proyecciones a 1, 2, 5 y 10 años.',
    url: 'https://www.mgatc.com/blog/special/layoffs-genai/',
  },
};

export default function LayoffsGenAIReportPage() {
  return (
    <main className="min-h-screen">
      <ScrollTracker />
      <Navbar />
      <ReportContent />
      <Footer />
    </main>
  );
}
