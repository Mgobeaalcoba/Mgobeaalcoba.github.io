import type { Language } from '@/contexts/LanguageContext';
import type { Offer } from './offers';

export type OfferFaqItem = { question: string; answer: string };

const join = (items: string[]) => items.join('; ');

/** Q&A built only from the offer's own data, so it never drifts from the page. */
export function buildOfferFaq(offer: Offer, lang: Language): OfferFaqItem[] {
  const es = lang === 'es';
  const name = offer.name[lang];
  const priceAnswer =
    offer.priceUsd != null
      ? es
        ? `${name} tiene un precio fijo de USD ${offer.priceUsd}, pago único. Duración: ${offer.duration[lang]}. Entrega: ${offer.delivery[lang]}.`
        : `${name} has a fixed price of USD ${offer.priceUsd}, single payment. Duration: ${offer.duration[lang]}. Delivery: ${offer.delivery[lang]}.`
      : es
        ? `${name} se cotiza a medida según el alcance. ${offer.pricingNote?.es ?? ''} Duración: ${offer.duration.es}. Entrega: ${offer.delivery.es}.`
        : `${name} is quoted to scope. ${offer.pricingNote?.en ?? ''} Duration: ${offer.duration.en}. Delivery: ${offer.delivery.en}.`;

  return [
    {
      question: es ? `¿Qué es ${name}?` : `What is ${name}?`,
      answer: `${offer.description[lang]} ${offer.promise[lang]}`.trim(),
    },
    {
      question: es ? `¿Para quién es ${name}?` : `Who is ${name} for?`,
      answer: join(offer.audience[lang]) + '.',
    },
    {
      question: es ? '¿Qué incluye?' : 'What is included?',
      answer: join(offer.includes[lang]) + '.',
    },
    {
      question: es ? '¿Cuánto cuesta y cuánto demora?' : 'How much does it cost and how long does it take?',
      answer: priceAnswer.replace(/\s+/g, ' ').trim(),
    },
    {
      question: es ? '¿Qué resultado obtengo?' : 'What outcome do I get?',
      answer: join(offer.outcome[lang]) + '.',
    },
  ];
}

export function buildOfferFaqSchema(offer: Offer, lang: Language) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: buildOfferFaq(offer, lang).map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
