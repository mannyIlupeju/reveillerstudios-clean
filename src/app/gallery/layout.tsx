import UniqueNav from '@/components/Navigation/UniqueNav';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gallery",
  description: "Step inside the Reveiller Studios Gallery — a visual archive of creative shoots, pop ups and never seen before footages"
}

function layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <UniqueNav/>
      <main className="flex flex-col">
        {children}
      </main>

  
    </>
  )
}

export default layout