import type { Metadata } from 'next';
import ConsultingPageClient from './consulting/ConsultingPageClient';
import JsonLd from '@/components/shared/JsonLd';
import { buildLocalizedMetadata } from '@/lib/localizedMetadata';
import { getConsultingSchema } from '@/lib/consultingSchema';

export const metadata: Metadata = buildLocalizedMetadata({
  path: '/',
  locale: 'es',
  title: 'MGA Tech Consulting | Automatización IA & BI para PyMEs',
  description:
    'Consultoría tecnológica especializada: Automatización de procesos, IA aplicada y Business Intelligence. Reducción de costos hasta 80%. Primera automatización 100% gratis.',
  openGraphTitle: 'MGA Tech Consulting - Automatización & IA para Pymes',
  openGraphDescription:
    'Reduzca costos operativos hasta 80% con automatización, chatbots IA y dashboards en tiempo real. Primera automatización gratis.',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={getConsultingSchema('es')} />
      <ConsultingPageClient />
    </>
  );
}
