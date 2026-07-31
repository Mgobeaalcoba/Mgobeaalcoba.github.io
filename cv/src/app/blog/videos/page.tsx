import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import VideoLibrary from '@/components/blog/VideoLibrary';

export const metadata: Metadata = {
  title: 'Videoteca | Masterclasses de Data, IA y Automatización',
  description: 'Todas las masterclasses, demostraciones y conversaciones técnicas de Mariano Gobea Alcoba.',
  alternates: { canonical: 'https://www.mgatc.com/blog/videos/' },
};

export default function VideosPage() {
  return <main id="main-content" className="min-h-screen signal-editorial-page"><ScrollTracker /><Navbar /><VideoLibrary /><Footer /></main>;
}
