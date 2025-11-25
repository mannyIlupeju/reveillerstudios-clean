import React from 'react'
import Navigation from '@/components/Navigation/Navigation'
import Footer from '@/components/Footer/Footer'
import type { Metadata } from "next";


export const metadata: Metadata = {
  metadataBase: new URL("https://www.reveillerstudios.com"),
  title: {
    default: "Reveiller Studios",
    template: "%s | Reveiller Studios",
  },
  description: "Modern streetwear and creative drops. Shop limited runs and quality fabrics.",
  openGraph: {
    type: "website",
    url: "https://www.reveillerstudios.com",
    siteName: "Reveiller Studios",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Reveiller Studios",
      },
    ],
  },
  robots: { index: true, follow: true },
};


function layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Navigation />

      <main className="flex flex-col w-fit">
        {children}
      </main>

      <Footer/>
    </>
  )
}

export default layout