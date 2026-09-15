'use client';

import ContextBackLink from '@/components/shared/ContextBackLink';
import CheckoutReturnStatus from '@/components/commerce/CheckoutReturnStatus';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizePath } from '@/lib/i18n-routes';

export default function ThanksPageClient() {
  const { lang, t } = useLanguage();

  return (
    <section>
      <ContextBackLink href={localizePath('/servicios/', lang)} label={t('services_back_services')} />
      <span className="signal-eyebrow">{t('thanks_eyebrow')}</span>
      <h1>
        {lang === 'es'
          ? <>Revisemos el estado<br /><em>de tu operación.</em></>
          : <>Let us review the status<br /><em>of your transaction.</em></>}
      </h1>
      <CheckoutReturnStatus />
      <div>
        <strong>01</strong><span>{t('thanks_step_1')}</span>
        <strong>02</strong><span>{t('thanks_step_2')}</span>
        <strong>03</strong><span>{t('thanks_step_3')}</span>
      </div>
    </section>
  );
}
