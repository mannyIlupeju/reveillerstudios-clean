import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lines } = body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: "Missing or invalid line items" }, { status: 400 });
    }

    const countryHeader = req.headers.get('x-vercel-ip-country');
    const country = countryHeader === 'CA' ? 'CA' : 'US'; // default fallback
    const language = country === 'CA' ? 'EN' : 'EN'; // Adjust if needed

    const query = `
      mutation cartCreate($cartInput: CartInput!, $country: CountryCode, $language: LanguageCode) 
      @inContext(country: $country, language: $language) {
        cartCreate(input: $cartInput) {
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

    const response = await fetch(`https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_PUBLIC!,
      },
      body: JSON.stringify({
        query,
        variables: {
          cartInput: { lines },
          country,
          language,
        },
      }),
    });

    const data = await response.json();
    console.log("Shopify API response:", JSON.stringify(data, null, 2));

    const errors = data?.data?.cartCreate?.userErrors;
    if (errors?.length > 0) {
      return NextResponse.json({ error: "Shopify user error", details: errors }, { status: 400 });
    }

    const cart = data?.data?.cartCreate?.cart;
    if (!cart) {
      return NextResponse.json({ error: "Cart creation failed", raw: data }, { status: 500 });
    }

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Cart creation error:", error);
    return NextResponse.json({ error: 'Server error creating cart' }, { status: 500 });
  }
}
