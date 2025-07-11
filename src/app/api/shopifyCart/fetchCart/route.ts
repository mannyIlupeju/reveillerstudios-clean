import fetch from 'node-fetch';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("Incoming request method:", req.method);

  try {
    const body = await req.json();
    const { cartId } = body;

    console.log("Received cartId:", cartId);

    if (!cartId) {
      return NextResponse.json({ error: "Missing cartId" }, { status: 400 });
    }

    // Get country from header (or fallback)
    const countryHeader = req.headers.get('x-vercel-ip-country');
    const country = countryHeader === 'CA' ? 'CA' : 'US';

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
            totalAmount { amount currencyCode }
            subtotalAmount { amount currencyCode }
            totalTaxAmount { amount currencyCode }
            totalDutyAmount { amount currencyCode }
          }
          buyerIdentity {
            email
            phone
            customer { id }
            countryCode
          }
        }
      }
    `;

    const response = await fetch(
      `https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": `${process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { cartId, country },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Shopify API Error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch cart data", details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const cart = data?.data?.cart;

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    console.log("Cart data:", JSON.stringify(cart, null, 2));
    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching cart data:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
