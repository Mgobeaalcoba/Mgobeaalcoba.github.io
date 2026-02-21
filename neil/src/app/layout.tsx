import type { Metadata } from 'next';
import Script from 'next/script';
import { LanguageProvider } from '@/contexts/LanguageContext';
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0B1120" />
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
              page_path: window.location.pathname,
              site_section: 'neil',
              client_name: 'Neil Climatizadores',
            });
          `}
        </Script>

        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
