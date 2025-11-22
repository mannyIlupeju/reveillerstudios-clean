'use client';

import React, { useEffect } from 'react';
import SideNav from '../SideNavDisplay/SideNav';
import SideCart from '../SideCartDisplay/SideCart';
import CountrySwitchModal from '../CountrySwitchModal/CountrySwitchModal';
import BranddetailContainer from '../BrandDetailContainer/BranddetailContainer';
import {useGlobalContext} from '../../Context/GlobalContext'
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  detectedCountry: 'CA' | 'US';
};

export default function LayoutWithCartClient({ children, detectedCountry }: Props) {
  const { isCartOpen, setIsCartOpen, isMenuOpen, toggleMenu } = useGlobalContext();
  const pathname = usePathname();

  const isCartPage = pathname === '/cart';
  const isPasswordRoute = pathname === '/password';

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflowY = 'hidden';
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.style.overflowY = 'auto';
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.style.overflowY = 'auto';
      document.body.classList.remove('overflow-hidden');
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (pathname === '/cart') {
      setIsCartOpen(false);
    }
  }, [pathname, setIsCartOpen]);

  // Password route: minimal layout
  if (isPasswordRoute) {
    return <main className="flex flex-col">{children}</main>;
  }

  return (
    <>
      <div className="box3 items-center cursor-pointer xl:text-md text-xs sticky z-20">
        <p className="ticker-text">
          Get 20% off your first order when you subscribe! Free shipping on items over 200$ !
        </p>
      </div>

      {isCartOpen && !isCartPage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 blur-xl"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      {isMenuOpen && !isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 blur-xl"
          onClick={toggleMenu}
        />
      )}

      <CountrySwitchModal detectedCountry={detectedCountry} />

      <main className="flex flex-col">{children}</main>

      <SideNav />
      {isMenuOpen && !isCartOpen && <BranddetailContainer />}
      {!isCartPage && <SideCart />}
    </>
  );
}

