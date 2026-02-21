import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ContentRepository from '@/services/contentService';
import { GA_MEASUREMENT_ID } from '@/lib/gtag';

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
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
