import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductsShowcase from '@/components/ProductsShowcase';
import About from '@/components/About';
import PreCoolingFeature from '@/components/PreCoolingFeature';
import EuropeSection from '@/components/EuropeSection';
import Contact from '@/components/Contact';
import SalesProposal from '@/components/SalesProposal';
import Footer from '@/components/Footer';
import ProposalCTA from '@/components/ProposalCTA';
import ScrollTracker from '@/components/ScrollTracker';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy-950 overflow-x-hidden">
      <ScrollTracker />
      <Navbar />
      <Hero />
      <ProductsShowcase />
      <About />
      <PreCoolingFeature />
      <EuropeSection />
      <Contact />
      <SalesProposal />
      <Footer />
      <ProposalCTA />
    </main>
  );
}
