'use client';

import ContextBackLink from '@/components/shared/ContextBackLink';
import OfferGrid from '@/components/commerce/OfferGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { SERVICES_FAQ, SERVICES_FAQ_LABEL, SERVICES_FAQ_TITLE, SERVICES_HERO, SERVICES_STEPS, SERVICES_STEPS_LABEL } from '@/lib/servicesCopy';

export default function ServicesPageClient() {
  const { lang, t } = useLanguage();

  return (
    <>
      <header className="signal-services-hero">
        <ContextBackLink href="/" label={t('services_back_home')} />
        <span className="signal-eyebrow">{t('services_eyebrow')}</span>
        <h1>{SERVICES_HERO.title[lang]}<br /><em>{SERVICES_HERO.emphasis[lang]}</em></h1>
        <p>{SERVICES_HERO.subtitle[lang]}</p>
      </header>
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
          {SERVICES_FAQ.map((item) => (
            <details key={item.question.es}>
              <summary>{item.question[lang]}</summary>
              <p>{item.answer[lang]}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
