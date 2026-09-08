import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, stories, and updates from Reveiller Studios.',
  alternates: { canonical: 'https://www.reveillerstudios.com/blog' },
};

function page() {
  return (
    <section className="bg-gray-200">
    <main className="flex items-center flex-col h-screen ">
      <div>Blog</div>
    </main>
    </section>
  )
}

export default page