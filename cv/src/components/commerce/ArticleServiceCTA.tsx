'use client';

import Link from '@/components/shared/TransitionLink';
import { ArrowRight } from 'lucide-react';
import { events } from '@/lib/gtag';
import { getOffer } from '@/lib/offers';

export default function ArticleServiceCTA({ category }: { category: string }) {
  const normalized = category.toLowerCase();
  const slug = normalized.includes('career') || normalized.includes('lider') || normalized.includes('educ')
    ? 'mentoria-uno-a-uno'
    : normalized.includes('data') || normalized.includes('analytics') || normalized.includes('machine')
      ? 'auditoria-data-ia'
      : 'diagnostico-automatizacion';
  const offer = getOffer(slug)!;

  return (
    <aside className="signal-article-service">
      <span>Convertí la lectura en una decisión</span>
      <h2>{offer.name}</h2>
      <p>{offer.promise}</p>
      <div><strong>USD {offer.priceUsd}</strong><Link href={`/servicios/${offer.slug}/`} onClick={() => events.selectItem(offer.slug, offer.name, offer.priceUsd)}>Ver servicio<ArrowRight size={16} /></Link></div>
    </aside>
  );
}
