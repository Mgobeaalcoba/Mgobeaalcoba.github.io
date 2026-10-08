import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import PypiStatsPage from '@/components/recursos/PypiStatsPage';
import { pypiStatsMetadata } from '@/lib/pypiStatsSeo';

export const metadata: Metadata = pypiStatsMetadata('es');

export default function PypiStatsRoute() {
  return (
    <main id="main-content" className="min-h-screen signal-tools-page signal-pypi-page">
      <ScrollTracker />
      <Navbar />
      <PypiStatsPage lang="es" />
      <Footer />
    </main>
  );
}
