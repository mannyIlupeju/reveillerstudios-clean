import UniqueNav from '@/components/Navigation/UniqueNav';
import React from 'react';

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