'use client'

import React, {useState, useEffect} from 'react'
import DOMPurify from 'isomorphic-dompurify';
import { useSelector, useDispatch} from 'react-redux'
import Accordion from '../../components/Accordion/Accordion';
import { getAccordionData  } from '../../utils/AccordionDataObj/accordion';
import { FaMinus, FaPlus } from 'react-icons/fa';
import Cookies from 'js-cookie'
import { useGlobalContext } from '../../Context/GlobalContext';
import { setLoading, setError } from '../../../store/cartSlice';
import type { RootState } from '../../../store/store';
import { CartItem } from '../../../store/cartSlice';
import { refreshCart } from '../../utils/cartFunctions/cartFunctions';
import { useCurrency } from '../../Context/context/CurrencyContext';
import { formatMoney } from '../../utils/formatMoney';



  type Attribute = {
    key: string,
    value:string
  }


  type LineItemTypes = {
    merchandiseId: string,
    quantity: number,
    attributes: {}
  };
  
  type ShopifyCartID = {
    shopifyCartId: string
  };

  type ShopifyCartResponse = {
  cart: {
    id: string
  }
}


  type SelectedOption = {
    name: string;
    value: string;
  };

  type SizeInfo = {
    availableForSale: boolean;
    id: string;
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    quantityAvailable: number;
    title: string;
    selectedOptions: SelectedOption[]; // This ensures selectedOptions is always an array
  };



