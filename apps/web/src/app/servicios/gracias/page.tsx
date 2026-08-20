import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import CheckoutReturnStatus from '@/components/commerce/CheckoutReturnStatus';
import ContextBackLink from '@/components/shared/ContextBackLink';

export const metadata: Metadata = { title: 'Gracias por tu compra', robots: { index: false, follow: false } };

export default function ThanksPage() {
  return (
    <main id="main-content" className="signal-thanks-page">
      <Navbar />
      <section>
        <ContextBackLink href="/servicios/" label="Volver a servicios" />
        <span className="signal-eyebrow">Retorno de Mercado Pago / Próximo paso</span>
        <h1>Revisemos el estado<br /><em>de tu operación.</em></h1>
        <CheckoutReturnStatus />
        <div><strong>01</strong><span>Compartís el contexto mínimo</span><strong>02</strong><span>Coordinamos la agenda</span><strong>03</strong><span>Recibís la entrega acordada</span></div>
      </section>
      <Footer />
    </main>
  );
}
