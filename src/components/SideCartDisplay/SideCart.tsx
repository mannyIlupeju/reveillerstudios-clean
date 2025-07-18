'use client'

import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import { IoCloseOutline } from "react-icons/io5";
import { FaMinus, FaPlus } from 'react-icons/fa';
import {motion, AnimatePresence} from "motion/react";
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
  const dispatch = useDispatch();
  const { setIsCartOpen, isCartOpen } = useGlobalContext();
  const { currency } = useCurrency();
  const cartItems = useSelector((state: RootState) => state.cart.cart);
  const [cartId, setCartId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    async function fetchCartId() {
      const response = await fetch("/api/get-cart-id");
      const data = await response.json();
      setCartId(data.cartId);
    }
    fetchCartId();
  }, []);

  if (!hydrated) return null;

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const handleCloseCart = () => setIsCartOpen(false);
  const handleGoToCart = () => router.push('/cart');

  const handleDecreaseQty = (item: any) => {
    if (item.quantity - 1 <= 0) {
      cartId && removeCartItem(item.id, cartId, dispatch);
      handleCloseCart();
    } else {
      updateCartQty(item.id, cartId, item.quantity - 1, dispatch);
    }
  };

  const handleIncreaseQty = (item: any) => {
    updateCartQty(item.id, cartId, item.quantity + 1, dispatch);
  };

  const handleRemoveItem = async (item: any) => {
    if (item.quantity < 1) {
      dispatch(clearCart());
    } else if (cartId) {
      try {
        await removeCartItem(item.id, cartId, dispatch);
        await refreshCart(cartId, dispatch);
      } catch (error) {
        // Optionally handle error
      }
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          key="sidecart"
          initial={isMobile ? { y: '100%' } : { x: '100%' }}
          animate={isMobile ? { y: 0 } : { x: 0 }}
          exit={isMobile ? { y: '100%' } : { x: '100%' }}
          transition={{ type: 'spring', bounce: 0.25, visualDuration: 0.28, ease: 'easeInOut' }}
          className={`
            fixed z-30 shadow-lg flex flex-col glassBox transition
            ${isMobile ? 'bottom-[85px] left-50 w-full max-h-[60vh]' : 'top-0 right-0 xl:w-[35vw]  h-screen'}
            SideCart
          `}
        >
          <div className="flex m-5 border-black sticky top-0 z-1 cursor-pointer">
            <IoCloseOutline
              size={24}
              onClick={handleCloseCart}
              className="absolute right-0 top-0  mr-2 cursor-pointer"
            />
            <h1 className="mx-auto">Your Bag</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-6 cursor-pointer justify-center">
            {cartItems.length !== 0 ? cartItems.map((item) => (
              <div key={item.id} className="flex flex-row">
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
                  <div className="flex w-fit mt-2 gap-2">
                    <button
                      className="disabled:opacity-50 hover:bg-gray-100 p-2"
                      onClick={() => handleDecreaseQty(item)}
                    >
                      <FaMinus className="flex self-center" />
                    </button>
                    <span className="font-bold text-sm flex self-center">{item.quantity}</span>
                    <button
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleIncreaseQty(item)}
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="flex items-start mt-2 py-2 text-zinc-800 rounded hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )) : 'You miss 100% of the shots you dont take - Wayne Gretzky - Michael Scott '}
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="text-lg">Sub Total:  </span>
                <span>{formatMoney(Number(cartTotal), currency.code)}</span>
              </div>
              <button
                className="border-black border-2 w-full p-2"
                onClick={handleGoToCart}
              >
                <h1>VIEW BAG</h1>
              </button>
            </div>
          </div>
          <p className="text-xl mx-auto my-4">Estimated Total: {currency.code} {formatMoney(Number(cartTotal), currency.code)} </p>
          <button
            className="bg-zinc-800 w-full text-white p-4 mx-auto"
            onClick={handleGoToCart}
          >
            <h1>VIEW BAG</h1>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}