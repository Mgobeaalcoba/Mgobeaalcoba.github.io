import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ThanksPageClient from '@/components/commerce/ThanksPageClient';

const SITE_URL = 'https://www.mgatc.com';
const PAGE_URL = `${SITE_URL}/en/servicios/gracias/`;
const ES_PAGE_URL = `${SITE_URL}/servicios/gracias/`;

export const metadata: Metadata = {
  title: 'Thank you for your purchase',
  robots: { index: false, follow: false },
  alternates: { canonical: PAGE_URL, languages: { 'es-AR': ES_PAGE_URL, en: PAGE_URL } },
};

export default function EnglishThanksPage() {
  return (
    <main id="main-content" className="signal-thanks-page">
      <Navbar />
      <ThanksPageClient />
      <Footer />
    </main>
  );
}
