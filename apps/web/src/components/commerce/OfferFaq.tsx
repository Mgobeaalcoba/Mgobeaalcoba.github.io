import type { Language } from '@/contexts/LanguageContext';
import type { Offer } from '@/lib/offers';
import { buildOfferFaq } from '@/lib/offerFaq';

export default function OfferFaq({ offer, lang }: { offer: Offer; lang: Language }) {
  const items = buildOfferFaq(offer, lang);
  return (
    <section className="signal-offer-faq" aria-labelledby="offer-faq-title">
      <h2 id="offer-faq-title">{lang === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2>
      {items.map(({ question, answer }) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </section>
  );
}
