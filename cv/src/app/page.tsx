import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import NewsletterBanner from '@/components/shared/NewsletterBanner';
import ScrollTracker from '@/components/shared/ScrollTracker';
import Hero from '@/components/cv/Hero';
import About from '@/components/cv/About';
import Experience from '@/components/cv/Experience';
import Projects from '@/components/cv/Projects';
import Education from '@/components/cv/Education';
import Skills from '@/components/cv/Skills';
import Contact from '@/components/cv/Contact';
import Terminal from '@/components/cv/Terminal';

export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      <ScrollTracker />
      <Navbar />
      <Hero />
      <Terminal />
      <About />
      <Experience />
      <Projects />
      <Education />
      <Skills />
      <Contact />
      <NewsletterBanner />
      <Footer />
    </main>
  );
}
