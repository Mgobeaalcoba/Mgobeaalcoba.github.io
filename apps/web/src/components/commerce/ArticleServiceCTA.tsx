'use client';

import Link from '@/components/shared/TransitionLink';
import { ArrowRight } from 'lucide-react';
import { events } from '@/lib/gtag';
import { getOffer } from '@/lib/offers';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizePath } from '@/lib/i18n-routes';

export default function ArticleServiceCTA({ category }: { category: string }) {
  const { lang, t } = useLanguage();
  const normalized = category.toLowerCase();
  const slug = normalized.includes('career') || normalized.includes('lider') || normalized.includes('educ')
    ? 'mentoria-uno-a-uno'
    : normalized.includes('data') || normalized.includes('analytics') || normalized.includes('machine')
      ? 'auditoria-data-ia'
      : 'diagnostico-automatizacion';
  const offer = getOffer(slug)!;

  return (
    <aside className="signal-article-service">
      <span>{t('services_article_cta')}</span>
      <h2>{offer.name[lang]}</h2>
      <p>{offer.promise[lang]}</p>
      <div><strong>USD {offer.priceUsd}</strong><Link href={localizePath(`/servicios/${offer.slug}/`, lang)} onClick={() => events.selectItem(offer.slug, offer.name[lang], offer.priceUsd)}>{t('services_see_service')}<ArrowRight size={16} /></Link></div>
    </aside>
  );
}
