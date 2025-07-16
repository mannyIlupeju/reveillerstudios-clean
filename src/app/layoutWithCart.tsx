'use client';

import React, {useEffect} from 'react';
import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/Footer/Footer';
import SideNav from '../components/SideNavDisplay/SideNav';
import SideCart from '../components/SideCartDisplay/SideCart';
import { useGlobalContext } from '../Context/GlobalContext';
import { usePathname } from 'next/navigation';
import CountrySwitchModal from '../components/CountrySwitchModal/CountrySwitchModal';
import BranddetailContainer from '@/components/BrandDetailContainer/BranddetailContainer';

type Props = {
  children: React.ReactNode;
  detectedCountry: 'CA' | 'US';
};

export default function LayoutWithCart({ children, detectedCountry }: Props) {
  const { isCartOpen, setIsCartOpen, isMenuOpen, toggleMenu } = useGlobalContext();

  const pathname = usePathname();

  const isCartPage = pathname === '/cart';


    useEffect(() => {
      if (isCartOpen) {
        document.body.style.overflowY = "hidden";
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.style.overflowY = "auto";
        document.body.classList.remove("overflow-hidden");
      }
  
      return () => {
        document.body.style.overflowY = "auto"; // Cleanup on unmount
        document.body.classList.remove("overflow-hidden");
      };
    }, [isCartOpen]);


    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768 && isMenuOpen) {
          toggleMenu();
        }
      };

      window.addEventListener('resize', handleResize);

      // Initial check on mount
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [isMenuOpen, toggleMenu]);


    useEffect(() => {
      if (pathname === '/cart') {
        setIsCartOpen(false);
      }
    }, [pathname, setIsCartOpen]);



  return (
    <>
      <div 
        className="box3 items-center cursor-pointer xl:text-md text-xs">
        <p className="ticker-text">
        Welcome to Reveiller Studios! Free shipping on items over 200$ !
        </p>
      </div>
      {isCartOpen && !isCartPage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 blur-xl"
          onClick={() => setIsCartOpen(false)} // Clicking outside closes the cart
        ></div>
      )}
      {isMenuOpen && !isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 blur-xl"
          onClick={() => toggleMenu()} // Clicking outside closes the menu
        ></div>
      )}

      <Navigation />

      <CountrySwitchModal detectedCountry={detectedCountry} /> 

      <main className="flex flex-col">
        {children}
      </main>
    
      <Footer />

      <SideNav/>
    
      {isMenuOpen && !isCartOpen && <BranddetailContainer/> }
      {isCartOpen && !isCartPage && !isMenuOpen && <SideCart/>}
    </>
  )
}