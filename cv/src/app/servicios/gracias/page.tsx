import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import OnboardingCTA from '@/components/commerce/OnboardingCTA';
import ContextBackLink from '@/components/shared/ContextBackLink';

export const metadata: Metadata = { title: 'Gracias por tu compra', robots: { index: false, follow: false } };

export default function ThanksPage() {
  return (
    <main id="main-content" className="signal-thanks-page">
      <Navbar />
      <section>
        <ContextBackLink href="/servicios/" label="Volver a servicios" />
        <span className="signal-eyebrow">Pago recibido / Próximo paso</span>
        <h1>Ahora trabajamos<br /><em>sobre tu caso.</em></h1>
        <p>Completá el onboarding para identificar tu compra, compartir contexto y coordinar la sesión. Te responderé dentro de las próximas 24 horas.</p>
        <OnboardingCTA />
        <div><strong>01</strong><span>Compartís el contexto mínimo</span><strong>02</strong><span>Coordinamos la agenda</span><strong>03</strong><span>Recibís la entrega acordada</span></div>
      </section>
      <Footer />
    </main>
  );
}
