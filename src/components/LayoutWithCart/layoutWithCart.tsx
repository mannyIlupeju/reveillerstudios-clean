'use client';

import React, { useEffect, useState } from 'react';
import SideNav from '../SideNavDisplay/SideNav';
import SideCart from '../SideCartDisplay/SideCart';
import CountrySwitchModal from '../CountrySwitchModal/CountrySwitchModal';
import BranddetailContainer from '../BrandDetailContainer/BranddetailContainer';
import ShopContainer from '../ShopContainer/ShopContainer';
import { useGlobalContext } from '../../Context/GlobalContext';
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  detectedCountry: 'CA' | 'US';
};

export default function LayoutWithCartClient({ children, detectedCountry }: Props) {
  const { isCartOpen, setIsCartOpen, isMenuOpen, isShopHovered, setOpenMenu } = useGlobalContext();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  const isCartPage = pathname === '/cart';
  const isPasswordRoute = pathname === '/password';

  // Detect if screen is mobile (< 1024px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close ShopContainer when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile && isShopHovered) {
      setOpenMenu(false); // Assuming this controls isShopHovered
    }
  }, [isMobile, isShopHovered, setOpenMenu]);

  // Handle body overflow when cart is open
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

  // Close cart when navigating to cart page
  useEffect(() => {
    if (pathname === '/cart') {
      setIsCartOpen(false);
    }
  }, [pathname, setIsCartOpen]);

  const toggleMenu = () => setOpenMenu(!isMenuOpen);

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
      {/* ShopContainer only shows on mobile */}
      {isMobile && isShopHovered && !isCartOpen && <ShopContainer />}
      {!isCartPage && <SideCart />}
    </>
  );
}
