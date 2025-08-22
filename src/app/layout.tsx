import React from 'react'
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import AppProviders from './Providers/AppProviders'
import LayoutWithCart from './layoutWithCart'
import { headers } from 'next/headers';
import CookieConsentModal from '../components/CookieConsentModal/cookieConsent';



import "./globals.css";




export const metadata: Metadata = {
  metadataBase: new URL("https://www.reveillerstudios.com"),
  title: {
    default: "Reveiller Studios",
    template: "%s | Reveiller Studios",
  },
  description:
    "Modern streetwear and creative drops. Tailored garments, limited runs, and quality fabrics.",
  openGraph: {
    type: "website",
    siteName: "Reveiller Studios",
    url: "https://www.reveillerstudios.com",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Reveiller Studios" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reveiller Studios",
    description:
      "Modern streetwear and creative drops. Tailored garments, limited runs, and quality fabrics.",
    images: ["https://www.reveillerstudios.com/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};



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
      <AppProviders> 
      <CookieConsentModal />
        <LayoutWithCart detectedCountry={country}>
          {children}
          <SpeedInsights/>
          <Analytics/>
        </LayoutWithCart>
        </AppProviders>
        
      </body>
    </html>
    
  );
}

