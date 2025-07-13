import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartId, lines } = body;

    if (!cartId || !lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: "Missing cartId or invalid line items" }, { status: 400 });
    }

    const countryHeader = req.headers.get('x-vercel-ip-country');
    const country = countryHeader === 'CA' ? 'CA' : 'US';
    const language = country === 'CA' ? 'EN' : 'EN'; // Adjust if needed

    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  attributes {
                    key
                    value
                  }
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(
      `https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC!,
        },
        body: JSON.stringify({
          query,
          variables: {
            cartId,
            lines,
            country,
            language,
          },
        }),
      }
    );

    const data = await response.json();
    // console.log("Shopify API response:", JSON.stringify(data, null, 2));

    const errors = data?.data?.cartLinesAdd?.userErrors;
    if (errors?.length > 0) {
      return NextResponse.json({ error: "Shopify user error", details: errors }, { status: 400 });
    }

    const cart = data?.data?.cartLinesAdd?.cart;
    if (!cart) {
      return NextResponse.json({ error: "Failed to update cart", raw: data }, { status: 500 });
    }

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json({ error: 'Server error adding to cart' }, { status: 500 });
  }
}
