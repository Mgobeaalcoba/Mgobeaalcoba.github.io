import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import UnicornCaseStudy from '@/components/work/UnicornCaseStudy';

export const metadata: Metadata = {
  title: 'Unicorn Academy · Trabajo en curso',
  description: 'Colaboración académica en curso con Unicorn Academy. El caso completo se publica al finalizar el trabajo.',
  alternates: { canonical: 'https://www.mgatc.com/trabajos/unicorn-academy/' },
  robots: { index: false, follow: true },
};

export default function UnicornWorkPage() {
  return <main id="main-content" className="min-h-screen signal-work-page"><ScrollTracker /><Navbar /><UnicornCaseStudy /><Footer /></main>;
}
