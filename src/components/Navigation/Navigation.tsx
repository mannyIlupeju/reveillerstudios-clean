'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LinkWithLoader from '../LinkWithLoader/LinkWithLoader';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useReducedMotion } from 'motion/react';
import type { RootState } from '../../../store/store';
import { CartItem } from '../../../store/cartSlice';
import NavLogo from './NavLogo/NavLogo';
import { useGlobalContext } from '../../Context/GlobalContext'


type NavLinkType = {
  name: string;
  href: string;
};



interface NavLinksProps {
  links: NavLinkType[];
}

// Burst length and tick rate for the scramble effect.
const SCRAMBLE_DURATION = 300; // ms
const SCRAMBLE_SPEED = 12; // ticks per second

const NavLink = ({ name, href }: NavLinkType) => {
  const [displayName, setDisplayName] = useState(name);
  const isScramblingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isExternal = href.startsWith('http');
  const prefersReducedMotion = useReducedMotion();

  const pathName = usePathname();
  const isActive = pathName?.startsWith(href);

  // Character pool drawn only from the letters already in this link's own
  // name, so the scramble never shows a letter that doesn't belong to it.
  const poolRef = useRef(Array.from(new Set(name.replace(/\s/g, '').split(''))));

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (prefersReducedMotion || isScramblingRef.current) return;
    isScramblingRef.current = true;
    const start = Date.now();

    intervalRef.current = setInterval(() => {
      if (Date.now() - start >= SCRAMBLE_DURATION) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayName(name);
        isScramblingRef.current = false;
        return;
      }
      setDisplayName(
        name
          .split('')
          .map((char) =>
            char === ' ' ? ' ' : poolRef.current[Math.floor(Math.random() * poolRef.current.length)]
          )
          .join('')
      );
    }, 1000 / SCRAMBLE_SPEED);
  };

  const textSpan = (
    <span className="relative inline-block whitespace-pre" onMouseEnter={handleMouseEnter}>
      {displayName}
      <span
        aria-hidden="true"
        className={`absolute left-0 -bottom-1 h-[1.5px] w-full bg-current origin-left transition-transform duration-200 ease-out ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </span>
  );

  return (
    <div className="group">
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {textSpan}
        </a>
      ) : (
        <LinkWithLoader href={href}>
          {textSpan}
        </LinkWithLoader>
      )}
    </div>
  );
};

const NavLinks: React.FC<NavLinksProps> = ({ links }) => (
  <div className="lg:flex lg:gap-5 lg:flex-row flex-col text-md font-bold lg:items-center">
    {links.map((link) => (
      <NavLink key={link.name} {...link} />
    ))}
  </div>
);

const Navigation = () => {
  const [isMenuOpen, setOpenMenu] = useState(false);
  const [cartQuantity, setCartQuantity]= useState<string | number>(0)

  const {setIsCartOpen, toggleMenu, openCart, toggleCart} = useGlobalContext()

  const router = useRouter()



  const navLinks = [
    { name: 'Shop', href: '/shop/collections/all' },
    { name: 'About', href: '/about' },
    { name: 'Archive', href: '/gallery' },
  ];


  const cartState = useSelector((state: RootState) => state.cart)
  const cartQty = Number(cartState.totalQuantity)
  
  useEffect(() => {
    setCartQuantity(cartQty)
  }, [cartQty]);

  return (
    <nav className="flex xl:justify-between w-full justify-center gap-4 mx-auto p-2 nav-font xl:sticky z-20 xl:top-[53px] glassBox-nav">
      <div className="xl:flex hidden justify-between items-center">
        <div className="flex lg:flex-row gap-5 flex-col justify-start items-center">
          <div className="hidden lg:flex w-fit items-start">
            <Image
              src="/images/rvrspinninglogo-unscreen2.gif"
              unoptimized
              width={150}
              height={150}
              alt="rvr spinning logo"
              priority
            />
          </div>

          <div className="w-[400px] h-[100px] flex items-center justify-center">
            <Image src="/images/REVEILLERSTUDIOS.svg" alt="rvr logo" width={400} height={200} className="mx-auto logo" onClick={() => router.push('/')} />
          </div>
         
          <div className="p-2 flex flex-col justify-start items-center w-full">
            <span className="text-zinc-800 text-xs">
              Existence precedes Essence.
              <br />
              A Holistic and accessible approach to Functionality & Grunge.
            </span>
           
          </div>
        </div>
      </div>

   

      <div className="flex-row xl:flex hidden justify-end">
        <div className="flex gap-5">
          <NavLinks links={navLinks}/>
          <div className="flex items-center">
            <button onClick={() => {
              if(cartQty > 0 ) toggleCart()
            }} className={`flex gap-1 ${cartQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={cartQuantity === 0}
            >
              <h1>Cart</h1> 
              <span>({cartQuantity})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive menu */}
      <div className="xl:hidden flex flex-col h-fit cursor-pointer ">
        <div className="flex justify-items-start h-fit" onClick={() => router.push('/') }>
        <div className="w-[400px] h-[100px] flex items-center justify-center">
            <Image src="/images/REVEILLERSTUDIOS.svg" alt="rvr logo" width={400} height={200} className="mx-auto logo" />
          </div>
        </div>

         <div className="flex justify-center w-full -mt-4">
            <span className="text-zinc-800 text-xs">
              Existence precedes Essence.
            </span>
          </div>
      </div>
      
    </nav>
  );
};

export default Navigation;
