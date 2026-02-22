import type { Metadata } from 'next';
import ConsultingPageClient from './ConsultingPageClient';

export const metadata: Metadata = {
  title: 'Consultoría Tecnológica | Automatización IA & BI para PyMEs',
  description:
    'Consultoría tecnológica especializada: Automatización de procesos, IA aplicada y Business Intelligence. Reducción de costos hasta 80%. Primera automatización 100% gratis.',
  openGraph: {
    title: 'MGA Tech Consulting - Automatización & IA para Pymes',
    description: 'Reduzca costos operativos hasta 80% con automatización, chatbots IA y dashboards en tiempo real. Primera automatización gratis.',
    url: 'https://mgobeaalcoba.github.io/consulting/',
  },
};

export default function ConsultingPage() {
  return <ConsultingPageClient />;
}
