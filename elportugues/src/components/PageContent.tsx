'use client';

import { useEpData } from '@/contexts/EpDataContext';
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
import type { TransportCategory, WarehouseCategory } from '@/types/content';

export default function PageContent() {
  const { content } = useEpData();

  const {
    hero,
    about,
    services,
    history,
    quality,
    values,
    contact,
    automations,
    salesProposal,
    footer,
    brand,
  } = content;

  const transport = services?.categories?.[0] as TransportCategory | undefined;
  const warehouse = services?.categories?.[1] as WarehouseCategory | undefined;

  return (
    <>
      <ScrollTracker />
      <ProposalCTA />
      <Navbar links={footer?.links ?? []} brandName={brand?.name ?? ''} logo={brand?.logo ?? ''} />
      <main>
        {hero && <Hero data={hero} />}
        {about && <About data={about} />}
        {services && transport && warehouse && (
          <Services data={services} transport={transport} warehouse={warehouse} />
        )}
        {history && <History data={history} />}
        {quality && <Quality data={quality} />}
        {values && <Values data={values} />}
        {contact && <Contact data={contact} automations={automations} />}
        {salesProposal && <SalesProposal data={salesProposal} />}
      </main>
      {footer && brand && <Footer data={footer} brand={brand} />}
    </>
  );
}
