import ContentRepository from '@/services/contentService';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import History from '@/components/History';
import Quality from '@/components/Quality';
import Values from '@/components/Values';
import Contact from '@/components/Contact';
import SalesProposal from '@/components/SalesProposal';
import Footer from '@/components/Footer';
import ScrollTracker from '@/components/ScrollTracker';
import ProposalCTA from '@/components/ProposalCTA';

export default function HomePage() {
  const hero = ContentRepository.getHero();
  const about = ContentRepository.getAbout();
  const services = ContentRepository.getServices();
  const transport = ContentRepository.getTransportCategory();
  const warehouse = ContentRepository.getWarehouseCategory();
  const history = ContentRepository.getHistory();
  const quality = ContentRepository.getQuality();
  const values = ContentRepository.getValues();
  const contact = ContentRepository.getContact();
  const automations = ContentRepository.getAutomations();
  const salesProposal = ContentRepository.getSalesProposal();
  const footer = ContentRepository.getFooter();
  const brand = ContentRepository.getBrand();

  return (
    <>
      <ScrollTracker />
      <ProposalCTA />
      <Navbar links={footer.links} brandName={brand.name} logo={brand.logo} />
      <main>
        <Hero data={hero} />
        <About data={about} />
        <Services data={services} transport={transport} warehouse={warehouse} />
        <History data={history} />
        <Quality data={quality} />
        <Values data={values} />
        <Contact data={contact} automations={automations} />
        <SalesProposal data={salesProposal} />
      </main>
      <Footer data={footer} brand={brand} />
    </>
  );
}