export default function ProdDetailsConfiguration({id, title, priceRange, variants, descriptionHtml, collections, images}:any) {
  const [isButtonSelected, setSelectButton] = useState<string | null>(null)
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<{[key: string]: number}>({});
  const [isItemAddedToCart, setIsItemAddedToCart] = useState<'default'| 'loading' | 'added'>('default')
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState<string>('Add to Cart')
  const dispatch = useDispatch()
  const cartState = useSelector((state: RootState) => state.cart)

  const { currency } = useCurrency();

  const {quantityAvailable, setQuantityAvailable, sizeInfo, setSizeInfo, cartId, setCartId, setIsCartOpen}= useGlobalContext()

  const sizeDetails = sizeInfo.selectedOptions[1] ?? null;

  const collectionItemSearch = collections.edges.map((item:any) => item.node.title)
  const collectionItems = collectionItemSearch.filter((item:any) => item !== "All")

  const collectionItem = collectionItems[0]



  const productVariants = variants.edges.map((item:any)=>{
    return item.node
  })

  const productPrice = priceRange.minVariantPrice.amount

  const productImages = images.edges.map((item:any) => item.node.originalSrc)
  const productImage = productImages[0]


  function selectSize(e:React.MouseEvent, id:string){
    e.preventDefault();
    console.log("select size")

    const sizeExist = productVariants.find((item:any) => item.id === id);


    if(sizeExist){
      setSelectButton(id)
      setQuantityAvailable(sizeExist.quantityAvailable)
      setSizeInfo(sizeExist)
    }
    
  }

  const increaseAmt = (variantId: string, quantityAvailable: number|null) => {
    if(quantityAvailable === null) return;

    setQuantity(prev => {
      const currentQty = prev[variantId] || 1;
      if (quantityAvailable > currentQty) {
        return {...prev, [variantId]: currentQty + 1};
      }
      return prev;
    });
}
  
  const decreaseAmt = (variantId: string) => {
    setQuantity(prev => {
      const currentQty = prev[variantId] || 1;
      if (currentQty > 1) {
        return {...prev, [variantId]: currentQty - 1};
      }
      return prev;
    });
  }

  useEffect(() => {
    setSelectButton(null);
    setQuantityAvailable(null);
    setSizeInfo({
      availableForSale: false,
      id: "",
      priceV2: { amount: "", currencyCode: "" },
      quantityAvailable: 0,
      title: "",
      selectedOptions: [],
    });
    setIsItemAddedToCart('default'); // or false, depending on your state
    setQuantity({});
  }, [id, setQuantityAvailable, setSizeInfo]);


  
  async function AddToCart({title, productImage, quantities, productPrice, variants}:any){
    if (isItemAddedToCart === 'loading') return; // Prevent double add
    if(!isButtonSelected){
      console.error("No size selected")
      return;
    }

    console.log(variants)
    
    const productAdded = {
      title,
      productImage,
      quantity: Number(quantities) || 1, 
      productPrice, 
      variants
    }

    const productVariantID = sizeInfo?.id
    if(!productVariantID) {
      console.error("Variant ID is missing")
      return;
    }

    const selectedQuantity = quantity[isButtonSelected] || 1;

    try {
      if(!productVariantID) {
        return;
      }

      let shopifyCartId: string | undefined = Cookies.get('cartId');
      let cartJustCreated = false;

      if (!shopifyCartId) {
        const response = await fetch('/api/shopifyCart/createCart', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            lines: [{
              merchandiseId: productVariantID,
              quantity: selectedQuantity,
              attributes: [
                { key: 'Size', value: sizeDetails.value }
              ]
            }]
          })
        });

        if (!response.ok) {
          throw new Error('Failed to add product to cart')
        }
        const cartData:ShopifyCartResponse = await response.json();
        if(cartData.cart.id){
          shopifyCartId = cartData.cart.id;
          Cookies.set('cartId', shopifyCartId as string, { expires: 7 });
          setCartId(shopifyCartId)
          cartJustCreated = true;
        } else {
          console.error("Cart ID not found in response:", cartData);
          return;
        }
      } else {
        setCartId(shopifyCartId)
      }

      const lineItems:LineItemTypes[] = [{
        merchandiseId: productVariantID,
        quantity: selectedQuantity,
        attributes: ({
          key: sizeDetails.name,
          value: sizeDetails.value
        })
      }]

      setIsItemAddedToCart('loading')
      setIsCartLoading(true);
      setCartError(null);
      if (cartJustCreated) {
        // Only refresh cart, do NOT add item again
        const mappedCart = await refreshCart(shopifyCartId, dispatch);
        // Check if the expected item and quantity are present
        const found = mappedCart?.find(
          item => item.variantId === productVariantID && item.quantity === selectedQuantity
        );
        if (found) {
          setIsItemAddedToCart('added');
          setIsCartOpen(true);
          setCartError(null);
          console.log("Product added to cart successfully (cart created)");
        } else {
          setIsItemAddedToCart('default');
          setCartError('There was a problem adding the item to your cart. Please try again.');
        }
        setIsCartLoading(false);
      } else {
        await addItemToCart(shopifyCartId, lineItems)
        setIsCartLoading(false);
      }

     } catch(error){
       console.error('Error creating cart:', error);
       return null;
     }


      async function addItemToCart(shopifyCartId:string, lineItems:LineItemTypes[]){
        
        if(!shopifyCartId && lineItems.length === 0){
          return;
        }
      

          try {
            const selectedQuantity = quantity[isButtonSelected!] || 1;


           const cartItem: CartItem = {
             id: `temp_${productVariantID}`, // Use temporary ID initially
             title: title,
             price: Number(productPrice),
             quantity: selectedQuantity,
             image: productImage,
             currencyCode:
               variants.edges[0]?.node.priceV2.currencyCode || "USD", // Get from variants
             size: {
               name: sizeDetails.name,
               value: sizeDetails.value,
             },
             variantId: productVariantID,
             merchandise: {
               id: productVariantID,
               image: {
                 src: productImage,
                 altText: null,
               },
               priceV2: {
                 amount: Number(productPrice),
                 currencyCode:
                   variants.edges[0]?.node.priceV2.currencyCode || "USD",
               },
               product: {
                 title: title,
                 handle: variants.edges[0]?.node.product?.handle || "",
                 vendor: variants.edges[0]?.node.product?.vendor || "",
               },
             },
             attributes: [
               {
                 key: "Size",
                 value: sizeDetails.value,
               },
             ],
           };

            if (!sizeDetails || !sizeDetails.value) {
              setCartError('Please select a size.');
              return;
            }
            
            // Do NOT do this:
            // dispatch(addItem(cartItem));
            
            dispatch(setLoading(true));


            const response = await fetch('/api/shopifyCart/addItemToCart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cartId: shopifyCartId,
                lines: [
                  {
                    merchandiseId: productVariantID,
                    quantity: selectedQuantity,
                    attributes: [
                      {
                        key: sizeDetails.name,
                        value: sizeDetails.value
                      }
                    ]
                  }
                ]
              })
            });
            
            
            if (!response.ok) {
              throw new Error('Failed to add item to cart');
            }
            
            // Refresh cart to get the correct line IDs from Shopify
            await refreshCart(shopifyCartId, dispatch);
            
            setIsItemAddedToCart('added')
            setIsCartOpen(true)
            console.log("Product added to cart successfully");
          } catch(error) {
            dispatch(setError(error instanceof Error ? error.message : 'Failed to add item'));
            console.error("Error adding item to cart:", error)
          } finally {
            dispatch(setLoading(false));
          }
        
      }
    
  }


  // Add descriptionHtml, collection
  const accordionData = getAccordionData(descriptionHtml, collectionItem);



  return (
    <aside className='xl:absolute xl:z-1 xl:top-4 xl:text-lg xl:mx-0 mx-2 text-sm flex justify-items-start flex-col w-fit gap-5 font-bold cursor-pointer'>
      <div className='prodDetailsOptionsBox p-3 xl:text-lg lg:text-md text-sm flex gap-10 w-2xl rounded-lg border-black'>
        <span className=''>{title}</span>
        {/* <span>${productPrice}</span> */}
        <span>{currency.code} {formatMoney(Number(productPrice), currency.code)}</span>

      </div>


      {/* Size options display buttons */}
      <div
        className='flex flex-row justify-around xl:gap-8 gap-2 w-fit'
        key={productVariants.id}
      >
        {variants.edges.map((item: any, index: any) => {
          const prices = item.node;
          return (
            <button
              key={index}
              id={prices.id}
              onClick={(e) => selectSize(e, prices.id)}
              className={`
                ${isButtonSelected == prices.id && quantityAvailable !== 0 ? `glassBox-green` : `glassBox`} rounded-xl p-3 cursor-pointer`}
            >
              {prices.selectedOptions[1].value}
            </button>
          );
        })}
      </div>



        {/* Remaining quantity available notifier */}
        {isButtonSelected && quantityAvailable !== null && (
          <div className='prodDetailsOptionsBox w-fit p-3'>
            <p>{`Only ${quantityAvailable} item(s) remaining`}</p>
          </div>
        )}



      {/* Item is sold out notifier */}
      {quantityAvailable == 0 && (
        <div className='prodDetailsOptionsBox w-fit p-3'>
          <p>Item is sold out</p>
        </div>
      )}


        {/* Increase and Decrease quantity */}
        {isButtonSelected && (
          <div className='flex gap-5 w-fit mx-auto px-1 mt-2 '>
            <div className="flex self-center hover:bg-orange-400 p-3 rounded-lg">
              <FaMinus 
                
                onClick={() => decreaseAmt(isButtonSelected)} 
                />
            </div>
            <span className='font-bold text-lg bg-gray-200 p-4'>
              {quantity[isButtonSelected] || 1}
            </span>
            <div className="flex self-center hover:bg-orange-400 p-3 rounded-lg">
            <FaPlus 
              onClick={() => increaseAmt(isButtonSelected, quantityAvailable)} 
              />
            </div>
          </div>
        )}



        {/* Add to Cart button */}
        <button
          disabled={
            quantityAvailable === null ||
            quantityAvailable === 0 ||
            isItemAddedToCart === 'loading'
          }
          className={
            (quantityAvailable === null || quantityAvailable === 0 || isItemAddedToCart === 'loading'
              ? 'prodDetailsOptionsBox'
              : 'addToCartBox text-zinc-800 font-semibold text-xl cursor-pointer') + ' p-4 rounded-lg'
          }
          onClick={() => {
            if (
              quantityAvailable !== 0 &&
              isItemAddedToCart !== 'loading'
            ) {
              // Only pass the selected variant's quantity
              AddToCart({
                title,
                productImage,
                quantities: isButtonSelected ? quantity[isButtonSelected] || 1 : 1,
                productPrice,
                variants,
                isButtonSelected,
              });
            }
          }}
        >
          {isItemAddedToCart === 'default' && 'Add to Cart'}
          {isItemAddedToCart === 'loading' && 
            (<>&apos;Hol&apos;up, wait a minute&apos;</>)}
          {isItemAddedToCart === 'added' && 'Item added to Cart'}
        </button>

        {/* Loader and error UI */}
        {isCartLoading && (
          <div className="cart-loader">Adding to cart...</div>
        )}
        {cartError && (
          <div className="cart-error text-red-600 font-bold">{cartError}</div>
        )}


        {/* Product information rendered by an accordion */}
        {accordionData.map((data) => (
          <Accordion
            key={data.id}
            data={data}
            isActive={activeAccordionId === data.id}
            toggleAccordion={() =>
              setActiveAccordionId((previd) =>
                previd === data.id ? null : data.id
              )
            }
          />
        ))}
    </aside>
  )
}