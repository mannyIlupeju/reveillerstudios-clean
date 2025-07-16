import React from 'react'
import Link from 'next/link'


export default function BranddetailContainer() {
  return (
    <div className="bottom-[85px] left-50 w-full max-h-[60vh] fixed z-30 shadow-lg flex flex-col glassBox transition">
        <div className="flex flex-col gap-4 p-4">
          <Link href="/archive">Archive</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/about">About</Link>
        </div>
    </div>
  )
}
