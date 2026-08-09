'use client'

import React from 'react'
import NewsletterFooter from '@/components/NewsletterFooter/Newsletterfooter'

export default function Page() {
  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="text-sm flex-col items-center border-8 border-red-600 p-8">
        <NewsletterFooter />
      </div>
    </section>
  );
}
