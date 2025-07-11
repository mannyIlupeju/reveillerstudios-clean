'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
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

const NavLink = ({ name, href }: NavLinkType) => {
  const [underlineVisible, setUnderlineVisible] = useState(false);
  const [linkName, setLinkName] = useState(name);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const isExternal = href.startsWith('http');
  
  
  const pathName = usePathname();
  const isActive = pathName?.startsWith(href);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const originalText = e.currentTarget.textContent || '';
    e.currentTarget.setAttribute('data-original-text', originalText);

    const id = setInterval(() => {
      setIsReversed((prev) => !prev);
      setLinkName(isReversed ? originalText.split('').reverse().join('') : originalText);
    }, 500);

    setIntervalId(id);
  };

  const handleMouseLeave = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setLinkName(name);
  };

 

  return (
    <div className="group">
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className={`${underlineVisible || isActive ? 'scale-x-100' : 'scale-x-0'}`}
            data-original-text={linkName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {linkName}
          </span>
        </a>
      ) : (
        <Link href={href}>
          <span
            className={`${underlineVisible || isActive ? 'scale-x-100' : 'scale-x-0'}`}
            data-original-text={linkName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {linkName}
          </span>
        </Link>
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

  
  // const navLinks = ['Shop', 'About'].map((name) => ({
  //   name,
  //   href: `/${name.toLowerCase().replace(/\s+/g, '')}`,
  // }));

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: 'https://instagram.com/reveillerstudios' }
  ];




  const cartState = useSelector((state: RootState) => state.cart)
  const cartQty = Number(cartState.totalQuantity)
  
  useEffect(() => {
    setCartQuantity(cartQty)
  }, [cartQty]);

  return (
    <nav className="flex xl:justify-between justify-center gap-4 mx-auto p-2 nav-font xl:sticky z-20 top-0 glassBox">
      <div className="xl:flex hidden justify-between items-center">
        <div className="flex lg:flex-row gap-5 flex-col justify-start items-center">
          <div className="hidden lg:flex w-fit items-start">
            <Image
              src="/images/rvrspinninglogo-unscreen2.gif"
              width={150}
              height={150}
              alt="rvr spinning logo"
              priority
            />
          </div>

          <div>   
          <NavLogo width={200} height={100}/>
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
            <button onClick={toggleCart} className="flex gap-1">
              <h1>Cart</h1> 
              <span>({cartQuantity})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive menu */}
      <div className="xl:hidden flex flex-col h-fit cursor-pointer ">
        <div className="flex justify-items-start h-fit" onClick={() => router.push('/') }>
         <NavLogo width={200} height={100} className="mx-auto"/>
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