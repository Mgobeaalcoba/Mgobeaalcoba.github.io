import type { Metadata } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AppShell from '@/components/shared/AppShell';
import './globals.css';

const GA_ID = 'G-DG0SLT5RY3';

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
  authors: [{ name: 'Mariano Gobea Alcoba', url: 'https://mgobeaalcoba.github.io' }],
  creator: 'Mariano Gobea Alcoba',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://mgobeaalcoba.github.io',
    siteName: 'Mariano Gobea Alcoba',
    title: 'Mariano Gobea Alcoba | Data & Analytics Technical Leader',
    description: 'Portfolio interactivo, consultoría IA/BI para PyMEs, blog técnico y herramientas financieras.',
    images: [
      {
        url: 'https://mgobeaalcoba.github.io/cv-site/logo.png',
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
    icon: '/cv-site/favicon.png',
    apple: '/cv-site/favicon.png',
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
      </head>
      <body>
        {/* Calendly widget */}
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />

        {/* Google Analytics 4 */}
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
              site_section: 'cv',
              client_name: 'Mariano Gobea Alcoba',
            });
          `}
        </Script>

        <ThemeProvider>
          <LanguageProvider>
            <AppShell>
              {children}
            </AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
