import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import IaRouterPage from '@/components/recursos/IaRouterPage';
import { iaRouterMetadata, iaRouterSchemas } from '@/lib/iaRouterSeo';

export const metadata: Metadata = iaRouterMetadata('en');

const schemas = iaRouterSchemas('en');

export default function EnglishIaRouterRoute() {
  return (
    <main id="main-content" className="min-h-screen signal-tools-page signal-iar-page">
      <JsonLd data={schemas.software} />
      <JsonLd data={schemas.faq} />
      <ScrollTracker />
      <Navbar />
      <IaRouterPage lang="en" />
      <Footer />
    </main>
  );
}
