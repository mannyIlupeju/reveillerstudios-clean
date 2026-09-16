import React from 'react';
import type { Metadata, Viewport } from 'next';
import Image from 'next/image';
import { detectCountry } from '@/utils/detectCountry/detectCountry';
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

// TEMPORARY: the "Welcome to Reveiller Studios" preloader splash is
// switched off below (SHOW_PRELOADER = false) while a Klaviyo toll-free SMS
// registration is under review. Klaviyo's compliance reviewer rejected the
// site with "couldn't be reviewed... may include prohibited content /
// placeholder content", and PreloaderGate has a real bug that's a strong
// suspect: it returns `null` for everything -- including all of {children},
// i.e. the entire site -- until client-side hydration finishes
// (`if (!hydrated) return null` in PreloaderGate.tsx). Any reviewer that
// fetches the page without fully executing JS (or times out before/at the
// 2s+300ms splash) sees a blank page or a black splash screen with a logo
// gif instead of the real site, which reads exactly like a placeholder/
// landing page.
// Flip SHOW_PRELOADER back to true once Klaviyo's review passes. Consider
// also fixing PreloaderGate's `!hydrated` early return so real crawlers
// or bots see full content immediately instead of relying on this flag.
const SHOW_PRELOADER = false;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const country = await detectCountry();

  const content = (
    <AppProviders>
      <ScrollManager/>
      <CookieConsentModal />
      <LayoutWithCart detectedCountry={country}>
        {children}
      </LayoutWithCart>
    </AppProviders>
  );

  return (
    <html lang="en">
      <body>
        {SHOW_PRELOADER ? (
          <PreloaderGate
            duration={2000}
            onlyFirstVisit={true}
            withFade={true}
            bgClass="bg-black text-white"
            splash={
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-96 h-96">
                <Image
                  src="/images/rvrspinninglogo-unscreen2.gif"
                  unoptimized
                  alt="Loading Reveiller"
                  width={400}
                  height={400}
                  className="w-96 h-96"
                  priority
                />
                </div>
                <p className="mt-4 text-xl font-medium animate-pulse">
                  Welcome to Reveiller Studios
                </p>
              </div>
            }
          >
            {content}
          </PreloaderGate>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
