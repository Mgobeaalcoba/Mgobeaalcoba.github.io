import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ThanksPageClient from '@/components/commerce/ThanksPageClient';
import { buildLocalizedMetadata } from '@/lib/localizedMetadata';

export const metadata: Metadata = {
  ...buildLocalizedMetadata({
    path: '/servicios/gracias/',
    locale: 'en',
    title: 'Thank you for your purchase',
    description: 'Transaction status and next steps after payment.',
  }),
  robots: { index: false, follow: false },
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
