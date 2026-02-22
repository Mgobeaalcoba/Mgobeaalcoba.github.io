import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import NewsletterBanner from '@/components/shared/NewsletterBanner';
import ScrollTracker from '@/components/shared/ScrollTracker';
import ConsultingHero from '@/components/consulting/ConsultingHero';
import Services from '@/components/consulting/Services';
import CaseStudies from '@/components/consulting/CaseStudies';
import Process from '@/components/consulting/Process';
import ConsultingContact from '@/components/consulting/ConsultingContact';

export const metadata: Metadata = {
  title: 'Consultoría Tecnológica | Automatización IA & BI para PyMEs',
  description:
    'Consultoría tecnológica especializada: Automatización de procesos, IA aplicada y Business Intelligence. Reducción de costos hasta 80%. Diagnóstico gratuito.',
  openGraph: {
    title: 'MGA Tech Consulting - Automatización & IA para Pymes',
    description: 'Reduzca costos operativos hasta 80% con automatización, chatbots IA y dashboards en tiempo real.',
    url: 'https://mgobeaalcoba.github.io/cv-site/consulting/',
  },
};

export default function ConsultingPage() {
  return (
    <main className="min-h-screen relative">
      <ScrollTracker />
      <Navbar />
      <ConsultingHero />
      <Services />
      <CaseStudies />
      <Process />
      <ConsultingContact />
      <NewsletterBanner />
      <Footer />
    </main>
  );
}
