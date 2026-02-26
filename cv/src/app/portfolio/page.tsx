import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import NewsletterBanner from '@/components/shared/NewsletterBanner';
import ScrollTracker from '@/components/shared/ScrollTracker';
import FloatingCTA from '@/components/shared/FloatingCTA';
import Hero from '@/components/cv/Hero';
import About from '@/components/cv/About';
import ConsultingTeaser from '@/components/cv/ConsultingTeaser';
import RecursosTeaser from '@/components/cv/RecursosTeaser';
import Gamification from '@/components/cv/Gamification';
import DashboardWidgetMini from '@/components/cv/DashboardWidgetMini';
import FilteredPortfolioSections from '@/components/cv/FilteredPortfolioSections';
import Contact from '@/components/cv/Contact';
import Terminal from '@/components/cv/Terminal';

const SITE_URL = 'https://www.mgatc.com';
const PAGE_URL = `${SITE_URL}/portfolio/`;

export const metadata: Metadata = {
  title: 'Portfolio & CV | Mariano Gobea Alcoba - Data & Analytics Leader',
  description:
    'Portfolio profesional de Mariano Gobea Alcoba. Data & Analytics Technical Leader con +6 años en Mercado Libre. Experto en BigQuery, Python, ML, IA y Business Intelligence.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Portfolio & CV | Mariano Gobea Alcoba',
    description:
      'Data & Analytics Technical Leader con +6 años en Mercado Libre. Experto en BigQuery, Python, ML e IA.',
    url: PAGE_URL,
  },
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen relative">
      <ScrollTracker />
      <Navbar />
      <Hero />
      <Terminal />
      <About />
      <ConsultingTeaser />
      <RecursosTeaser />
      <Gamification />
      <DashboardWidgetMini />
      <FilteredPortfolioSections />
      <Contact />
      <NewsletterBanner />
      <Footer />
      <FloatingCTA labelKey="floating_cta_cv" site_section="cv" />
    </main>
  );
}
