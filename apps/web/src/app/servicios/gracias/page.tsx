import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ThanksPageClient from '@/components/commerce/ThanksPageClient';
import { buildLocalizedMetadata } from '@/lib/localizedMetadata';

export const metadata: Metadata = {
  ...buildLocalizedMetadata({
    path: '/servicios/gracias/',
    locale: 'es',
    title: 'Gracias por tu compra',
    description: 'Estado de la operación y próximos pasos después del pago.',
  }),
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main id="main-content" className="signal-thanks-page">
      <Navbar />
      <ThanksPageClient />
      <Footer />
    </main>
  );
}
