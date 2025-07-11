"use client";


import { useGlobalContext } from "@/Context/GlobalContext";
import Image from "next/image"
import { FaMinus, FaPlus } from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux'
import { removeItem, setLoading, updateQuantity, setCartItems, setError } from "../../../store/cartSlice";
import { removeCartItem, updateCartQty, refreshCart, handleCheckout } from "../../utils/cartFunctions/cartFunctions";
import {useEffect, useState} from 'react';
import { RootState } from "../../../store/store";
import { useCurrency } from '../../Context/context/CurrencyContext';
import { formatMoney } from '../../utils/formatMoney';   

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

    
    
     return (
        <section>
        <main className="flex flex-col gap-10 p-8 mx-auto min-h-screen">
            {cartItems.length > 0 ? (
                <>
                    {cartItems.map((item) => (
                        <div key={item.id}
                            className='flex flex-row mx-auto gap-4'
                        >
                            <Image
                                src={item.image}
                                width={120}
                                height={100}
                                priority
                                alt={item.title}
                            />

                            <div className="flex flex-col justify-center">
                                <h1>{item.title}</h1>
                                <p> 
                                    Price: {formatMoney(Number(item.price * item.quantity), currency.code)}
                                </p>
                                <p>Size: {item.size.value}</p>
                                <p className='font-bold text-lg'>
                                    Quantity:  {item.quantity}
                                </p>
                                <div className='flex  w-fit mt-2'>
                                    <button 
                                        className='disabled:opacity-50'
                                        onClick={() => updateCartQty(item.id, cartId, Math.max(0, item.quantity - 1), dispatch)}
                                    >
                                        <FaMinus className='flex self-center' />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-gray-100 rounded"
                                        onClick={() => updateCartQty(item.id, cartId, item.quantity + 1, dispatch)}
                                    >
                                        <FaPlus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => cartId && removeCartItem(item.id, cartId, dispatch)}
                                    className="flex items-start mt-2  py-2 text-zinc-900 rounded  hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <p className="text-xl mx-auto">Total: {currency.code} {formatMoney(Number(cartTotal), currency.code)} </p>

                    <button 
                    className="bg-zinc-800 w-fit text-white p-4 mx-auto"
                    onClick={() => handleCheckout(cartId)}
                    >
                        Continue to Checkout
                    </button>
                </>
            ) : (
                <div className="flex justify-center">
                    <h1>Cart is empty</h1>
                </div>
            )}
        </main>
        </section>
    );
}