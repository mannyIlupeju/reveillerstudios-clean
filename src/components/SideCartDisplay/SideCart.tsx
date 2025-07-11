'use client'

import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import { FaXmark } from "react-icons/fa6";
import { FaMinus, FaPlus } from 'react-icons/fa';
import * as motion from "motion/react-client"
import Image from "next/image"
import { useGlobalContext } from '../../Context/GlobalContext';
import { RootState } from "../../../store/store";
import {useSelector, useDispatch} from 'react-redux'
import { removeItem, setLoading, updateQuantity, setCartItems, setError, clearCart } from "../../../store/cartSlice";
import { removeCartItem, updateCartQty, refreshCart, handleCheckout } from "../../utils/cartFunctions/cartFunctions";
import useIsMobile from '../../../hooks/useIsMobile';
import { useCurrency } from '../../Context/context/CurrencyContext';
import { formatMoney } from '../../utils/formatMoney';

export default function SideCart() {

  const router = useRouter();
  const [cartId, setCartId] = useState<string | null>(null);
  const dispatch = useDispatch();


  const {setIsCartOpen, isCartOpen} = useGlobalContext();

  console.log(isCartOpen)

  const { currency } = useCurrency();

  const cartItems = useSelector((state: RootState) => state.cart.cart);
  console.log("=== SIDE CART REDUX DATA ===");
  console.log("Cart items from Redux:", cartItems.length);
  cartItems.forEach((item, index) => {
    console.log(`Item ${index}:`, {
      id: item.id,
      variantId: item.variantId,
      title: item.title
    });
  });

  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  },0).toFixed(2)


  function goToCart(){
    router.push('/cart')
  }


  function closeCart(){
    console.log('Cart closed')
    setIsCartOpen(false)
  }

  useEffect(() => {
    async function fetchCartId(){
      const response = await fetch("/api/get-cart-id");
      const data = await response.json()
      setCartId(data.cartId);
      
    }
    fetchCartId();
  }, []);

  const isMobile = useIsMobile();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  console.log(isMobile)

  console.log("isMobile:", isMobile, "window.innerWidth:", typeof window !== "undefined" ? window.innerWidth : "SSR");
 

  return (
    <motion.div 
    initial={isMobile ? {y: '100%'} : { x: '100%' }}
    animate={isMobile ? {y:0} : { x: 0}}
    exit={isMobile ? {y: '100%'} : { x: '100%' }}
    transition={{ type: 'tween', duration: 0.15, ease: 'easeInOut' }}
    className={`
      fixed z-30 shadow-lg flex flex-col glassBox transition
      ${isMobile ? 'bottom-16 left-50 w-full max-h-[60vh]' : 'top-0 right-0 xl:w-[35vw]  h-screen'}
      bg-gray-200
    `}
    >
  
        <div className="flex m-5 border-black sticky top-0 z-1 cursor-pointer">
          <FaXmark onClick={closeCart} size={20}/>
          <h1 className="mx-auto">Your Bag</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 cursor-pointer justify-center">
          {cartItems.length !== 0 ? cartItems.map((item) => (
              <div key={item.id}
                  className='flex flex-row'
              >
                 <div className="w-48 relative ">
                  <Image
                      src={item.image}
                      fill
                      priority
                      alt={item.title}
                      className="xl:object-contain xl:aspect-ratio[4/5] aspect-ratio[2/3] object-contain w-fit flex justify-end"
                  />
                  </div>
          
                  <div className="flex flex-col justify-center">
                      <span className="text-md">{item.title}</span>
                      <span className="text-md"> Price: {formatMoney(Number(item.price * item.quantity), currency.code)}</span>

                      <span className="text-md">Size: {item.size.value}</span>
                    
                      <div className='flex w-fit mt-2 gap-2'>
                          <button 
                            className='disabled:opacity-50 hover:bg-gray-100 p-2'
                            onClick={() => {
                             
                              if (item.quantity - 1 <= 0) {
                                // Remove the item from the cart
                                cartId && removeCartItem(item.id, cartId, dispatch);
                                closeCart()
                              } else {
                                // Update the quantity as usual
                                updateCartQty(item.id, cartId, item.quantity - 1, dispatch);
                              }
                            }}
                          >
                            <FaMinus className='flex self-center' />
                          </button>
                          <span className='font-bold text-sm flex self-center'>
                          {item.quantity}
                          </span>
                          <button
                              className="p-2 hover:bg-gray-100 rounded"
                              onClick={() => {
                               
                                updateCartQty(item.id, cartId, item.quantity + 1, dispatch);
                              }}
                          >
                              <FaPlus className="w-4 h-4" />
                          </button>
                      </div>
                      <button 
                          onClick={async () => {
                            console.log("=== REMOVE BUTTON CLICKED ===");
                            console.log("item.id (lineId):", item.id);
                            console.log("item.variantId:", item.variantId);
                            console.log("cartId:", cartId);
                            
                            if (item.quantity < 1) {
                                dispatch(clearCart());
                            } else if (cartId) {
                                try {
                                    await removeCartItem(item.id, cartId, dispatch).then(()=> {
                                      console.log("Remove successful");
                                    });
                                    await refreshCart(cartId, dispatch);
                                } catch (error) {
                                    console.error("Remove failed:", error);
                                }
                            }
                          }}
                          className="flex items-start mt-2  py-2 text-zinc-800 rounded hover:underline"
                      >
                          Remove
                      </button>
                  </div>
              </div>
          )) : 'what are you waiting for ? '}
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-lg">Sub Total:  </span>
              <span >{formatMoney(Number(cartTotal), currency.code)}</span>
            </div>
          <button 
            className="border-black border-2 w-full p-2"
            onClick={() => router.push('/cart')}
            >
            <h1>OR FULL VIEW BAG</h1>
          </button>
          </div>
        
      </div>
     
      <p className="text-xl mx-auto">Estimated Total: {currency.code} {formatMoney(Number(cartTotal), currency.code)} </p>
      <button 
        className="bg-zinc-800 w-full text-white p-4 mx-auto"
        onClick={() => handleCheckout(cartId)}
        >
        Continue to Checkout
      </button>
     
    </motion.div>
  
  )
}