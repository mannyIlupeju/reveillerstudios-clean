import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { useGlobalContext } from '@/Context/GlobalContext'
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

import NavLogo from '../Navigation/NavLogo/NavLogo';
import * as motion from "motion/react-client"
import { usePathname } from 'next/navigation';   
import SideCart from '../../components/SideCartDisplay/SideCart'



const SideNav = () => {

  const [cartQuantity, setCartQuantity]= useState<string | number>(0)
 

  const pathname = usePathname();

  const linkClass = (path: string) =>
    `rounded-md transition-colors duration-200 ${
      pathname === path
        ? 'bg-orange-400 text-white font-bold p-2'
        : 'text-gray-600 hover:bg-orange-200 font-bold p-2'
    }`;
  



  const cartState = useSelector((state: RootState) => state.cart)
  const cartQty = Number(cartState.totalQuantity)

  const {isMenuOpen, setOpenMenu, toggleMenu, isCartOpen, toggleCart} = useGlobalContext()
  
  useEffect(() => {
    setCartQuantity(cartQty)
  }, [cartQty]);
  


  return (
        <div className="xl:hidden fixed bottom-2 left-1/2 -translate-x-1/2 w-[95%] max-w-md py-3 px-3 shadow-md rounded-t-md SideNav text-sm font-bold z-50 bg-white">
                <div className=" mx-auto flex gap-0 justify-between uppercase items-center font-extrabold">
                    <Link href='/' className={linkClass('/')}>Home</Link>
                    <Link href='/shop' className={linkClass('/shop')}>Shop</Link>
                    <a href="https://instagram.com/reveillerstudios" target="_blank" rel="noopener noreferrer" className={linkClass('/about')}>About</a>
                    {/* <Link href='/journal' className={linkClass('/journal')}>Journal</Link> */}

                    <div className="flex items-center" >
                        <div className={`flex gap-1 ${isCartOpen ? 'bg-zinc-400 text-white font-bold p-2' : 'text-gray-600 orange-hover font-bold p-2'} rounded-md transition-colors duration-200`} onClick={toggleCart}>
                            <h1>Cart</h1> 
                            <span>({cartQuantity})</span>
                        </div>
                    </div>
                </div>
        </div>
     
   
  )
}

export default SideNav