'use client'

import React from 'react'
import Link from 'next/link'
import {useGlobalContext} from '../../Context/GlobalContext'


export default function BranddetailContainer() {

  const { isMenuOpen, setOpenMenu } = useGlobalContext();

  const handleCloseMenu = () => setOpenMenu(false);

  return (
    <div className="bottom-[85px] left-1/2 -translate-x-1/2 w-[95%] max-w-md max-h-[20vh] fixed z-30 shadow-lg flex flex-col glassBox transition">
        <div className="flex flex-col gap-4 p-4">
          <Link href="/gallery" onClick={handleCloseMenu}>Archive</Link>
          <Link href="/contact" onClick={handleCloseMenu}>Contact</Link>
          {/* <Link href="/about" onClick={handleCloseMenu}>About</Link> */}
        </div>
    </div>
  )
}
