import React from 'react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import AppProviders from './Providers/AppProviders'
import LayoutWithCart from './layoutWithCart'
import { headers } from 'next/headers';
import CookieConsentModal from '../components/CookieConsentModal/cookieConsent';



import "./globals.css";


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

