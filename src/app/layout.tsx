import React from 'react';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import AppProviders from './Providers/AppProviders';
import LayoutWithCart from '../components/LayoutWithCart/layoutWithCart';
import CookieConsentModal from '../components/CookieConsentModal/cookieConsent';
import PreloaderGate from '../components/PreloaderGate/PreloaderGate';
import ScrollManager from '@/components/ScrollManager/ScrollManager';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.reveillerstudios.com'),
  title: {
    default: 'Reveillerstudios',
    template: '%s | Reveillerstudios',
  },
  description:
    "Reimagining fashion through rebellion and refinement. Destroy, reconstruct, reveal.<br></br> Our tailored garments fuse quality fabrics, limited runs, and raw design energy into wearable art. Built for those who resist the ordinary.",
  openGraph: {
    type: 'website',
    siteName: 'Reveillerstudios',
    url: 'https://www.reveillerstudios.com',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Reveiller Studios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reveiller Studios',
    description:
      "Reimagining fashion through rebellion and refinement. Destroy, reconstruct, reveal.<br></br> Our tailored garments fuse quality fabrics, limited runs, and raw design energy into wearable art. Built for those who resist the ordinary.",
    images: ['https://www.reveillerstudios.com/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: '/',
  },
};

// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const country = headerStore.get('x-vercel-ip-country') === 'CA' ? 'CA' : 'US';

  return (
    <html lang="en">
      <body>
        <PreloaderGate
          duration={2000}
          onlyFirstVisit={true}
          withFade={true}
          bgClass="bg-black text-white"
          splash={
            <div className="flex flex-col items-center justify-center">
              <img
                src="/images/rvrspinninglogo-unscreen2.gif"
                alt="Loading Reveiller"
                className="w-96 h-96"
              />
              <p className="mt-4 text-xl font-medium animate-pulse">
                Welcome to Reveiller Studios
              </p>
            </div>
          }
        >
          <AppProviders>
            <ScrollManager/>
            <CookieConsentModal />
            <LayoutWithCart detectedCountry={country}>
              {children}
              <SpeedInsights />
              <Analytics />
            </LayoutWithCart>
          </AppProviders>
        </PreloaderGate>
      </body>
    </html>
  );
}
