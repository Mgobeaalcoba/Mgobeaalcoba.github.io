'use client';

import StudioPageIntro from '@/components/shared/StudioPageIntro';
import { OFFERS } from '@/lib/offers';
import OfferGrid from '@/components/commerce/OfferGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { SERVICES_FAQ, SERVICES_FAQ_LABEL, SERVICES_FAQ_TITLE, SERVICES_HERO, SERVICES_STEPS, SERVICES_STEPS_LABEL } from '@/lib/servicesCopy';

export default function ServicesPageClient() {
  const { lang, t } = useLanguage();

  return (
    <>
      <StudioPageIntro eyebrow={t('services_eyebrow')} title={<>{SERVICES_HERO.title[lang]}<br /><em>{SERVICES_HERO.emphasis[lang]}</em></>} description={SERVICES_HERO.subtitle[lang]} aside={<div className="mga-page-count"><strong>{OFFERS.length}</strong><span>{lang === 'es' ? 'puntos de partida, con alcance definido' : 'starting points with a defined scope'}</span><a href="#servicios" className="mga-text-link">{lang === 'es' ? 'Explorar servicios ↓' : 'Explore services ↓'}</a></div>} />
      <OfferGrid heading={false} />
      <section className="signal-service-guarantee">
        <span>{SERVICES_STEPS_LABEL[lang]}</span>
        {SERVICES_STEPS.map((step, index) => (
          <div key={step.es}><strong>0{index + 1}</strong><p>{step[lang]}</p></div>
        ))}
      </section>
      <section className="signal-service-faq">
        <div><span className="signal-eyebrow">{SERVICES_FAQ_LABEL[lang]}</span><h2>{SERVICES_FAQ_TITLE[lang]}</h2></div>
        <div>
          {SERVICES_FAQ.map((item, index) => (
            <details
              key={item.question.es}
              data-analytics={`services_faq_${index + 1}`}
              data-analytics-surface="services_faq"
            >
              <summary>{item.question[lang]}</summary>
              <p>{item.answer[lang]}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
