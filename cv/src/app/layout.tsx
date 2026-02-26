import type { Metadata } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SupabaseDataProvider } from '@/contexts/SupabaseDataContext';
import AppShell from '@/components/shared/AppShell';
import { DataErrorBoundary } from '@/components/shared/DataErrorBoundary';
import JsonLd from '@/components/shared/JsonLd';
import './globals.css';

const GA_ID = 'G-DG0SLT5RY3';
const SITE_URL = 'https://www.mgatc.com';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mariano Gobea Alcoba',
  jobTitle: 'Data & Analytics Technical Leader',
  description:
    'Data & Analytics Technical Leader con más de 6 años de experiencia en Mercado Libre. Experto en BigQuery, Python, Machine Learning, IA y Business Intelligence. Consultor de automatización para PyMEs en Argentina.',
  url: SITE_URL,
  image: `${SITE_URL}/images/profile.png`,
  email: 'mgobeaalcoba@gmail.com',
  sameAs: [
    'https://linkedin.com/in/mgobeaalcoba',
    'https://github.com/Mgobeaalcoba',
    'https://twitter.com/MGobeaAlcoba',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Mercado Libre',
    url: 'https://mercadolibre.com',
  },
  knowsAbout: [
    'Data Engineering',
    'BigQuery',
    'Python',
    'Machine Learning',
    'Business Intelligence',
    'GenAI',
    'LLMs',
    'Apache Airflow',
    'dbt',
    'Apache Kafka',
    'automatización de procesos',
    'consultoría tecnológica',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Data & Analytics Technical Leader',
    occupationLocation: {
      '@type': 'Country',
      name: 'Argentina',
    },
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Buenos Aires',
    addressCountry: 'AR',
  },
  nationality: 'Argentine',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Mariano Gobea Alcoba',
  url: SITE_URL,
  description:
    'Portfolio interactivo, consultoría IA/BI para PyMEs, blog técnico y herramientas financieras.',
  author: {
    '@type': 'Person',
    name: 'Mariano Gobea Alcoba',
  },
  inLanguage: ['es', 'en'],
};

export const metadata: Metadata = {
  title: {
    default: 'Mariano Gobea Alcoba | Data & Analytics Technical Leader',
    template: '%s | Mariano Gobea Alcoba',
  },
  description:
    'Data & Analytics Technical Leader en Mercado Libre. Portfolio, consultoría tecnológica, blog técnico y recursos financieros. +6 años de experiencia en IA, Data Engineering y Business Intelligence.',
  keywords: [
    'data analytics', 'technical leader', 'mercadolibre', 'mariano gobea alcoba',
    'consultoría tecnológica', 'automatización', 'business intelligence',
    'python', 'machine learning', 'data engineer', 'buenos aires',
  ],
  authors: [{ name: 'Mariano Gobea Alcoba', url: SITE_URL }],
  creator: 'Mariano Gobea Alcoba',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://www.mgatc.com',
    siteName: 'Mariano Gobea Alcoba',
    title: 'Mariano Gobea Alcoba | Data & Analytics Technical Leader',
    description: 'Portfolio interactivo, consultoría IA/BI para PyMEs, blog técnico y herramientas financieras.',
    images: [
      {
        url: 'https://www.mgatc.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Mariano Gobea Alcoba',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MGobeaAlcoba',
    creator: '@MGobeaAlcoba',
  },
  icons: {
    apple: '/images/favicon-192.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#111827" />
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content="Buenos Aires" />
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
        {/* GA4 inline in <head> for tag quality score */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname,site_section:'cv',client_name:'Mariano Gobea Alcoba'});`,
          }}
        />
      </head>
      <body>
        {/* Calendly widget */}
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />

        {/* Redirect legacy GitHub Pages URLs to canonical domain with path mapping */}
        <Script id="domain-redirect" strategy="beforeInteractive">
          {`if(typeof window!=='undefined'&&window.location.hostname==='mgobeaalcoba.github.io'){var p=window.location.pathname;var t=p==='/'||p===''||p==='/index.html'?'/portfolio/':p.match(/^\\/consulting(\\/|$|\\?)/)?'/':p;window.location.replace('https://www.mgatc.com'+t+window.location.search);}`}
        </Script>

        <DataErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <SupabaseDataProvider>
                <AppShell>
                  {children}
                </AppShell>
              </SupabaseDataProvider>
            </LanguageProvider>
          </ThemeProvider>
        </DataErrorBoundary>
      </body>
    </html>
  );
}
