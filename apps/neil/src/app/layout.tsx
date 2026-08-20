import type { Metadata } from 'next';
import Script from 'next/script';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NeilDataProvider } from '@/contexts/NeilDataContext';
import { DataErrorBoundary } from '@/components/DataErrorBoundary';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import ConsentBanner from '@/components/ConsentBanner';
import './globals.css';

const GA_ID = 'G-DG0SLT5RY3';

export const metadata: Metadata = {
  title: 'Neil Climatizadores | Innovación y Confort para Cada Vehículo',
  description:
    'Especialistas en climatización evaporativa, aires acondicionados y calderas para motorhomes, camiones y vehículos especiales. Tecnología patentada (AR-031005B1). Presencia en Argentina y toda Europa.',
  keywords: [
    'climatizador', 'evaporativo', 'motorhome', 'camion', 'aire acondicionado',
    'caldera', 'pre-enfriado', 'neil', 'vehiculo', '12v', '24v',
    'climatiseur', 'klimaanlage', 'climatizzatore', 'caravane',
  ],
  openGraph: {
    title: 'Neil Climatizadores | Tecnología que te acompaña',
    description: 'Climatizadores evaporativos con patente exclusiva para motorhomes y camiones. Presencia en Argentina y Europa.',
    url: 'https://neil.com.ar',
    siteName: 'Neil Climatizadores',
    type: 'website',
    images: [{ url: 'https://mgobeaalcoba.github.io/neil-site/images/logo-neil.png', width: 879, height: 638 }],
  },
  icons: {
    icon: '/neil-site/favicon.png',
    apple: '/neil-site/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Redirect legacy GitHub Pages domain → mgatc.com (fires before GA4) */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){if(window.location.hostname!=='mgobeaalcoba.github.io')return;var p=window.location.pathname,s=window.location.search,h=window.location.hash;window.location.replace('https://www.mgatc.com'+p+s+h);})();` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0B1120" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};var c=null;try{c=localStorage.getItem('mga_consent_v1')}catch(e){};var a=c==='analytics'||c==='all'?'granted':'denied',d=c==='all'?'granted':'denied';window.gtag('consent','default',{analytics_storage:a,ad_storage:d,ad_user_data:d,ad_personalization:d,wait_for_update:500});window.gtag('set','ads_data_redaction',true);})();` }} />
      </head>
      <body>
        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              send_page_view: false,
              site_section: 'neil',
              client_name: 'Neil Climatizadores',
            });
            window.mgaAnalyticsReady = true;
          `}
        </Script>

        <DataErrorBoundary>
          <NeilDataProvider>
            <LanguageProvider>
              <AnalyticsTracker />
              {children}
              <ConsentBanner />
            </LanguageProvider>
          </NeilDataProvider>
        </DataErrorBoundary>
      </body>
    </html>
  );
}
