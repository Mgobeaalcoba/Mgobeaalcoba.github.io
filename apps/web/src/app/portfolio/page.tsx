import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import Hero from '@/components/cv/Hero';
import About from '@/components/cv/About';
import FilteredPortfolioSections from '@/components/cv/FilteredPortfolioSections';
import PortfolioConsultingCTA from '@/components/cv/PortfolioConsultingCTA';
import Contact from '@/components/cv/Contact';
import Terminal from '@/components/cv/Terminal';
import { getCareerExperienceYears } from '@/lib/experience';
import JsonLd from '@/components/shared/JsonLd';

const SITE_URL = 'https://www.mgatc.com';
const PAGE_URL = `${SITE_URL}/portfolio/`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mariano Gobea Alcoba",
  jobTitle: "Data & Analytics Technical Leader",
  description:
    `Data & Analytics Technical Leader con más de ${getCareerExperienceYears()} años de experiencia en Mercado Libre desde mayo de 2019. Experto en BigQuery, Python, Machine Learning, IA y Business Intelligence. Consultor de automatización para PyMEs en Argentina.`,
  url: SITE_URL,
  image: `${SITE_URL}/images/profile.png`,
  email: "mgobeaalcoba@gmail.com",
  sameAs: [
    "https://linkedin.com/in/mgobeaalcoba",
    "https://github.com/Mgobeaalcoba",
    "https://twitter.com/MGobeaAlcoba",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Mercado Libre",
    url: "https://mercadolibre.com",
  },
  knowsAbout: [
    "Data Engineering",
    "BigQuery",
    "Python",
    "Machine Learning",
    "Business Intelligence",
    "GenAI",
    "LLMs",
    "Apache Airflow",
    "dbt",
    "Apache Kafka",
    "automatización de procesos",
    "consultoría tecnológica",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Data & Analytics Technical Leader",
    occupationLocation: {
      "@type": "Country",
      name: "Argentina",
    },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Buenos Aires",
    addressCountry: "AR",
  },
  nationality: "Argentine",
};

export const metadata: Metadata = {
  title: { absolute: 'Portfolio & CV | Mariano Gobea Alcoba - Data & Analytics Leader' },
  description:
    `Portfolio profesional de Mariano Gobea Alcoba. Data & Analytics Technical Leader con ${getCareerExperienceYears()}+ años en Mercado Libre desde mayo de 2019. Experto en BigQuery, Python, ML, IA y Business Intelligence.`,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Portfolio & CV | Mariano Gobea Alcoba',
    description:
      `Data & Analytics Technical Leader con ${getCareerExperienceYears()}+ años en Mercado Libre desde mayo de 2019. Experto en BigQuery, Python, ML e IA.`,
    url: PAGE_URL,
  },
};

export default function PortfolioPage() {
  return (
    <main id="main-content" className="min-h-screen relative signal-portfolio-page">
      <JsonLd data={personSchema} />
      <ScrollTracker />
      <Navbar />
      <Hero />
      <Terminal />
      <About />
      <FilteredPortfolioSections />
      <PortfolioConsultingCTA />
      <Contact />
      <Footer />
    </main>
  );
}
