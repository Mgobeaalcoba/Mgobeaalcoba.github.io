import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SupabaseDataProvider } from "@/contexts/SupabaseDataContext";
import AppShell from "@/components/shared/AppShell";
import { DataErrorBoundary } from "@/components/shared/DataErrorBoundary";
import JsonLd from "@/components/shared/JsonLd";
import ContactModal from "@/components/shared/ContactModal";
import CommandPalette from "@/components/shared/CommandPalette";
import Script from "next/script";
import "./globals.css";
import "./signal.css";
import { getCareerExperienceYears } from "@/lib/experience";

const GA_ID = "G-DG0SLT5RY3";
const SITE_URL = "https://www.mgatc.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MGA Tech Consulting",
  url: SITE_URL,
  sameAs: ["https://www.linkedin.com/company/mga-tech-consulting"],
  logo: `${SITE_URL}/images/favicon-192.png`,
  description:
    `Consultoría tecnológica en automatización, IA aplicada y Business Intelligence para PyMEs. Más de ${getCareerExperienceYears()} años de experiencia en datos a escala.`,
  areaServed: { "@type": "Country", name: "Argentina" },
  founder: {
    "@type": "Person",
    name: "Mariano Gobea Alcoba",
    url: `${SITE_URL}/portfolio/`,
  },
  knowsAbout: [
    "automatización de procesos",
    "inteligencia artificial aplicada",
    "Business Intelligence",
    "Data Engineering",
    "consultoría tecnológica",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MGA Tech Consulting",
  url: SITE_URL,
  description:
    "Consultoría IA/BI y automatización para PyMEs, blog técnico y herramientas financieras.",
  publisher: {
    "@type": "Organization",
    name: "MGA Tech Consulting",
  },
  inLanguage: ["es", "en"],
};

export const metadata: Metadata = {
  applicationName: "MGA Tech Consulting",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "MGA" },
  title: {
    default: "MGA Tech Consulting | Automatización, IA & Datos para PyMEs",
    template: "%s | MGA Tech Consulting",
  },
  description:
    `Consultoría tecnológica en automatización, IA aplicada y Business Intelligence. Blog técnico, recursos financieros y más de ${getCareerExperienceYears()} años de experiencia en datos a escala.`,
  keywords: [
    "data analytics",
    "consultoría tecnológica",
    "automatización",
    "business intelligence",
    "python",
    "machine learning",
    "data engineer",
    "buenos aires",
  ],
  authors: [{ name: "MGA Tech Consulting", url: SITE_URL }],
  creator: "MGA Tech Consulting",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.mgatc.com",
    siteName: "MGA Tech Consulting",
    title: "MGA Tech Consulting | Automatización, IA & Datos para PyMEs",
    description:
      "Consultoría IA/BI y automatización para PyMEs, blog técnico y herramientas financieras.",
    images: [
      {
        url: "https://www.mgatc.com/og.png",
        width: 1200,
        height: 630,
        alt: "MGA Tech Consulting — Sistemas medibles para operar mejor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.mgatc.com/og.png"],
  },
  icons: {
    apple: "/images/favicon-192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070b12" },
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Domain redirect — raw <script> in <head> so it fires before any React code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(window.location.hostname!=='mgobeaalcoba.github.io')return;var p=window.location.pathname,s=window.location.search,t;if(p==='/'||p===''||p==='/index.html')t='/portfolio/';else if(/^\\/consulting(\\/|$|\\?)/.test(p))t='/';else t=p;window.location.replace('https://www.mgatc.com'+t+s);})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#111827" />
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content="Buenos Aires" />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};var c=null;try{c=localStorage.getItem('mga_consent_v1')}catch(e){};var analytics=c==='analytics'||c==='all'?'granted':'denied';var ads=c==='all'?'granted':'denied';window.gtag('consent','default',{analytics_storage:analytics,ad_storage:ads,ad_user_data:ads,ad_personalization:ads,wait_for_update:500});window.gtag('set','ads_data_redaction',true);})();`,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Saltar al contenido</a>
        <DataErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <SupabaseDataProvider>
                <div className="scroll-progress" />
                <AppShell>{children}</AppShell>
                <ContactModal />
                <CommandPalette />
              </SupabaseDataProvider>
            </LanguageProvider>
          </ThemeProvider>
        </DataErrorBoundary>
        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){dataLayer.push(arguments);};
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              send_page_view: false,
              site_section: 'cv',
            });
            window.mgaAnalyticsReady = true;
          `}
        </Script>
      </body>
    </html>
  );
}
