'use client';

import { useState, useCallback } from 'react';
import { events } from '@/lib/gtag';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import NewsletterBanner from '@/components/shared/NewsletterBanner';
import ScrollTracker from '@/components/shared/ScrollTracker';
import ConsultingHero from '@/components/consulting/ConsultingHero';
import ParadigmShift from '@/components/consulting/ParadigmShift';
import FreeOfferBanner from '@/components/consulting/FreeOfferBanner';
import ValuePropositions from '@/components/consulting/ValuePropositions';
import Services from '@/components/consulting/Services';
import SuccessStories from '@/components/consulting/SuccessStories';
import PricingOverview from '@/components/consulting/PricingOverview';
import CaseStudies from '@/components/consulting/CaseStudies';
import ClientPortfolio from '@/components/consulting/ClientPortfolio';
import AboutConsulting from '@/components/consulting/AboutConsulting';
import Testimonials from '@/components/consulting/Testimonials';
import Process from '@/components/consulting/Process';
import ConsultingContact from '@/components/consulting/ConsultingContact';
import ProposalModal from '@/components/consulting/ProposalModal';
import FloatingCTA from '@/components/shared/FloatingCTA';

export default function ConsultingPageClient() {
  const [proposalOpen, setProposalOpen] = useState(false);

  const openProposal = useCallback(() => {
    events.proposalModalOpen();
    setProposalOpen(true);
  }, []);

  return (
    <main className="min-h-screen relative">
      <ScrollTracker site_section="consulting" />
      <Navbar />
      <ConsultingHero onOpenProposal={openProposal} />
      <ParadigmShift />
      <FreeOfferBanner onOpenProposal={openProposal} />
      <ValuePropositions />
      <Services />
      <SuccessStories />
      <PricingOverview />
      <CaseStudies />
      <ClientPortfolio />
      <AboutConsulting onOpenProposal={openProposal} />
      <Testimonials />
      <Process />
      <ConsultingContact />
      <NewsletterBanner />
      <Footer />
      <ProposalModal isOpen={proposalOpen} onClose={() => setProposalOpen(false)} />
      <FloatingCTA labelKey="floating_cta_consulting" site_section="consulting" />
    </main>
  );
}
