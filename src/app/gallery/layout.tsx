import UniqueNav from '@/components/Navigation/UniqueNav';
import React from 'react';
import Navigation from '@/components/Navigation/Navigation'
import Footer from '@/components/Footer/Footer'

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