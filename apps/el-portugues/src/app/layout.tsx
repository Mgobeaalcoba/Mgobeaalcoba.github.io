import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ContentRepository from '@/services/contentService';
import { EpDataProvider } from '@/contexts/EpDataContext';
import { DataErrorBoundary } from '@/components/DataErrorBoundary';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import ConsentBanner from '@/components/ConsentBanner';

// GA property compartido con mgobeaalcoba.github.io — mismo panel, tráfico separado por page_location
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-DG0SLT5RY3';

const { description, keywords, siteName } = ContentRepository.getMeta();

export const metadata: Metadata = {
  title: `${siteName} | Logística y Distribución`,
  description,
  keywords,
  icons: {
    icon: '/elportugues-site/favicon.png',
    shortcut: '/elportugues-site/favicon.png',
    apple: '/elportugues-site/favicon.png',
  },
  openGraph: {
    title: `${siteName} | Logística y Distribución`,
    description,
    type: 'website',
    locale: 'es_AR',
    images: [
      {
        url: 'https://elportuguessa.com.ar/wp-content/uploads/2024/07/EP-Home-1-scaled.jpg',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Redirect legacy GitHub Pages domain → mgatc.com (fires before GA4) */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){if(window.location.hostname!=='mgobeaalcoba.github.io')return;var p=window.location.pathname,s=window.location.search,h=window.location.hash;window.location.replace('https://www.mgatc.com'+p+s+h);})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};var c=null;try{c=localStorage.getItem('mga_consent_v1')}catch(e){};var a=c==='analytics'||c==='all'?'granted':'denied',d=c==='all'?'granted':'denied';window.gtag('consent','default',{analytics_storage:a,ad_storage:d,ad_user_data:d,ad_personalization:d,wait_for_update:500});window.gtag('set','ads_data_redaction',true);})();` }} />
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
              site_section: 'elportugues',
              client_name: 'El Portugues SA'
            });
            window.mgaAnalyticsReady = true;
          `}
        </Script>
      </head>
      <body className="bg-black text-white antialiased">
        <DataErrorBoundary>
          <EpDataProvider><AnalyticsTracker />{children}<ConsentBanner /></EpDataProvider>
        </DataErrorBoundary>
      </body>
    </html>
  );
}
