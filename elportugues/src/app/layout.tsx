import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ContentRepository from '@/services/contentService';

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
              custom_map: {
                dimension1: 'site_section',
                dimension2: 'client_name'
              }
            });
            gtag('set', { 'site_section': 'elportugues', 'client_name': 'El Portugues SA' });
          `}
        </Script>
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
