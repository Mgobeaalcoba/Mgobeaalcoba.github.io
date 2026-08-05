import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import OfferGrid from '@/components/commerce/OfferGrid';
import JsonLd from '@/components/shared/JsonLd';
import ContextBackLink from '@/components/shared/ContextBackLink';
import { OFFERS } from '@/lib/offers';

export const metadata: Metadata = {
  title: 'Servicios a demanda | Automatización, Data e IA',
  description: 'Diagnósticos, mentorías y auditorías con alcance, precio y entrega definidos. Automatización, Data Engineering e IA aplicada.',
  alternates: { canonical: 'https://www.mgatc.com/servicios/' },
};

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Servicios a demanda de MGA Tech Consulting',
  itemListElement: OFFERS.map((offer, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: { '@type': 'Service', name: offer.name, description: offer.description, url: `https://www.mgatc.com/servicios/${offer.slug}/`, offers: { '@type': 'Offer', price: offer.priceUsd, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } },
  })),
};

const faq = [
  ['¿Los precios son finales?', 'Son precios de referencia en USD para el alcance publicado. El cobro se realiza en el medio y moneda indicados por el checkout.'],
  ['¿Qué pasa si necesito una implementación?', 'El diagnóstico produce un alcance y presupuesto. Si avanzamos, el valor del diagnóstico aplicable se descuenta del proyecto.'],
  ['¿Trabajás solo con empresas de Argentina?', 'No. Las sesiones y entregas son remotas y pueden contratarse desde cualquier país compatible con el medio de pago acordado.'],
  ['¿Cuándo coordinamos la sesión?', 'Después del pago completás un onboarding breve. La coordinación se confirma dentro de las próximas 24 horas.'],
];

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) };

export default function ServicesPage() {
  return (
    <main id="main-content" className="signal-services-page">
      <JsonLd data={catalogSchema} />
      <JsonLd data={faqSchema} />
      <Navbar />
      <header className="signal-services-hero">
        <ContextBackLink href="/" label="Volver al inicio" />
        <span className="signal-eyebrow">MGA / Servicios a demanda</span>
        <h1>Resultados concretos.<br /><em>Sin proyectos abiertos.</em></h1>
        <p>Elegí un punto de partida con alcance, precio y entrega conocidos. Sin llamadas comerciales obligatorias antes de entender qué comprás.</p>
      </header>
      <OfferGrid heading={false} />
      <section className="signal-service-guarantee">
        <span>Cómo funciona</span>
        <div><strong>01</strong><p>Elegís el servicio que resuelve tu necesidad inmediata.</p></div>
        <div><strong>02</strong><p>Coordinamos agenda y recibís un formulario de contexto.</p></div>
        <div><strong>03</strong><p>Trabajamos sobre tu caso y entregamos próximos pasos accionables.</p></div>
      </section>
      <section className="signal-service-faq">
        <div><span className="signal-eyebrow">Antes de comprar</span><h2>Preguntas frecuentes.</h2></div>
        <div>{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>
      <Footer />
    </main>
  );
}
