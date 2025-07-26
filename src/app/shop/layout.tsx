import React from 'react'
import Navigation from '@/components/Navigation/Navigation'
import Footer from '@/components/Footer/Footer'

function layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Navigation />

      <main className="flex flex-col">
        {children}
      </main>

      <Footer/>
    </>
  )
}

export default layout