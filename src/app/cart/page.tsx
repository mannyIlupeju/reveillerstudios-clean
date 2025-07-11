import React from 'react';
import { cookies } from 'next/headers';
import CartDisplay from '../../components/CartDisplay/cartDisplay';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  try {
    const cookieStore = await cookies();
    const { cartId, userCountry } = {
      cartId: cookieStore.get('cartId')?.value,
      userCountry: cookieStore.get('user-country')?.value,
    };

    const country = userCountry === 'CA' ? 'CA' : 'US';

    console.log("Cart ID:", cartId);
    console.log("User Country:", userCountry);
    console.log("Country variable passed:", country);

    if (!cartId) {
      return (
        <main className="flex flex-col gap-8 justify-center items-center h-screen">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="text-blue-600 underline">
            Continue Shopping
          </Link>
        </main>
      );
    }

    const query = `
      query cartQuery($cartId: ID!, $country: CountryCode) 
      @inContext(country: $country) {
        cart(id: $cartId) {
          id
          createdAt
          updatedAt
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    image {
                      src
                      altText
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      vendor
                      title
                      handle
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
          buyerIdentity {
            email
            phone
            customer {
              id
            }
            countryCode
          }
        }
      }
    `;

    const response = await fetch(
      `https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC!,
        },
        body: JSON.stringify({
          query,
          variables: {
            cartId,
            country, // 👈 Pass the country variable
          },
        }),
        cache: 'no-store',
      }
    );

    console.log("Response status:", response);

    

    if (!response.ok) {
      console.error("Failed to fetch cart. Response:", response);
      throw new Error('Failed to fetch cart');
    }

    const json = await response.json();
    console.log("Cart data received:", json);
    const cart = json?.data?.cart;

    if (!cart) {
      return (
        <main className="flex flex-col gap-8 justify-center items-center h-screen">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="text-blue-600 underline">
            Continue Shopping
          </Link>
        </main>
      );
    }

    return <CartDisplay cart={cart} />;
  } catch (error) {
    console.error('Error loading cart:', error);
    return (
      <main className="flex flex-col gap-8 justify-center items-center h-screen">
        <p>Something went wrong loading your cart.</p>
        <Link href="/shop" className="text-blue-600 underline">
          Back to Shop
        </Link>
      </main>
    );
  }
}
