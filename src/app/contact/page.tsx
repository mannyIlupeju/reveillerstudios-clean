import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop page',
  description: 'Shop our new releases out now'
};



function Page() {
  return (
    <section className="bg-gray-200">
    <main className="bg-gray-200 flex items-center flex-col h-[80vw] my-20 ">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-8">We would love to hear from you!</p> 

      <div>
        <p>Orders / Customer Service:</p>
        <span>reveillerstudios@outlook.com</span>
      </div>
      
    </main>

    </section>
  )
}

export default Page