"use client";


import { useGlobalContext } from "@/Context/GlobalContext";
import Image from "next/image"
import Link from "next/link";
import { FaMinus, FaPlus } from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux'
import { removeItem, setLoading, updateQuantity, setCartItems, setError } from "../../../store/cartSlice";
import { removeCartItem, updateCartQty, refreshCart, handleCheckout } from "../../utils/cartFunctions/cartFunctions";
import {useEffect, useState} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { RootState } from "../../../store/store";
import { useCurrency } from '../../Context/context/CurrencyContext';
import { formatMoney } from '../../utils/formatMoney';   
import Navigation from "../Navigation/Navigation";

type LineEdge = {
    node: {

        attributes: {
            key: string,
            value: string,
        }[],
        id: string,
        merchandise: {
            id:string,
            image: {
                src: string,
                altText:null,
            },
            priceV2: {
                amount:string,
                currencyCode: string
            },
            product: {
                handle:string,
                vendor: string,
                title:string,  
            },
        },
        quantity: number
    }

}

interface CartProps {
  cart: {
    lines: {
      edges: LineEdge[];
    };
  };
}


export default function CartDisplay({cart}:CartProps){

   
    const edges: LineEdge[] = cart.lines.edges
   

    const [cartId, setCartId] = useState<string | null>(null);
   
    const dispatch = useDispatch();

    const cartItems = useSelector((state: RootState) => state.cart.cart);

    const { currency } = useCurrency();
    const prefersReducedMotion = useReducedMotion();

    const cartTotal = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;      
    },0).toFixed(2)
    
    


   useEffect(() => {
    console.log("Cart UI Re-rendering with new items:", cartItems);
   }, [cartItems]);
  


    useEffect(() => {
        if(cart?.lines.edges) {
            const cartItems = cart.lines.edges.map(edge => ({
                id: edge.node.id,
                quantity: edge.node.quantity,
                title: edge.node.merchandise.product.title,
                price: Number(edge.node.merchandise.priceV2.amount),
                currencyCode: edge.node.merchandise.priceV2.currencyCode, // Add this
                image: edge.node.merchandise.image.src,
                size: {
                    name: 'Size',
                    value: edge.node.attributes.find(attr => attr.key === 'Size')?.value || ''
                },
                variantId: edge.node.merchandise.id,
                merchandise: {
                    id: edge.node.merchandise.id,
                    image: {
                        src: edge.node.merchandise.image.src,
                        altText: edge.node.merchandise.image.altText
                    },
                    priceV2: {
                        amount: Number(edge.node.merchandise.priceV2.amount),
                        currencyCode: edge.node.merchandise.priceV2.currencyCode
                    },
                    product: {
                        title: edge.node.merchandise.product.title,
                        handle: edge.node.merchandise.product.handle,
                        vendor: edge.node.merchandise.product.vendor
                    }
                },
                attributes: edge.node.attributes
            }));
            dispatch(setCartItems(cartItems));
        }
    }, [cart, dispatch]);

    

    useEffect(() => {
        async function fetchCartId(){
            const response = await fetch("/api/get-cart-id");
            const data = await response.json()
            setCartId(data.cartId);
        }
        fetchCartId();
    }, []);

    console.log(cartId)

    
     return (
        <>
        <Navigation/>
        <section className="flex justify-center ">
        <main className="flex flex-col justify-center gap-6 md:gap-10 border-black border-dashed p-4 md:p-8 mx-auto mt-4 md:mt-8 max-w-6xl">
        <div className="text-center font-bold mb-2 md:mb-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl">Your Shopping Cart</h1>
        </div>
        
        {cartItems.length > 0 ? (
            <>
            <div className="flex flex-col gap-4 md:gap-6">
                <AnimatePresence initial={false}>
                {cartItems.map((item) => (
                <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-gray-200 last:border-b-0 overflow-hidden"
                >
                    {/* Image */}
                    <div className="flex-shrink-0 w-full sm:w-32 md:w-48 lg:w-56 mx-auto sm:mx-0">
                    <Image
                        src={item.image}
                        width={200}
                        height={150}
                        priority
                        alt={item.title}
                        className="w-full h-auto object-cover rounded"
                    />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <h2 className="text-base md:text-lg font-semibold mb-2">{item.title}</h2>
                        <p className="text-sm md:text-base text-gray-700"> 
                        Price: {formatMoney(Number(item.price * item.quantity), currency.code)}
                        </p>
                        <p className="text-sm md:text-base text-gray-700">Size: {item.size.value}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                        <div className="flex items-center gap-3">
                        <span className="font-bold text-sm md:text-base">Quantity:</span>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                            <button 
                            className="disabled:opacity-50 p-2 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => updateCartQty(item.id, cartId, Math.max(0, item.quantity - 1), dispatch)}
                            aria-label="Decrease quantity"
                            >
                            <FaMinus className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            
                            <span className="min-w-[2rem] text-center font-semibold text-sm md:text-base">
                            {item.quantity}
                            </span>
                            
                            <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            onClick={() => updateCartQty(item.id, cartId, item.quantity + 1, dispatch)}
                            aria-label="Increase quantity"
                            >
                            <FaPlus className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        </div>
                        </div>

                        {/* Remove Button */}
                        <button 
                        onClick={() => cartId && removeCartItem(item.id, cartId, dispatch)}
                        className="text-sm md:text-base text-red-600 hover:text-red-800 hover:underline transition-colors self-start sm:self-center"
                        >
                        Remove
                        </button>
                    </div>
                    </div>
                </motion.div>
                ))}
                </AnimatePresence>
            </div>

            {/* Total and Checkout */}
            <div className="flex flex-col gap-4 mt-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-center">
                Total: {currency.code} {formatMoney(Number(cartTotal), currency.code)}
                </p>

                <button 
                className="bg-zinc-800 hover:bg-zinc-900 w-full max-w-md text-white p-3 md:p-4 mb-24 font-bold text-base md:text-lg mx-auto rounded-lg transition-colors checkout-button"
                onClick={() => handleCheckout(cartId)}
                >
                Continue to Checkout
                </button>
            </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
            <h2 className="text-lg md:text-xl">Your cart is empty</h2>
            <Link 
                href="/shop" 
                className="bg-zinc-800 hover:bg-zinc-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
                Continue Shopping
            </Link>
            </div>
        )}
        </main>
        </section>
        </>
    );
}