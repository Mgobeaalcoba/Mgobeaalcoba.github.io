import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import HenryCaseStudy from '@/components/work/HenryCaseStudy';

export const metadata: Metadata = {
  title: 'Henry · Rediseño de la carrera de AI Automation',
  description: 'Cómo rediseñamos la carrera de AI Automation de Henry: de herramientas a habilidades, con un módulo de producción, un contrato de uso de IA por módulo y proyecto final con defensa.',
  alternates: { canonical: 'https://www.mgatc.com/trabajos/henry/' },
};

export default function HenryWorkPage() {
  return <main id="main-content" className="min-h-screen signal-work-page"><ScrollTracker /><Navbar /><HenryCaseStudy /><Footer /></main>;
}
