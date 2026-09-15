import type { Metadata } from 'next';
import ConsultingPageClient from '../consulting/ConsultingPageClient';
import JsonLd from '@/components/shared/JsonLd';
import { buildLocalizedMetadata } from '@/lib/localizedMetadata';
import { getConsultingSchema } from '@/lib/consultingSchema';

export const metadata: Metadata = buildLocalizedMetadata({
  path: '/',
  locale: 'en',
  title: 'MGA Tech Consulting | AI automation and BI for growing companies',
  description:
    'Technology consulting: process automation, applied AI and Business Intelligence. Up to 80% lower operating costs. First automation completely free.',
  openGraphTitle: 'MGA Tech Consulting - Automation & AI for growing companies',
  openGraphDescription:
    'Cut operating costs by up to 80% with automation, AI chatbots and real-time dashboards. First automation free.',
});

export default function EnglishHomePage() {
  return (
    <>
      <JsonLd data={getConsultingSchema('en')} />
      <ConsultingPageClient />
    </>
  );
}
